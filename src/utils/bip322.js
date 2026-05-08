// ─── BIP322 SIMPLE — P2WPKH ──────────────────────────────────────────────────
// Hand-rolled BIP322 "simple" message signer/verifier for P2WPKH addresses.
// Used by the in-app dev tool at src/screens/dev-tools/bip322-sign.jsx.
// Regtest-only by gating; the math itself is network-agnostic.
//
// Spec: https://github.com/bitcoin/bips/blob/master/bip-0322.mediawiki
// ─────────────────────────────────────────────────────────────────────────────

import { HDKey } from "@scure/bip32";
import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import {
  Transaction, p2wpkh, Script, RawTx, RawWitness, OutScript,
  NETWORK, TEST_NETWORK, SigHash,
} from "@scure/btc-signer";
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

// BIP340-style tagged hash, used by BIP322 to bind the message.
function taggedHash(tag, msg) {
  const t = sha256(utf8ToBytes(tag));
  return sha256(concatBytes(t, t, msg));
}

// ── Address derivation from mnemonic + path ──────────────────────────────────
//
// Returns { address, privKey, pubKey } for P2WPKH at the given BIP32 path.
// Throws on invalid mnemonic or unparseable path.
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

// ── Build the BIP322 to_spend virtual transaction ────────────────────────────
//
// The to_spend tx is never broadcast; it exists only so the to_sign tx can
// reference it. Serialized in legacy (non-segwit) format for txid computation.
function buildToSpend(scriptPubKey, message) {
  const msgHash = taggedHash("BIP0322-signed-message", utf8ToBytes(message));
  const scriptSig = Script.encode(["OP_0", msgHash]);
  const bytes = RawTx.encode({
    version: 0,
    segwitFlag: false,
    inputs: [{
      txid: new Uint8Array(32),
      index: 0xFFFFFFFF,
      finalScriptSig: scriptSig,
      sequence: 0,
    }],
    outputs: [{ amount: 0n, script: scriptPubKey }],
    witnesses: undefined,
    lockTime: 0,
  });
  return { bytes, txid: sha256d(bytes) };
}

// ── Build the to_sign transaction skeleton (unsigned) ────────────────────────
function newToSignTx(toSpendTxid, scriptPubKey) {
  const tx = new Transaction({
    version: 0,
    lockTime: 0,
    allowUnknownInputs: true,
    allowUnknownOutputs: true,
    disableScriptCheck: true,
  });
  tx.addInput({
    txid: toSpendTxid,
    index: 0,
    sequence: 0,
    witnessUtxo: { script: scriptPubKey, amount: 0n },
  });
  tx.addOutput({ script: new Uint8Array([0x6a]), amount: 0n }); // OP_RETURN
  return tx;
}

// ── Sign ─────────────────────────────────────────────────────────────────────
//
// Returns the BIP322-simple signature as a base64 string (the witness stack
// of the to_sign input, encoded with Bitcoin's witness serialization).
export function signBip322Simple({ privKey, address, message, network = REGTEST_NETWORK }) {
  // Derive scriptPubKey from privkey; cross-check against the supplied address.
  const pubKey = secp256k1.getPublicKey(privKey, true);
  const { script: scriptPubKey, address: derivedAddr } = p2wpkh(pubKey, network);
  if (derivedAddr !== address) {
    throw new Error(`Address mismatch: privkey derives ${derivedAddr}, expected ${address}`);
  }

  const { txid: toSpendTxid } = buildToSpend(scriptPubKey, message);
  const tx = newToSignTx(toSpendTxid, scriptPubKey);
  tx.sign(privKey, [SigHash.ALL]);
  tx.finalize();

  const witness = tx.getInput(0).finalScriptWitness;
  if (!witness || witness.length === 0) throw new Error("Signing produced no witness");
  return base64.encode(RawWitness.encode(witness));
}

// ── Verify ───────────────────────────────────────────────────────────────────
//
// Returns true iff the signature is a valid BIP322-simple signature for
// (address, message). Used as a round-trip self-check after signing.
export function verifyBip322Simple({ address, message, signatureB64, network = REGTEST_NETWORK }) {
  let witness;
  try {
    witness = RawWitness.decode(base64.decode(signatureB64));
  } catch {
    return false;
  }
  if (!Array.isArray(witness) || witness.length !== 2) return false;

  const [sigWithSighash, pubKey] = witness;
  if (sigWithSighash.length < 9) return false;
  const sighashByte = sigWithSighash[sigWithSighash.length - 1];
  if (sighashByte !== SigHash.ALL) return false;
  const sigDer = sigWithSighash.slice(0, -1);

  // Pubkey must match the claimed address.
  let scriptPubKey;
  try {
    const pay = p2wpkh(pubKey, network);
    if (pay.address !== address) return false;
    scriptPubKey = pay.script;
  } catch {
    return false;
  }

  // Recompute the BIP143 sighash for the to_sign input.
  // For P2WPKH the scriptCode is a P2PKH script over the same pubkey hash, not
  // the witness scriptPubKey. preimageWitnessV0 already returns sha256d, so we
  // do not hash again.
  const { txid: toSpendTxid } = buildToSpend(scriptPubKey, message);
  const tx = newToSignTx(toSpendTxid, scriptPubKey);
  const pkhHash = scriptPubKey.slice(2, 22); // OP_0 PUSH20 <hash20>
  const scriptCode = OutScript.encode({ type: "pkh", hash: pkhHash });
  const sighash = tx.preimageWitnessV0(0, scriptCode, SigHash.ALL, 0n);

  try {
    return secp256k1.verify(sigDer, sighash, pubKey, { prehash: false, format: "der" });
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
  const signature = signBip322Simple({ privKey, address, message, network });
  const selfVerified = verifyBip322Simple({ address, message, signatureB64: signature, network });
  return { address, signature, selfVerified };
}
