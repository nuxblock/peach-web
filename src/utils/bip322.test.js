import { describe, it, expect } from "vitest";
import { base58check, base64 } from "@scure/base";
import { sha256 } from "@noble/hashes/sha2.js";
import {
  signBitcoinMessage,
  verifyBitcoinMessage,
  bitcoinMessageHash,
  addressFromMnemonic,
  deriveAndSign,
  MAINNET_NETWORK,
  REGTEST_NETWORK,
} from "./bip322.js";

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

// Standard BIP39 test mnemonic. NEVER use on mainnet.
const MNEMONIC =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

describe("Bitcoin Signed Message — preimage hash", () => {
  it("returns a 32-byte hash", () => {
    expect(bitcoinMessageHash("Hello").length).toBe(32);
    expect(bitcoinMessageHash("").length).toBe(32);
  });

  it("is deterministic", () => {
    const a = bitcoinMessageHash("Peach");
    const b = bitcoinMessageHash("Peach");
    expect(Array.from(a)).toEqual(Array.from(b));
  });

  it("differs for different messages", () => {
    const a = bitcoinMessageHash("a");
    const b = bitcoinMessageHash("b");
    expect(Array.from(a)).not.toEqual(Array.from(b));
  });
});

describe("BIP-137 P2WPKH round-trip (mainnet)", () => {
  const privKey = wifToPrivKey(SPEC_KEY.wif);

  it("produces a 65-byte (88 base64 char) signature", () => {
    const sig = signBitcoinMessage({
      privKey, address: SPEC_KEY.address, message: "hi", network: MAINNET_NETWORK,
    });
    expect(sig.length).toBe(88);
    expect(base64.decode(sig).length).toBe(65);
  });

  it("uses a compressed P2PKH-style header (31..34)", () => {
    const sig = signBitcoinMessage({
      privKey, address: SPEC_KEY.address, message: "x", network: MAINNET_NETWORK,
    });
    const header = base64.decode(sig)[0];
    expect(header).toBeGreaterThanOrEqual(31);
    expect(header).toBeLessThanOrEqual(34);
  });

  it("signs + self-verifies the empty message", () => {
    const sig = signBitcoinMessage({
      privKey, address: SPEC_KEY.address, message: "", network: MAINNET_NETWORK,
    });
    expect(verifyBitcoinMessage({
      address: SPEC_KEY.address, message: "", signatureB64: sig, network: MAINNET_NETWORK,
    })).toBe(true);
  });

  it("signs + self-verifies an arbitrary payout-flow message", () => {
    const msg = `I confirm that only I, peach03cf9e9a, control the address ${SPEC_KEY.address}`;
    const sig = signBitcoinMessage({
      privKey, address: SPEC_KEY.address, message: msg, network: MAINNET_NETWORK,
    });
    expect(verifyBitcoinMessage({
      address: SPEC_KEY.address, message: msg, signatureB64: sig, network: MAINNET_NETWORK,
    })).toBe(true);
  });

  it("rejects a signature when the message is tampered with", () => {
    const sig = signBitcoinMessage({
      privKey, address: SPEC_KEY.address, message: "original", network: MAINNET_NETWORK,
    });
    expect(verifyBitcoinMessage({
      address: SPEC_KEY.address, message: "tampered", signatureB64: sig, network: MAINNET_NETWORK,
    })).toBe(false);
  });

  it("rejects a signature when the address is swapped", () => {
    const sig = signBitcoinMessage({
      privKey, address: SPEC_KEY.address, message: "x", network: MAINNET_NETWORK,
    });
    expect(verifyBitcoinMessage({
      address: "bc1qsomethingelse00000000000000000000000h3rg",
      message: "x", signatureB64: sig, network: MAINNET_NETWORK,
    })).toBe(false);
  });

  it("returns false for malformed base64 (no throw)", () => {
    expect(verifyBitcoinMessage({
      address: SPEC_KEY.address,
      message: "x",
      signatureB64: "not-base64-at-all!!!",
      network: MAINNET_NETWORK,
    })).toBe(false);
  });

  it("returns false when the signature length is wrong", () => {
    expect(verifyBitcoinMessage({
      address: SPEC_KEY.address,
      message: "x",
      signatureB64: base64.encode(new Uint8Array(64)), // 1 byte short
      network: MAINNET_NETWORK,
    })).toBe(false);
  });

  it("returns false when the header byte is out of range", () => {
    const sig = signBitcoinMessage({
      privKey, address: SPEC_KEY.address, message: "x", network: MAINNET_NETWORK,
    });
    const raw = base64.decode(sig);
    raw[0] = 100; // out of valid 27..42 range
    expect(verifyBitcoinMessage({
      address: SPEC_KEY.address,
      message: "x",
      signatureB64: base64.encode(raw),
      network: MAINNET_NETWORK,
    })).toBe(false);
  });

  it("returns false when a body byte is tampered with", () => {
    const sig = signBitcoinMessage({
      privKey, address: SPEC_KEY.address, message: "x", network: MAINNET_NETWORK,
    });
    const raw = base64.decode(sig);
    raw[10] ^= 0xff; // corrupt the r-component
    expect(verifyBitcoinMessage({
      address: SPEC_KEY.address,
      message: "x",
      signatureB64: base64.encode(raw),
      network: MAINNET_NETWORK,
    })).toBe(false);
  });
});

