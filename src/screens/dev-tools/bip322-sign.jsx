// ─── DEV TOOLS — BITCOIN MESSAGE SIGNER (BIP-137, regtest) ───────────────────
// In-app testing utility. Reachable only when both build-time literals are set:
//   VITE_DEV_TOOLS === "1"
//   VITE_BITCOIN_NETWORK === "REGTEST"
// Production (mainnet) builds drop this code entirely.
//
// Produces a BIP-137 / Bitcoin Signed Message signature (the same format the
// Peach mobile app produces via bitcoinjs-message) for a P2WPKH regtest
// address. The output is meant to be pasted into the existing Custom Payout
// Address flow at src/screens/settings/screens.jsx (PayoutWalletSubScreen).
//
// Crypto lives in src/utils/bip322.js (filename kept for historical reasons;
// the underlying format is BIP-137, not BIP-322).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useApi } from "../../hooks/useApi.js";
import { getSigningPeachId } from "../../utils/format.js";
import {
  deriveAndSign,
  addressFromMnemonic,
  REGTEST_NETWORK,
} from "../../utils/bip322.js";
import { CSS } from "./styles.js";

const DEFAULT_PATH = "m/84'/1'/0'/0/0";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    try { navigator.clipboard.writeText(text); } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button
      type="button"
      onClick={copy}
      title="Copy"
      className="dev-mini-btn"
    >
      {copied ? "✓ COPIED" : "COPY"}
    </button>
  );
}

