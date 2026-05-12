// ─── BITCOIN SIGNED MESSAGE (BIP-137 / ELECTRUM) ─────────────────────────────
// Compact recoverable ECDSA signature over the legacy "Bitcoin Signed Message"
// preimage. Same format produced by Electrum, bitcoinjs-message (with
// compressed=true), and the Peach mobile app's PeachWallet.signMessage. The
// mobile app's verifier (isValidBitcoinSignature.ts) accepts this directly via
// bitcoinjs-message.verify — that's its primary verification path.
//
// Filename is kept as `bip322.js` for historical reasons; the encrypted blob
// field is still `bip322Signature` (cross-platform field, do not rename). The
// payload is technically BIP-137, not BIP-322 — see peach-app/src/utils/
// validation/isValidBitcoinSignature.ts for the mobile-side verifier.
//
// Signature format:
//   [ header (1 byte) | r (32 bytes) | s (32 bytes) ]  = 65 bytes
//   base64-encoded → exactly 88 ASCII chars (one '=' pad)
//
//   header = 27 + 4 (compressed) + recovery_id  → 31..34 for compressed P2PKH
//   This is what bitcoinjs-message emits with `compressed=true`; its verifier
//   then recovers the pubkey and matches against P2PKH / P2SH-P2WPKH / P2WPKH
//   variants of the recovered key.
// ─────────────────────────────────────────────────────────────────────────────

import { HDKey } from "@scure/bip32";
import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { p2wpkh, NETWORK, TEST_NETWORK } from "@scure/btc-signer";
import { sha256 } from "@noble/hashes/sha2.js";
import { concatBytes, utf8ToBytes } from "@noble/hashes/utils.js";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { base64 } from "@scure/base";

export const REGTEST_NETWORK = { ...TEST_NETWORK, bech32: "bcrt" };
export const MAINNET_NETWORK = NETWORK;
export const TESTNET_NETWORK = TEST_NETWORK;

const TESTNET_VERSIONS = { private: 0x04358394, public: 0x043587CF };
const MAINNET_VERSIONS = { private: 0x0488ADE4, public: 0x0488B21E };

function sha256d(bytes) { return sha256(sha256(bytes)); }

// Bitcoin varint, little-endian. Used in the message preimage.
function varintLE(n) {
  if (n < 0xfd) return new Uint8Array([n]);
  if (n <= 0xffff) {
    return new Uint8Array([0xfd, n & 0xff, (n >> 8) & 0xff]);
  }
  if (n <= 0xffffffff) {
    return new Uint8Array([
      0xfe,
      n & 0xff,
      (n >> 8) & 0xff,
      (n >> 16) & 0xff,
      (n >>> 24) & 0xff,
    ]);
  }
  throw new Error("message too long");
}

// "\x18Bitcoin Signed Message:\n" — the 0x18 (=24) is the length of the
// following ASCII string, encoded as a single varint byte (< 0xfd).
const BTC_MSG_MAGIC = utf8ToBytes("\x18Bitcoin Signed Message:\n");

// Double-SHA256 of the legacy Bitcoin-Signed-Message preimage.
// Exported for unit testing the preimage construction.
export function bitcoinMessageHash(message) {
  const m = utf8ToBytes(message);
  return sha256d(concatBytes(BTC_MSG_MAGIC, varintLE(m.length), m));
}

// ── Address derivation from mnemonic + path ──────────────────────────────────
//
// Returns { address, scriptPubKey, privKey, pubKey } for P2WPKH at the given
// BIP32 path. Throws on invalid mnemonic or unparseable path.
export function addressFromMnemonic({ mnemonic, path, network = REGTEST_NETWORK }) {
  const trimmed = mnemonic.trim().split(/\s+/).join(" ");
  if (!bip39.validateMnemonic(trimmed, wordlist)) {
    throw new Error("Invalid BIP39 mnemonic");
  }
  const seed = bip39.mnemonicToSeedSync(trimmed);
  const versions = network === MAINNET_NETWORK ? MAINNET_VERSIONS : TESTNET_VERSIONS;
  const root = HDKey.fromMasterSeed(seed, versions);
  const child = root.derive(path);
  if (!child.privateKey) throw new Error("Path did not yield a private key");
  const { script, address } = p2wpkh(child.publicKey, network);
  return {
    address,
    scriptPubKey: script,
    privKey: child.privateKey,
    pubKey: child.publicKey,
  };
}

