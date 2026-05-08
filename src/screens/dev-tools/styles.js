// ─── DEV TOOLS — CSS ─────────────────────────────────────────────────────────
// In-app developer tools (regtest only, gated behind VITE_DEV_TOOLS).
// ─────────────────────────────────────────────────────────────────────────────

export const CSS = `
  .dev-scroll{margin-top:var(--topbar);padding:32px 28px 80px;max-width:720px;margin-left:auto;margin-right:auto}
  .dev-title{font-size:1.5rem;font-weight:800;color:var(--black);letter-spacing:-0.02em;margin:0 0 8px}
  .dev-sub{font-size:.85rem;color:var(--black-65);margin:0 0 20px}

  .dev-warn{background:var(--error-bg);color:var(--error);border:1.5px solid var(--error);
    border-radius:12px;padding:12px 14px;font-size:.82rem;font-weight:600;line-height:1.5;margin-bottom:24px}

  .dev-card{background:var(--surface);border:1px solid var(--black-10);border-radius:16px;
    padding:20px;margin-bottom:16px}

  .dev-row{margin-bottom:14px}
  .dev-label{font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;
    color:var(--black);margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;gap:8px}
  .dev-label-help{font-size:.7rem;font-weight:600;color:var(--black-65);text-transform:none;letter-spacing:0}

  .dev-input,.dev-textarea{width:100%;padding:10px 14px;border-radius:10px;
    border:1.5px solid var(--black-25);background:var(--surface);
    font-family:monospace;font-size:.82rem;color:var(--black);outline:none;box-sizing:border-box}
  .dev-input:focus,.dev-textarea:focus{border-color:var(--primary)}
  .dev-textarea{resize:vertical;min-height:64px;line-height:1.5}
  .dev-input.bad,.dev-textarea.bad{border-color:var(--error)}

  .dev-mini-btn{padding:6px 12px;border-radius:999px;border:1.5px solid var(--primary);
    background:transparent;color:var(--primary);font-family:'Baloo 2',cursive;
    font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;
    cursor:pointer}
  .dev-mini-btn:hover{background:var(--primary);color:var(--surface)}
  .dev-mini-btn:disabled{opacity:.45;cursor:not-allowed}

  .dev-result{margin-top:8px}
  .dev-status-row{display:flex;justify-content:space-between;align-items:center;
    padding:10px 14px;border-radius:10px;font-size:.8rem;font-weight:700;margin-bottom:8px}
  .dev-status-ok{background:var(--success-bg);color:var(--success);border:1.5px solid var(--success)}
  .dev-status-bad{background:var(--error-bg);color:var(--error);border:1.5px solid var(--error)}

  .dev-error{background:var(--error-bg);color:var(--error);border:1.5px solid var(--error);
    border-radius:10px;padding:10px 14px;font-size:.8rem;font-weight:600;margin-bottom:12px;line-height:1.5;
    word-break:break-word}

  .dev-sig-box{position:relative}
  .dev-sig-textarea{width:100%;padding:12px 40px 12px 14px;border-radius:10px;
    border:1.5px solid var(--black-10);background:var(--black-5);
    font-family:monospace;font-size:.78rem;color:var(--black);outline:none;
    resize:vertical;min-height:96px;line-height:1.5;box-sizing:border-box;word-break:break-all}
  .dev-sig-copy{position:absolute;top:8px;right:8px}

  .dev-back{display:inline-flex;align-items:center;gap:6px;background:none;border:none;
    color:var(--primary);font-family:var(--font);font-size:.82rem;font-weight:700;
    cursor:pointer;padding:0;margin-bottom:12px}
  .dev-back:hover{text-decoration:underline}

  @media(max-width:768px){
    .dev-scroll{padding:24px 16px 80px}
  }
  @media(max-width:767px){
    .page-wrap{margin-left:0!important}
  }
`;
