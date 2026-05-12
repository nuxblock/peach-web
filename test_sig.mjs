import { signBip322Simple, verifyBip322Simple, MAINNET_NETWORK } from "./src/utils/bip322.js";
import { base58check } from "@scure/base";
import { sha256 } from "@noble/hashes/sha2.js";

// Decode a WIF (compressed, mainnet) into the 32-byte secret.
function wifToPrivKey(wif) {
  const decoded = base58check(sha256).decode(wif);
  if (decoded[0] !== 0x80) throw new Error("WIF: bad prefix");
  return decoded.slice(1, 33);
}

const SPEC_KEY = {
  wif: "L3VFeEujGtevx9w18HD1fhRbCH67Az2dpCymeRE1SoPK6XQtaN2k",
  address: "bc1q9vza2e8x573nczrlzms0wvx3gsqjx7vavgkx0l",
};

const privKey = wifToPrivKey(SPEC_KEY.wif);
const sig = signBip322Simple({
  privKey, address: SPEC_KEY.address, message: "Hello World", network: MAINNET_NETWORK,
});
console.log("=== Example BIP322-simple Signature ===");
console.log("Message:", "Hello World");
console.log("Address:", SPEC_KEY.address);
console.log("Signature (base64):", sig);
console.log("Signature length:", sig.length, "chars");
console.log("Verified:", verifyBip322Simple({
  address: SPEC_KEY.address, message: "Hello World", signatureB64: sig, network: MAINNET_NETWORK,
}));
