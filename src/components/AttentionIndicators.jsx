import React from "react";

function pluralizeText(count) {
  return `${count} trade${count > 1 ? "s" : ""} need${count === 1 ? "s" : ""} your attention`;
}

function stop(e) {
  e.stopPropagation();
}

export function AttentionStrip({ count, onView, onDismiss }) {
  return (
    <div
      className="attention-strip"
      role="button"
      tabIndex={0}
      onClick={onView}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onView(); }}
    >
      <span className="attention-strip-icon" aria-hidden="true">⚠️</span>
      <span className="attention-strip-text">{pluralizeText(count)}</span>
      <span className="attention-strip-view">View →</span>
      <button
        type="button"
        className="attention-strip-close"
        aria-label="Dismiss attention banner"
        onClick={(e) => { stop(e); onDismiss(); }}
      >
        ×
      </button>
    </div>
  );
}

export function AttentionPill({ count, onView, onDismiss }) {
  return (
    <div
      className="attention-pill"
      role="button"
      tabIndex={0}
      onClick={onView}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onView(); }}
    >
      <span className="attention-pill-icon" aria-hidden="true">⚠️</span>
      <span className="attention-pill-text">{pluralizeText(count)}</span>
      <span className="attention-pill-view">View →</span>
      <button
        type="button"
        className="attention-pill-close"
        aria-label="Dismiss attention pill"
        onClick={(e) => { stop(e); onDismiss(); }}
      >
        ×
      </button>
    </div>
  );
}
