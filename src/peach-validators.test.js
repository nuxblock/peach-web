import { describe, it, expect } from "vitest";
import {
  validateBtcAddress,
  validateIBAN,
  validatePhone,
  validateBIP322Signature,
  validateFeeRate,
} from "./peach-validators.js";

// ── validateBtcAddress ───────────────────────────────────────────────────────

describe("validateBtcAddress", () => {
  // Valid addresses (real test vectors)
  it("accepts valid P2PKH address", () => {
    expect(validateBtcAddress("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa").valid).toBe(true);
  });

  it("accepts valid P2SH address", () => {
    expect(validateBtcAddress("3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy").valid).toBe(true);
  });

  it("accepts valid bech32 (SegWit v0) address", () => {
    expect(validateBtcAddress("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4").valid).toBe(true);
  });

  it("accepts valid bech32m (Taproot) address", () => {
    // BIP350 test vector — witness v1, 32-byte program
    expect(validateBtcAddress("bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0").valid).toBe(true);
  });

  // Invalid addresses
  it("rejects empty input", () => {
    expect(validateBtcAddress("").valid).toBe(false);
    expect(validateBtcAddress("  ").valid).toBe(false);
    expect(validateBtcAddress(null).valid).toBe(false);
  });

  it("rejects unknown prefix", () => {
    const result = validateBtcAddress("2N3oefVeg6stiTb5Kh3ozCRPpCK");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("must start with");
  });

  it("rejects P2PKH with bad checksum", () => {
    // Last character changed from 'a' to 'b'
    const result = validateBtcAddress("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNb");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("checksum");
  });

  it("rejects uppercase bech32", () => {
    const result = validateBtcAddress("BC1QW508D6QEJXTDG4Y5R3ZARVARY0C5XW7KV8F3T4");
    expect(result.valid).toBe(false);
  });

  it("rejects truncated bech32", () => {
    const result = validateBtcAddress("bc1qw508d6q");
    expect(result.valid).toBe(false);
  });

  // Default arg = mainnet (regression — confirms backwards compatibility)
  it("defaults to mainnet when network arg omitted", () => {
    expect(validateBtcAddress("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4").valid).toBe(true);
  });
});

// ── validateBtcAddress — regtest ─────────────────────────────────────────────

