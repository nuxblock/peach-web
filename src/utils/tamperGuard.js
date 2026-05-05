/**
 * tamperGuard — global signature-tamper detection.
 *
 * When the client decrypts data from /v069/selfUser and finds the detached
 * PGP signature does not verify against the user's own public key, that's a
 * red flag: the server may have substituted ciphertext. We surface this to
 * the user via a global event that App.jsx listens to and renders a modal
 * directing them to contact Peach support.
 *
 * Per-field deduping: a given field only fires once per page load so we
 * don't spam the user if the same bad blob comes back from multiple reads.
 */
const _firedFields = new Set();

export function dispatchTamperDetected(fieldLabel) {
  if (_firedFields.has(fieldLabel)) return;
  _firedFields.add(fieldLabel);
  window.dispatchEvent(
    new CustomEvent("peach:tamper-detected", { detail: { field: fieldLabel } }),
  );
}

export function resetTamperFlag() {
  _firedFields.clear();
}
