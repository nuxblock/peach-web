// Small spinning dot rendered next to a page title while a background refresh
// is in flight. Returns null when inactive so layout doesn't shift.
// Self-contained: ships its own keyframe + class so it can drop into any screen
// without modifying that screen's local CSS.

const style = `
@keyframes refresh-indicator-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.refresh-indicator-dot{
  display:inline-block;width:14px;height:14px;
  border:2px solid var(--black-10);border-top-color:var(--primary);
  border-radius:50%;animation:refresh-indicator-spin .8s linear infinite;
  vertical-align:middle;margin-left:10px;
}
`;

export function RefreshIndicator({ active = false }) {
  if (!active) return null;
  return (
    <>
      <style>{style}</style>
      <span className="refresh-indicator-dot" role="status" aria-label="Refreshing" />
    </>
  );
}