describe("BIP-137 — regtest end-to-end", () => {
  it("derives a bcrt1q address from mnemonic + path", () => {
    const { address } = addressFromMnemonic({
      mnemonic: MNEMONIC,
      path: "m/84'/1'/0'/0/0",
      network: REGTEST_NETWORK,
    });
    expect(address).toMatch(/^bcrt1q/);
  });

  it("deriveAndSign passes self-verify on regtest", () => {
    const { address } = addressFromMnemonic({
      mnemonic: MNEMONIC,
      path: "m/84'/1'/0'/0/0",
      network: REGTEST_NETWORK,
    });
    const result = deriveAndSign({
      mnemonic: MNEMONIC,
      path: "m/84'/1'/0'/0/0",
      expectedAddress: address,
      message: `I confirm that only I, peach03cf9e9a, control the address ${address}`,
      network: REGTEST_NETWORK,
    });
    expect(result.selfVerified).toBe(true);
    expect(result.address).toBe(address);
    expect(result.signature.length).toBe(88);
  });

  it("throws ADDRESS_MISMATCH when expected address doesn't match the path", () => {
    expect(() => deriveAndSign({
      mnemonic: MNEMONIC,
      path: "m/84'/1'/0'/0/0",
      expectedAddress: "bcrt1qwrongaddress00000000000000000000000abc",
      message: "x",
      network: REGTEST_NETWORK,
    })).toThrow(/ADDRESS_MISMATCH|does not match/);
  });

  it("rejects an invalid mnemonic", () => {
    expect(() => addressFromMnemonic({
      mnemonic: "not a valid mnemonic at all just twelve random english words here",
      path: "m/84'/1'/0'/0/0",
      network: REGTEST_NETWORK,
    })).toThrow(/Invalid BIP39/);
  });

  it("signBitcoinMessage throws when address doesn't match the privkey", () => {
    const { privKey } = addressFromMnemonic({
      mnemonic: MNEMONIC,
      path: "m/84'/1'/0'/0/0",
      network: REGTEST_NETWORK,
    });
    expect(() => signBitcoinMessage({
      privKey,
      address: "bcrt1qj8f2z28wvqtamu7khkmhw7z025gdwr7e7n6e2n", // some other address
      message: "x",
      network: REGTEST_NETWORK,
    })).toThrow(/Address mismatch/);
  });
});

// Cross-platform compat fixture: signature produced by the Peach mobile app
// (bitcoinjs-message.sign with compressed=true) on a regtest P2WPKH address.
// Sourced from peach-app/src/utils/validation/isValidBitcoinSignature.spec.ts.
// If this test breaks, web's BIP-137 implementation has diverged from mobile.
describe("BIP-137 — mobile cross-compat fixture", () => {
  it("verifies a real mobile-produced signature", () => {
    const address = "bcrt1qj8f2z28wvqtamu7khkmhw7z025gdwr7e7n6e2n";
    const message =
      "I confirm that only I, peach033110c3, control the address " + address;
    const signatureB64 =
      "H2i3dzh/dYWjpsRJmrl1C9ZKMkg1PitsM/zdh7RIQ6PrLTaYa4Wmm0fKRsLAhaDIqwg1C51StxG5JMj3sF6Yqkc=";
    expect(verifyBitcoinMessage({
      address, message, signatureB64, network: REGTEST_NETWORK,
    })).toBe(true);
  });
});
