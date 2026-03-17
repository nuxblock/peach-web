import { HDKey } from "@scure/bip32";

/**
 * Derive the escrow public key for a sell offer.
 *
 * Path: m/84'/{coin}'/3/{offerId}  (version 2 — non-hardened last two levels)
 * The xpub is at depth m/84'/{coin}', so we derive /3/{offerId} from it.
 *
 * @param {string} xpub  Base58-encoded extended public key (xpub or tpub)
 * @param {number} offerId  Numeric offer ID from the server
 * @returns {string} Compressed public key as hex (33 bytes)
 */
export function deriveEscrowPubKey(xpub, offerId) {
  const node = HDKey.fromExtendedKey(xpub);
  const child = node.deriveChild(3).deriveChild(offerId);
  return Buffer.from(child.publicKey).toString("hex");
}
