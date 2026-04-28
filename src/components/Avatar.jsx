// ─── SHARED AVATAR COMPONENT ─────────────────────────────────────────────────
// Single source of truth for all avatars in the app. The only data input is
// peachId (the raw pubkey hex). Initials are the last 2 of the first 8 hex
// chars uppercased — i.e. the last 2 chars of the displayed PeachID label
// ("Peach03C292C3" → "C3"). Background is uniform: --grad (orange gradient in
// light mode, solid orange in dark, both via the --grad token). When peachId
// is missing/null, renders a grey circle with a user-silhouette icon.
// ─────────────────────────────────────────────────────────────────────────────

function getInitials(peachId) {
  const id = String(peachId ?? "");
  if (!id || id === "unknown") return null;
  return id.slice(0, 8).slice(-2).toUpperCase();
}

const UserSilhouette = ({ size }) => (
  <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 16 16"
       fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="8" cy="5.5" r="3"/>
    <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/>
  </svg>
);

export default function Avatar({ peachId, size = 36, online, badge }) {
  const initials = getInitials(peachId);
  const isEmpty = !initials;
  return (
    <div style={{ position:"relative", flexShrink:0, width:size, height:size }}>
      <div style={{
        width:size, height:size, borderRadius:"50%",
        background: isEmpty ? "var(--black-10)" : "var(--grad)",
        color: isEmpty ? "var(--black-25)" : "white",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize: size * 0.36, fontWeight:700, flexShrink:0,
        position:"relative",
      }}>
        {isEmpty ? <UserSilhouette size={size}/> : initials}
        {!isEmpty && badge > 0 && (
          <div style={{
            position:"absolute", top:-3, right:-3,
            background:"var(--error)", color:"white",
            fontSize:".55rem", fontWeight:800,
            minWidth:14, height:14, padding:"0 3px", borderRadius:"50%",
            display:"flex", alignItems:"center", justifyContent:"center",
            border:"2px solid var(--surface)",
          }}>{badge > 99 ? "99+" : badge}</div>
        )}
      </div>
      {online && !isEmpty && (
        <div style={{
          position:"absolute", bottom:0, right:0,
          width:9, height:9, borderRadius:"50%",
          background:"var(--success)", border:"2px solid white",
        }}/>
      )}
    </div>
  );
}