export default function Bip322SignerScreen() {
  const navigate = useNavigate();
  // AppLayout owns Topbar/SideNav state + currency. Dev-tools only needs auth + isLoggedIn for the regtest gate.
  const { isLoggedIn, handleLogin } = useAuth();
  const { auth } = useApi();

  // ── Form state ──
  const [mnemonic, setMnemonic] = useState("");
  const [path, setPath] = useState(DEFAULT_PATH);
  const [peachId, setPeachId] = useState(getSigningPeachId(auth?.peachId));
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  // ── Result state ──
  const [derivedAddress, setDerivedAddress] = useState("");
  const [signature, setSignature] = useState("");
  const [selfVerified, setSelfVerified] = useState(null);
  const [error, setError] = useState("");

  // Live preview of the derived address as soon as mnemonic + path parse cleanly.
  // Pure read — no signing — so it's safe to run on every keystroke.
  const livePreview = useMemo(() => {
    if (!mnemonic.trim() || !path.trim()) return null;
    try {
      const { address: addr } = addressFromMnemonic({
        mnemonic, path, network: REGTEST_NETWORK,
      });
      return { address: addr };
    } catch {
      return null;
    }
  }, [mnemonic, path]);

  useEffect(() => {
    if (livePreview?.address) {
      setAddress(livePreview.address);
    }
  }, [livePreview]);

  function handleBuildPayoutMessage() {
    if (!peachId || !address) {
      setError("Fill in PeachID and address first.");
      return;
    }
    setError("");
    setMessage(`I confirm that only I, ${peachId}, control the address ${address}`);
  }

  function handleSign() {
    setError("");
    setSignature("");
    setSelfVerified(null);
    setDerivedAddress("");

    if (!mnemonic.trim()) return setError("Mnemonic is required.");
    if (!path.trim()) return setError("Derivation path is required.");
    if (!address.trim()) return setError("Address is required.");
    if (!message) return setError("Message is required.");

    if (!address.startsWith("bcrt1q")) {
      return setError(
        `Address does not look like a regtest P2WPKH address (expected to start with "bcrt1q"). ` +
        `This tool is regtest-only.`
      );
    }

    try {
      const { address: addr, signature: sig, selfVerified: ok } = deriveAndSign({
        mnemonic,
        path,
        expectedAddress: address,
        message,
        network: REGTEST_NETWORK,
      });
      setDerivedAddress(addr);
      setSelfVerified(ok);
      if (ok) setSignature(sig);
      else setError("Self-verify failed — refusing to display signature. Check your inputs.");
    } catch (e) {
      if (e?.code === "ADDRESS_MISMATCH") {
        setDerivedAddress(e.derivedAddress || "");
      }
      setError(e?.message || String(e));
    }
  }

  const sideMargin = 68;

  return (
    <>
      <style>{CSS}</style>
        <div className="page-wrap" style={{ marginLeft: sideMargin }}>
          <div className="dev-scroll">
            <button className="dev-back" onClick={() => navigate("/settings")}>
              ← back to Settings
            </button>
            <h1 className="dev-title">Bitcoin Message Signer (BIP-137)</h1>
            <p className="dev-sub">
              Generate a Bitcoin Signed Message (BIP-137) signature for a P2WPKH regtest address —
              the same format the Peach mobile app produces. Paste the result into Settings →
              Custom Payout Address to test the payout-address flow end-to-end.
            </p>

            <div className="dev-warn">
              <strong>Regtest only.</strong> This tool holds the seed in browser memory. Never paste a
              mainnet seed here. This screen is hidden from production builds (gated by
              VITE_DEV_TOOLS=1 AND VITE_BITCOIN_NETWORK=REGTEST at build time).
            </div>

            <div className="dev-card">
              {/* Mnemonic */}
              <div className="dev-row">
                <div className="dev-label">
                  Mnemonic (12 / 24 BIP39 words)
                </div>
                <textarea
                  className="dev-textarea"
                  rows={3}
                  spellCheck="false"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  value={mnemonic}
                  onChange={e => setMnemonic(e.target.value)}
                  placeholder="abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
                />
              </div>

              {/* Derivation path */}
              <div className="dev-row">
                <div className="dev-label">
                  Derivation path
                  <span className="dev-label-help">regtest uses coin-type 1'</span>
                </div>
                <input
                  className="dev-input"
                  spellCheck="false"
                  autoComplete="off"
                  value={path}
                  onChange={e => setPath(e.target.value)}
                  placeholder={DEFAULT_PATH}
                />
                {livePreview && (
                  <div style={{ fontSize: ".74rem", color: "var(--black-65)", marginTop: 6, fontFamily: "monospace", wordBreak: "break-all" }}>
                    derives → {livePreview.address}
                  </div>
                )}
              </div>

              {/* PeachID */}
              <div className="dev-row">
                <div className="dev-label">
                  PeachID
                  <span className="dev-label-help">auto-filled from your session</span>
                </div>
                <input
                  className="dev-input"
                  spellCheck="false"
                  autoComplete="off"
                  value={peachId}
                  onChange={e => setPeachId(e.target.value)}
                  placeholder="PEACH00000000"
                />
              </div>

              {/* Address */}
              <div className="dev-row">
                <div className="dev-label">
                  Address (bcrt1q…)
                </div>
                <input
                  className="dev-input"
                  spellCheck="false"
                  autoComplete="off"
                  value={address}
                  onChange={e => setAddress(e.target.value.trim())}
                  placeholder="bcrt1q…"
                />
              </div>

              {/* Message */}
              <div className="dev-row">
                <div className="dev-label">
                  Message
                  <button
                    type="button"
                    onClick={handleBuildPayoutMessage}
                    disabled={!peachId || !address}
                    className="dev-mini-btn"
                  >
                    BUILD PAYOUT-FLOW MESSAGE
                  </button>
                </div>
                <textarea
                  className="dev-textarea"
                  rows={2}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder='I confirm that only I, PEACH00000000, control the address bcrt1q…'
                />
              </div>

              <button
                type="button"
                onClick={handleSign}
                style={{
                  width:"100%", padding:"13px 20px", borderRadius:999, border:"none",
                  background:"var(--grad)", color:"var(--surface)",
                  fontFamily:"'Baloo 2',cursive", fontSize:".85rem",
                  fontWeight:800, letterSpacing:".06em", textTransform:"uppercase", cursor:"pointer",
                  marginTop: 4,
                }}
              >
                Derive &amp; Sign
              </button>
            </div>

            {/* Result panel */}
            {(error || derivedAddress || signature || selfVerified !== null) && (
              <div className="dev-card">
                {error && (
                  <div className="dev-error">
                    {error}
                    {derivedAddress && (
                      <div style={{ marginTop: 6, fontFamily: "monospace", fontSize: ".75rem", wordBreak: "break-all" }}>
                        derived: {derivedAddress}
                      </div>
                    )}
                  </div>
                )}

                {derivedAddress && !error && (
                  <div className="dev-status-row dev-status-ok">
                    <span>Derived address matches input</span>
                    <span style={{ fontFamily: "monospace", fontSize: ".74rem", fontWeight: 600 }}>
                      {derivedAddress}
                    </span>
                  </div>
                )}

                {selfVerified !== null && (
                  <div className={`dev-status-row ${selfVerified ? "dev-status-ok" : "dev-status-bad"}`}>
                    <span>Self-verify</span>
                    <span>{selfVerified ? "PASS" : "FAIL"}</span>
                  </div>
                )}

                {signature && (
                  <div style={{ marginTop: 12 }}>
                    <div className="dev-label">
                      Signature (BIP-137 Bitcoin Signed Message, base64)
                    </div>
                    <div className="dev-sig-box">
                      <textarea
                        className="dev-sig-textarea"
                        readOnly
                        rows={4}
                        value={signature}
                        onClick={e => e.target.select()}
                      />
                      <div className="dev-sig-copy">
                        <CopyButton text={signature} />
                      </div>
                    </div>
                    <p style={{ fontSize: ".74rem", color: "var(--black-65)", marginTop: 8 }}>
                      Paste this into Settings → Custom Payout Address (signature field) along with the address above.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {!isLoggedIn && (
          <div className="auth-screen-overlay">
            <div className="auth-popup">
              <div className="auth-popup-title">Authentication required</div>
              <div className="auth-popup-sub">Please authenticate before using developer tools.</div>
              <button className="auth-popup-btn" onClick={handleLogin}>Log in</button>
            </div>
          </div>
        )}
    </>
  );
}
