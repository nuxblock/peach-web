import { HDKey } from "@scure/bip32";
import { p2wpkh } from "@scure/btc-signer";
import { NETWORK, TEST_NETWORK } from "@scure/btc-signer/utils.js";

const REGTEST_NETWORK = { ...TEST_NETWORK, bech32: "bcrt" };

// BIP32 version bytes — needed so HDKey accepts both multisigXpub (mainnet) and tpub (testnet/regtest)
const MAINNET_VERSIONS = { private: 0x0488ADE4, public: 0x0488B21E };
const TESTNET_VERSIONS = { private: 0x04358394, public: 0x043587CF };

function getVersions(multisigXpub) {
  return multisigXpub.startsWith("tpub") ? TESTNET_VERSIONS : MAINNET_VERSIONS;
}

function toHex(bytes) {
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Detect network from multisigXpub prefix.
 * multisigXpub = mainnet, tpub = testnet/regtest
 */
function getNetwork(multisigXpub) {
  return multisigXpub.startsWith("tpub") ? REGTEST_NETWORK : NETWORK;
}

/**
 * Derive the escrow public key for a sell offer.
 *
 * Path: m/84'/{coin}'/3/{offerId}  (version 2 — non-hardened last two levels)
 * The multisigXpub is at depth m/84'/{coin}', so we derive /3/{offerId} from it.
 *
 * @param {string} multisigXpub  Base58-encoded extended public key (multisigXpub or tpub)
 * @param {number} offerId  Numeric offer ID from the server
 * @returns {string} Compressed public key as hex (33 bytes)
 */
export function deriveEscrowPubKey(multisigXpub, offerId) {
  const node = HDKey.fromExtendedKey(multisigXpub, getVersions(multisigXpub));
  const child = node.deriveChild(3).deriveChild(offerId);
  return toHex(child.publicKey);
}

/**
 * Derive a return (refund) address for a sell offer.
 *
 * Path: m/84'/{coin}'/1/{index}  (non-hardened — derivable from multisigXpub)
 * Returns a native segwit (P2WPKH) address: bc1q... (mainnet) or bcrt1q... (regtest)
 *
 * @param {string} multisigXpub  Base58-encoded extended public key
 * @param {number} index  Address index (from server — incremented per offer to avoid reuse)
 * @returns {string} P2WPKH bech32 address
 */
export function deriveReturnAddress(multisigXpub, index) {
  const network = getNetwork(multisigXpub);
  const node = HDKey.fromExtendedKey(multisigXpub, getVersions(multisigXpub));
  const child = node.deriveChild(1).deriveChild(index);
  return p2wpkh(child.publicKey, network).address;
}
