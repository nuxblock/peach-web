import { relTime } from "../utils/format.js";

// ── Icons per notification type (stroke-based, 16×16) ────────────────────────
const IcoMessage = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 3h11a1 1 0 011 1v7a1 1 0 01-1 1H5l-3 2.5V4a1 1 0 011-1z"/>
  </svg>
);
const IcoStatus = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,9 6.5,12.5 13,4"/>
  </svg>
);
const IcoMatch = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 7h6M9 4l3 3-3 3"/><path d="M11 9H5M7 12l-3-3 3-3"/>
  </svg>
);
const IcoDispute = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2l6.5 11H1.5z"/><line x1="8" y1="6.5" x2="8" y2="9"/><circle cx="8" cy="11" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);
const IcoExpiry = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6"/><polyline points="8,4.5 8,8 10.5,9.5"/>
  </svg>
);

const TYPE_ICON = {
  message:     IcoMessage,
  statusChange: IcoStatus,
  match:       IcoMatch,
  tradeRequest: IcoMatch,
  dispute:     IcoDispute,
  expiry:      IcoExpiry,
};

const TYPE_COLOR = {
  message:      "var(--primary, #F56522)",
  statusChange: "var(--black-50, #7D675E)",
  match:        "#05A85A",
  tradeRequest: "#05A85A",
  dispute:      "var(--error, #DF321F)",
  expiry:       "var(--black-25, #B8A99E)",
};

export default function NotificationPanel({ notifications, lastRead, onMarkAllRead, onNavigate }) {
  const hasUnread = notifications.some(n => n.createdAt > lastRead);

  return (
    <div className="notif-panel" onClick={e => e.stopPropagation()}>
      <div className="notif-panel-header">
        <span className="notif-panel-title">Notifications</span>
        {hasUnread && (
          <button className="notif-mark-read" onClick={onMarkAllRead}>Mark all read</button>
        )}
      </div>
      <div className="notif-panel-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">
            <svg width="32" height="32" viewBox="0 0 20 20" fill="none" stroke="var(--black-25,#B8A99E)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:8}}>
              <path d="M15 7a5 5 0 00-10 0c0 5-2 7-2 7h14s-2-2-2-7"/><path d="M8.5 17a1.5 1.5 0 003 0"/>
            </svg>
            No notifications yet
          </div>
        ) : (
          notifications.map(n => {
            const Icon = TYPE_ICON[n.type] || IcoStatus;
            const color = TYPE_COLOR[n.type] || "var(--black-50)";
            const isUnread = n.createdAt > lastRead;
            return (
              <div
                key={n.id}
                className={`notif-item${isUnread ? " notif-unread" : ""}`}
                onClick={() => onNavigate(n)}
              >
                <div className="notif-item-icon" style={{ color, background: color + "14" }}>
                  <Icon/>
                </div>
                <div className="notif-item-body">
                  <div className="notif-item-title">{n.title}</div>
                  {n.body && <div className="notif-item-desc">{n.body}</div>}
                  <div className="notif-item-time">{relTime(n.createdAt)}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
