# PGP Interop Debug — openpgp.js v6.3.0 (web) ↔ GopenPGP v0.38.2 (mobile)

**Problem:** When the web app encrypts and signs PM data during a trade, the mobile counterparty cannot decrypt it. Error on mobile: "could not decrypt payment data, ask for details in the chat if needed".

**Date:** 2026-03-20

---

## Libraries

| Side | Library | Version |
|------|---------|---------|
| Web | openpgp.js | 6.3.0 |
| Mobile | react-native-fast-openpgp (GopenPGP) | 2.9.3 (GopenPGP v0.38.2) |

---

## Trade PM encryption flow

### How PM data gets encrypted during a trade

**Web as seller accepting v069 trade request:**
1. Mobile (buyer) sends trade request with `symmetricKeyEncrypted` (symmetric key encrypted to seller's PGP public key)
2. Web (seller) decrypts symmetric key: `decryptPGPMessage(symmetricKeyEncrypted, privKey)`
3. Web encrypts seller's PM data: `encryptSymmetric(pmJson, symmetricKey)` → `paymentDataEncrypted`
4. Web signs PM data: `signPGPMessage(pmJson, privKey)` → `paymentDataSignature`
5. Web sends `{ paymentDataEncrypted, paymentDataSignature }` to accept endpoint

**Web initiating a match (v1 path):**
1. Web generates symmetric key: `generateSymmetricKey()` (32 random bytes → hex string)
2. Web encrypts symmetric key for both parties: `encryptForRecipients(symmetricKey, counterpartyKeys, privKey)` → `symmetricKeyEncrypted` + `symmetricKeySignature`
3. Web encrypts buyer's PM data: `encryptSymmetric(pmJson, symmetricKey)` → `paymentDataEncrypted`
4. Web signs PM data: `signPGPMessage(pmJson, privKey)` → `paymentDataSignature`
5. Web sends all four fields to match endpoint

### How mobile decrypts (from `useDecryptedContractData.tsx`)

1. **Decrypt symmetric key:** `OpenPGP.decrypt(symmetricKeyEncrypted, privateKey, "")` — asymmetric
2. **Verify symmetric key signature:** `OpenPGP.verify(symmetricKeySignature, symmetricKey, publicKey)` — if fails → returns null → everything fails
3. **Decrypt PM data:** `OpenPGP.decryptSymmetric(paymentDataEncrypted, symmetricKey, { cipher: 2 })` — AES-256
4. **Verify PM data signature:** `OpenPGP.verify(paymentDataSignature, decryptedPM, publicKey)` — if fails → throws

If step 2 fails, symmetric key is discarded as null, step 3 fails with null passphrase, and mobile shows the error.

---

## Issues found and fixed

### 1. Signature format — FIXED (revised twice)
- **Problem (round 1):** `openpgp.sign({ message: createMessage(...) })` produces `-----BEGIN PGP MESSAGE-----` (inline signed). GopenPGP's `verify()` can't parse this at all.
- **Fix (round 1):** Changed to `createCleartextMessage()` → produces `-----BEGIN PGP SIGNED MESSAGE-----`. This caused a crash on mobile (SHA-512 issue, see #3).
- **Problem (round 2):** GopenPGP's `OpenPGP.verify()` maps to `Verify()` → `verifyBytes()` which is the **detached signature** path. It calls `readSignature()` + hashes the `message` parameter. Cleartext signed messages use different hash canonicalization than detached, causing a hash mismatch. GopenPGP's `Sign()` uses `DetachSign()` producing `-----BEGIN PGP SIGNATURE-----` (detached). Its `VerifyData()` handles cleartext but is NOT called by `Verify()`.
- **Fix (round 2):** Changed ALL signing to use `detached: true` → produces `-----BEGIN PGP SIGNATURE-----`. Both `signPGPMessage()` and `encryptForRecipients()` now produce detached signatures matching GopenPGP's format.
- **File:** `src/utils/pgp.js`

### 2. Salt notation — FIXED
- **Problem:** openpgp.js v6 has `nonDeterministicSignaturesViaNotation: true` by default, adding a `salt@notations.openpgpjs.org` subpacket to every signature. GopenPGP v0.38.2 may not handle this.
- **Fix:** Added `nonDeterministicSignaturesViaNotation: false` to `GOPENPGP_COMPAT` config applied to all operations.
- **File:** `src/utils/pgp.js`

### 3. Hash algorithm — FIXED
- **Problem:** openpgp.js v6 defaults to SHA-512 (`preferredHashAlgorithm: 10`). GopenPGP defaults to SHA-256. Cleartext signatures with SHA-512 caused a crash on mobile.
- **Fix:** Added `preferredHashAlgorithm: openpgp.enums.hash.sha256` to `GOPENPGP_COMPAT` config. Note: this may be overridden by the key's own hash preference depending on which key is used.
- **File:** `src/utils/pgp.js`

### 4. Embedded signing — FIXED
- **Problem:** `encryptPGPMessage()` and `encryptForRecipients()` passed `signingKeys` to `openpgp.encrypt()`, embedding the signature inside the encrypted message. GopenPGP may have issues with signed+encrypted compound messages.
- **Fix:** Removed `signingKeys` from all encrypt calls. Signatures are created separately.
- **File:** `src/utils/pgp.js`

### 5. Web decryption fallback — FIXED (separate issue)
- **Problem:** Web's trade execution only tried `decryptSymmetric()` for PM data. Mobile sometimes encrypts PM data asymmetrically. Error: "No symmetrically encrypted session key packet found."
- **Fix:** Added asymmetric fallback (`decryptPGPMessage`) after symmetric attempt in `trade-execution/index.jsx`.
- **File:** `src/screens/trade-execution/index.jsx`

---

## Current status: ROOT CAUSE FOUND — detached signature fix applied (2026-03-20)

### Root cause
GopenPGP's `OpenPGP.verify(signature, message, publicKey)` maps to `Verify()` → `verifyBytes()`, which is the **detached signature** verification path. It calls `readSignature()` to parse the signature, then hashes the `message` parameter. GopenPGP's `OpenPGP.sign()` maps to `Sign()` → `DetachSign()`, producing `-----BEGIN PGP SIGNATURE-----` (detached format). The cleartext format (`-----BEGIN PGP SIGNED MESSAGE-----`) we were producing either fails to parse or uses different hash canonicalization → signature verification always fails → mobile discards the decrypted PM data.

### Fix applied
- All `signPGPMessage()` calls now produce **detached signatures** (`detached: true`)
- `encryptForRecipients()` signature also changed to detached
- `GOPENPGP_COMPAT` config expanded with: `aeadProtect: false`, `s2kIterationCountByte: 96`, `preferredSymmetricAlgorithm: aes256`
- Symmetric key `.trim()` added as safety measure in both trade acceptance and trade execution

### Needs testing
Create a **new** trade between web and mobile. Check:
1. Browser console for `[Trades] signature starts: -----BEGIN PGP SIGNATURE-----` (confirms detached format)
2. Browser console for `[Trades] Round-trip decrypt OK: true`
3. Mobile: PM details should now be visible (no "could not decrypt" error)
4. Mobile ADB logs: `adb logcat *:S ReactNativeJS:V | grep -v "Firebase\|rnfirebase\|deprecated"`

### Debug logging currently in place
- `trades-dashboard/index.jsx` line ~1282: symmetric key info (length, first 8 chars, raw vs trimmed)
- `trades-dashboard/index.jsx` line ~1293: encrypted message format, signature format
- `trades-dashboard/index.jsx` line ~1296: round-trip decrypt test
- `trades-dashboard/index.jsx` line ~1346: counterpartyKeys count (v1 match path only)

### Mobile debugging setup
- GrapheneOS phone connected via USB
- udev rules installed at `/etc/udev/rules.d/51-android.rules`
- Filter command: `adb logcat *:S ReactNativeJS:V | grep -v "Firebase\|rnfirebase\|deprecated"`

---

## Key files

| File | Role |
|------|------|
| `src/utils/pgp.js` | All PGP encrypt/decrypt/sign functions. `GOPENPGP_COMPAT` config defined here. |
| `src/screens/trades-dashboard/index.jsx` | Trade acceptance flow (v069 + v1 paths). Encrypts PM data + symmetric key. |
| `src/screens/trade-execution/index.jsx` | Trade view. Decrypts PM data from contract. |
| `src/screens/trades-dashboard/MatchesPopup.jsx` | Match detail + chat. Uses symmetric encryption for chat messages. |

## Mobile source reference

| File | Role |
|------|------|
| `peach-app/src/utils/pgp/signAndEncrypt.ts` | Mobile's asymmetric encrypt (no embedded signing) |
| `peach-app/src/utils/pgp/signAndEncryptSymmetric.ts` | Mobile's symmetric encrypt: `OpenPGP.encryptSymmetric(msg, pass, undefined, { cipher: 2 })` |
| `peach-app/src/utils/pgp/decryptSymmetric.ts` | Mobile's symmetric decrypt: `OpenPGP.decryptSymmetric(enc, pass, { cipher: 2 })` |
| `peach-app/src/utils/pgp/decrypt.ts` | Mobile's asymmetric decrypt: `OpenPGP.decrypt(enc, privKey, "")` |
| `peach-app/src/views/contractChat/useDecryptedContractData.tsx` | Mobile's full PM decryption flow with fallbacks |
| `peach-app/src/views/contract/helpers/decryptSymmetricKey.ts` | Mobile's symmetric key decryption + signature verification |
| `peach-app/src/views/contract/helpers/hasValidSignature.ts` | Mobile's signature verification via `OpenPGP.verify()` |
