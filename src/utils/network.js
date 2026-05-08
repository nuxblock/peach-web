// Build-time configuration for the API endpoint and Bitcoin chain.
// Driven by two Vite env vars:
//   VITE_API_URL          — full origin of the Peach API (no /v1 suffix)
//                           e.g. https://api-regtest.peachbitcoin.com
//   VITE_BITCOIN_NETWORK  — "BITCOIN" | "REGTEST"
//
// Both are inlined by Vite at build time. The two are independent: changing
// the chain does not change the API URL and vice versa. Misconfiguration is
// the operator's problem, not the codebase's.

// Direct `import.meta.env.X === "literal"` lets Vite constant-fold the
// comparison at build time and tree-shake the unused branches.
export const IS_REGTEST = import.meta.env.VITE_BITCOIN_NETWORK === "REGTEST";
export const BITCOIN_NETWORK = IS_REGTEST ? "regtest" : "mainnet";

export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
export const API_V1 = `${API_URL}/v1`;
export const API_V069 = `${API_URL}/v069`;

export const MOBILE_APP_SCHEME = IS_REGTEST ? "peachbitcoinregtest" : "peachbitcoin";
