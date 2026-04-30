export default function Toast({ message, tone = "default", bottom = 28 }) {
  if (!message) return null;
  const toneClass =
    tone === "error" ? " toast-bar--error"
    : tone === "orange" ? " toast-bar--orange"
    : tone === "success" ? " toast-bar--success"
    : "";
  return (
    <div className={`toast-bar${toneClass}`} style={{ bottom }}>
      {message}
    </div>
  );
}
