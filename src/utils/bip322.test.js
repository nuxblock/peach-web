import { describe, it, expect } from "vitest";
import { base58check } from "@scure/base";
import { sha256 } from "@noble/hashes/sha2.js";
import { utf8ToBytes, concatBytes, bytesToHex } from "@noble/hashes/utils.js";
import {
  signBip322Simple,
  verifyBip322Simple,
  addressFromMnemonic,
  deriveAndSign,
  MAINNET_NETWORK,
  REGTEST_NETWORK,
} from "./bip322.js";

// Reproduce BIP322's tagged-hash construction for an independent check.
function specMessageHash(message) {
  const t = sha256(utf8ToBytes("BIP0322-signed-message"));
  return sha256(concatBytes(t, t, utf8ToBytes(message)));
}

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

describe("BIP322 — message hashing (spec)", () => {
  // Canonical message-hash vectors from BIP322:
  // https://github.com/bitcoin/bips/blob/master/bip-0322.mediawiki
  it("hashes the empty message to the spec value", () => {
    expect(bytesToHex(specMessageHash(""))).toBe(
      "c90c269c4f8fcbe6880f72a721ddfbf1914268a794cbb21cfafee13770ae19f1"
    );
  });

  it("hashes 'Hello World' to the spec value", () => {
    expect(bytesToHex(specMessageHash("Hello World"))).toBe(
      "f0eb03b1a75ac6d9847f55c624a99169b5dccba2a31f5b23bea77ba270de0a7a"
    );
  });
});

describe("BIP322 simple — P2WPKH round-trip (mainnet)", () => {
  const privKey = wifToPrivKey(SPEC_KEY.wif);

  it("signs + self-verifies the empty message", () => {
    const sig = signBip322Simple({
      privKey, address: SPEC_KEY.address, message: "", network: MAINNET_NETWORK,
    });
    expect(verifyBip322Simple({
      address: SPEC_KEY.address, message: "", signatureB64: sig, network: MAINNET_NETWORK,
    })).toBe(true);
  });

  it("signs + self-verifies an arbitrary payout-flow message", () => {
    const msg = `I confirm that only I, PEACHDEADBEEF, control the address ${SPEC_KEY.address}`;
    const sig = signBip322Simple({
      privKey, address: SPEC_KEY.address, message: msg, network: MAINNET_NETWORK,
    });
    expect(verifyBip322Simple({
      address: SPEC_KEY.address, message: msg, signatureB64: sig, network: MAINNET_NETWORK,
    })).toBe(true);
  });

  it("rejects a signature when the message is tampered with", () => {
    const sig = signBip322Simple({
      privKey, address: SPEC_KEY.address, message: "original", network: MAINNET_NETWORK,
    });
    expect(verifyBip322Simple({
      address: SPEC_KEY.address, message: "tampered", signatureB64: sig, network: MAINNET_NETWORK,
    })).toBe(false);
  });

  it("rejects a signature when the address is swapped", () => {
    const sig = signBip322Simple({
      privKey, address: SPEC_KEY.address, message: "x", network: MAINNET_NETWORK,
    });
    expect(verifyBip322Simple({
      address: "bc1qsomethingelse00000000000000000000000h3rg",
      message: "x", signatureB64: sig, network: MAINNET_NETWORK,
    })).toBe(false);
  });

  it("rejects malformed signature data", () => {
    expect(verifyBip322Simple({
      address: SPEC_KEY.address,
      message: "x",
      signatureB64: "not-base64-at-all!!!",
      network: MAINNET_NETWORK,
    })).toBe(false);
  });
});

describe("BIP322 simple — regtest end-to-end", () => {
  // Standard BIP39 test mnemonic. NEVER use on mainnet.
  const MNEMONIC = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

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
      message: "I confirm that only I, PEACHDEADBEEF, control the address " + address,
      network: REGTEST_NETWORK,
    });
    expect(result.selfVerified).toBe(true);
    expect(result.address).toBe(address);
    expect(result.signature.length).toBeGreaterThan(20);
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
});