describe("validateBtcAddress — regtest", () => {
  // Real regtest vectors lifted from the Peach mobile app test suite
  // (peach-app/src/utils/validation/rules.spec.ts).

  it("accepts valid bcrt1q (P2WPKH, witness v0)", () => {
    expect(
      validateBtcAddress("bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0", "regtest").valid
    ).toBe(true);
  });

  it("accepts valid bcrt1p (Taproot, bech32m)", () => {
    expect(
      validateBtcAddress("bcrt1pvsl0uj3m2wew9fngpzqyga2jdsfngjkwcj5rg8qwpf9y6graadeqr7k9yu", "regtest").valid
    ).toBe(true);
  });

  it("rejects mainnet bc1q when network is regtest", () => {
    const result = validateBtcAddress("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4", "regtest");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("bcrt1");
  });

  it("rejects bcrt1 when network is mainnet (default)", () => {
    const result = validateBtcAddress("bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("must start with");
  });

  it("rejects legacy P2PKH (1…) when network is regtest", () => {
    const result = validateBtcAddress("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "regtest");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("bcrt1");
  });

  it("rejects legacy P2SH (3…) when network is regtest", () => {
    const result = validateBtcAddress("3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy", "regtest");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("bcrt1");
  });

  it("rejects uppercase bcrt1", () => {
    const result = validateBtcAddress("BCRT1QM50KHYUNELHJZHCKVGY3QJ0HN7XJZZWLJHFGD0", "regtest");
    expect(result.valid).toBe(false);
  });
});

// ── validateIBAN ─────────────────────────────────────────────────────────────

describe("validateIBAN", () => {
  it("accepts valid IBAN with spaces", () => {
    expect(validateIBAN("DE89 3704 0044 0532 0130 00").valid).toBe(true);
  });

  it("accepts valid IBAN without spaces", () => {
    expect(validateIBAN("GB29NWBK60161331926819").valid).toBe(true);
  });

  it("rejects empty input", () => {
    expect(validateIBAN("").valid).toBe(false);
  });

  it("rejects too short", () => {
    expect(validateIBAN("DE89").valid).toBe(false);
  });

  it("rejects invalid format", () => {
    expect(validateIBAN("INVALIDIBAN1234567").valid).toBe(false);
  });
});

// ── validatePhone ────────────────────────────────────────────────────────────

describe("validatePhone", () => {
  it("accepts valid E.164 number", () => {
    expect(validatePhone("+34612345678").valid).toBe(true);
  });

  it("accepts number with spaces", () => {
    expect(validatePhone("+1 234 567 8901").valid).toBe(true);
  });

  it("rejects missing +", () => {
    const result = validatePhone("34612345678");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("+");
  });

  it("rejects too short", () => {
    expect(validatePhone("+123").valid).toBe(false);
  });

  it("enforces expected prefix", () => {
    expect(validatePhone("+34612345678", "+34").valid).toBe(true);
    const result = validatePhone("+44612345678", "+34");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("+34");
  });
});

// ── validateBIP322Signature ──────────────────────────────────────────────────
// Field name says BIP322; payload is actually BIP-137 (Bitcoin Signed Message),
// cross-platform with mobile. Validator enforces the 88-base64-char / 65-byte
// shape so users can't paste legacy BIP322-simple sigs (~144 chars).

describe("validateBIP322Signature", () => {
  // Real BIP-137 fixture from the mobile app's test suite. Pinned here so
  // changes to the validator don't accidentally reject mobile-produced sigs.
  const MOBILE_FIXTURE_SIG =
    "H2i3dzh/dYWjpsRJmrl1C9ZKMkg1PitsM/zdh7RIQ6PrLTaYa4Wmm0fKRsLAhaDIqwg1C51StxG5JMj3sF6Yqkc=";

  it("accepts a valid 88-char BIP-137 signature", () => {
    const result = validateBIP322Signature(MOBILE_FIXTURE_SIG);
    expect(result.valid).toBe(true);
    expect(result.error).toBe(null);
  });

  it("rejects empty", () => {
    expect(validateBIP322Signature("").valid).toBe(false);
  });

  it("rejects too short", () => {
    expect(validateBIP322Signature("short").valid).toBe(false);
  });

  it("rejects invalid base64 chars", () => {
    expect(validateBIP322Signature("not!valid@base64$$chars").valid).toBe(false);
  });

  it("rejects a legacy BIP322-simple-shaped signature (~144 chars)", () => {
    // Realistic length for the old BIP322-simple witness-only base64 output.
    const bip322Simple =
      "AkgwRQIhAKWu8tbg/7oZfT/Bq6FG5ksXf6QL4DnGtePuRMwkWqQoAiBw9oDIJbdrNwVVJZsDGvhz7x6E1HR4D/KqiHYTMe9D+wEhAsfxIAMZZEKUPYWI4BruhAQjzFT8FSFSajuFwrDL1Yhy";
    expect(bip322Simple.length).toBeGreaterThan(88);
    const result = validateBIP322Signature(bip322Simple);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/88 base64 characters|BIP-137/);
  });

  it("rejects an 88-char base64 string whose decoded length isn't 65 bytes", () => {
    // 88 chars without padding sometimes decodes to a different length. Use a
    // string of exactly 88 chars with the wrong-shaped padding/end.
    // "A" * 87 + "=" decodes to 65 bytes (66 - 1 pad) — that's actually 65,
    // so this would pass length but might fail header. Test with a 64-byte
    // payload padded to 88 chars: base64 of 66 bytes is 88 chars.
    const sixtySixBytes = new Array(66).fill(0x20).map(() => "A").join("");
    // Just craft a string with valid base64 of 66 zero bytes:
    const wrongDecode = btoa(String.fromCharCode(...new Uint8Array(66)));
    expect(wrongDecode.length).toBe(88);
    const result = validateBIP322Signature(wrongDecode);
    // 66-byte decode → fails the strict 65-byte check (or the header range).
    expect(result.valid).toBe(false);
  });

  it("rejects a 65-byte signature with an out-of-range header byte", () => {
    const bytes = new Uint8Array(65);
    bytes[0] = 50; // out of valid 27..42 range
    const b64 = btoa(String.fromCharCode(...bytes));
    expect(b64.length).toBe(88);
    const result = validateBIP322Signature(b64);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/header byte/);
  });
});

// ── validateFeeRate ──────────────────────────────────────────────────────────

describe("validateFeeRate", () => {
  it("accepts valid fee rates", () => {
    expect(validateFeeRate(1).valid).toBe(true);
    expect(validateFeeRate(50).valid).toBe(true);
    expect(validateFeeRate(150).valid).toBe(true);
  });

  it("rejects empty", () => {
    expect(validateFeeRate("").valid).toBe(false);
    expect(validateFeeRate(null).valid).toBe(false);
  });

  it("rejects below minimum", () => {
    expect(validateFeeRate(0).valid).toBe(false);
  });

  it("rejects above maximum", () => {
    expect(validateFeeRate(151).valid).toBe(false);
  });

  it("rejects non-integer", () => {
    expect(validateFeeRate(1.5).valid).toBe(false);
  });

  it("rejects NaN", () => {
    expect(validateFeeRate("abc").valid).toBe(false);
  });
});
