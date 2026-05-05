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

describe("validateBIP322Signature", () => {
  it("accepts valid base64 string", () => {
    expect(validateBIP322Signature("SGVsbG8gV29ybGQhIFRlc3Q=").valid).toBe(true);
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