// ── Sign ─────────────────────────────────────────────────────────────────────
//
// Produces a 65-byte recoverable ECDSA signature over the Bitcoin Signed
// Message preimage, base64-encoded to 88 chars. The supplied address must
// derive from the privKey (P2WPKH on the chosen network) — guards against
// caller mistakes.
export function signBitcoinMessage({ privKey, address, message, network = REGTEST_NETWORK }) {
  const pubKey = secp256k1.getPublicKey(privKey, true);
  const { address: derivedAddr } = p2wpkh(pubKey, network);
  if (derivedAddr !== address) {
    throw new Error(`Address mismatch: privkey derives ${derivedAddr}, expected ${address}`);
  }

  const hash = bitcoinMessageHash(message);
  // @noble/curves "recovered" format → 65 bytes: [recovery (1) | r (32) | s (32)].
  // We pass prehash:false because we already double-SHA256'd in bitcoinMessageHash.
  const recovered = secp256k1.sign(hash, privKey, {
    format: "recovered",
    lowS: true,
    prehash: false,
  });
  if (recovered.length !== 65) throw new Error("recovered signature must be 65 bytes");
  const recovery = recovered[0];
  const compact = recovered.subarray(1); // 64 bytes: r || s

  const header = 31 + recovery; // compressed P2PKH-style header (31..34)
  const out = new Uint8Array(65);
  out[0] = header;
  out.set(compact, 1);
  return base64.encode(out);
}

// ── Verify ───────────────────────────────────────────────────────────────────
//
// Returns true iff `signatureB64` is a valid BIP-137 signature for
// (address, message) on the given network. Recovers the pubkey from the
// signature, derives the P2WPKH address, compares against `address`.
//
// For the web's payout flow we only ever sign for P2WPKH, so this matcher is
// scoped to P2WPKH. The mobile-side verifier (bitcoinjs-message) additionally
// tries P2PKH / P2SH-P2WPKH; expand here if we ever need that.
export function verifyBitcoinMessage({ address, message, signatureB64, network = REGTEST_NETWORK }) {
  let raw;
  try { raw = base64.decode(signatureB64); } catch { return false; }
  if (raw.length !== 65) return false;

  const header = raw[0];
  if (header < 27 || header > 42) return false;
  const recovery = (header - 27) & 3;

  // Repack into @noble's "recovered" format: [recovery | r | s].
  const recoveredBytes = new Uint8Array(65);
  recoveredBytes[0] = recovery;
  recoveredBytes.set(raw.subarray(1), 1);

  const hash = bitcoinMessageHash(message);
  let pubKey;
  try {
    const sigObj = secp256k1.Signature.fromBytes(recoveredBytes, "recovered");
    pubKey = sigObj.recoverPublicKey(hash).toBytes(true); // compressed
  } catch {
    return false;
  }

  try {
    const { address: derived } = p2wpkh(pubKey, network);
    return derived === address;
  } catch {
    return false;
  }
}

// ── End-to-end: derive → sign → self-verify ──────────────────────────────────
//
// Convenience used by the dev-tool screen. Throws if anything fails.
// Returns { address (derived), signature, selfVerified }.
export function deriveAndSign({ mnemonic, path, expectedAddress, message, network = REGTEST_NETWORK }) {
  const { address, privKey } = addressFromMnemonic({ mnemonic, path, network });
  if (expectedAddress && address !== expectedAddress) {
    const e = new Error(
      `Derived address (${address}) does not match the address you provided (${expectedAddress}). ` +
      `Check the derivation path and the network.`
    );
    e.code = "ADDRESS_MISMATCH";
    e.derivedAddress = address;
    throw e;
  }
  const signature = signBitcoinMessage({ privKey, address, message, network });
  const selfVerified = verifyBitcoinMessage({ address, message, signatureB64: signature, network });
  return { address, signature, selfVerified };
}
