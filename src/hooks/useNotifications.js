import { useState, useEffect } from "react";
import { STATUS_CONFIG } from "../data/statusConfig.js";
import { formatTradeId } from "../utils/format.js";
import { fetchWithSessionCheck } from "../utils/sessionGuard.js";

// ── Seller-specific overrides (keyed by status) ─────────────────────────────
const SELLER_OVERRIDE = {
  paymentRequired:        { title: "Waiting for buyer",        body: "Wait for buyer to mark the payment as done." },
  confirmPaymentRequired: { title: "Payment marked as sent",   body: "Check your account and confirm receipt." },
  releaseEscrow:          { title: "Confirm payment receipt",  body: "Check your account and release escrow." },
};

// ── Status → notification mapping ────────────────────────────────────────────
const STATUS_NOTIF = {
  hasMatchesAvailable:          { title: "New matches available",   body: "Review and select a match.",             type: "match" },
  offerHiddenWithMatchesAvailable: { title: "New matches available", body: "Review and select a match.",            type: "match" },
  acceptTradeRequest:           { title: "Trade request received",  body: "Review and accept or decline.",          type: "tradeRequest" },
  fundEscrow:                   { title: "Trade accepted",          body: "Waiting for seller to fund escrow.",     type: "statusChange" },
  waitingForFunding:            { title: "Trade accepted",          body: "Waiting for seller to fund escrow.",     type: "statusChange" },
  escrowWaitingForConfirmation: { title: "Escrow funded",           body: "Waiting for blockchain confirmation.",   type: "statusChange" },
  paymentRequired:              { title: "Payment required",        body: "Send payment to the seller.",            type: "statusChange" },
  confirmPaymentRequired:       { title: "Payment sent",            body: "Buyer marked payment as sent.",          type: "statusChange" },
  releaseEscrow:                { title: "Payment confirmed",       body: "Seller is releasing escrow.",            type: "statusChange" },
  tradeCompleted:               { title: "Trade completed",         body: "Bitcoin released successfully.",          type: "statusChange" },
  tradeCanceled:                { title: "Trade cancelled",         body: "",                                       type: "statusChange" },
  offerCanceled:                { title: "Offer cancelled",         body: "",                                       type: "statusChange" },
  dispute:                      { title: "Dispute opened",          body: "A mediator will review the trade.",      type: "dispute" },
  disputeWithoutEscrowFunded:   { title: "Dispute opened",          body: "A mediator will review the trade.",      type: "dispute" },
  fundingExpired:               { title: "Funding expired",         body: "Escrow was not funded in time.",          type: "expiry" },
  paymentTooLate:               { title: "Payment overdue",         body: "Payment deadline has passed.",            type: "statusChange" },
  confirmCancelation:           { title: "Cancellation requested",  body: "Review the cancellation request.",        type: "statusChange" },
  rateUser:                     { title: "Rate your trade partner",  body: "",                                      type: "statusChange" },
  createEscrow:                 { title: "Create escrow",            body: "Generate escrow address for your sell offer.", type: "statusChange" },
  fundingAmountDifferent:       { title: "Wrong funding amount",     body: "Escrow funded with unexpected amount.",   type: "warning" },
  payoutPending:                { title: "Payout pending",           body: "Bitcoin is being sent to your wallet.",   type: "statusChange" },
  refundAddressRequired:        { title: "Refund address needed",    body: "Provide a refund address to continue.",   type: "warning" },
  refundOrReviveRequired:       { title: "Action needed",            body: "Decide whether to refund or republish.",  type: "warning" },
  wrongAmountFundedOnContract:  { title: "Wrong amount funded",      body: "Contract funded with incorrect amount.",  type: "warning" },
  wrongAmountFundedOnContractRefundWaiting: { title: "Refund pending", body: "Waiting for refund of incorrect amount.", type: "warning" },
};

// ── localStorage helpers ─────────────────────────────────────────────────────
const LS_NOTIFS    = "peach_notifications";
const LS_READ_IDS  = "peach_notif_read_ids";
const MAX_NOTIFS   = 50;

function loadNotifs() {
  try { return JSON.parse(localStorage.getItem(LS_NOTIFS)) || []; } catch { return []; }
}
function saveNotifs(list) {
  localStorage.setItem(LS_NOTIFS, JSON.stringify(list.slice(0, MAX_NOTIFS)));
}
function loadReadIds(notifs) {
  // Try new format first
  try {
    const arr = JSON.parse(localStorage.getItem(LS_READ_IDS));
    if (Array.isArray(arr)) return new Set(arr);
  } catch { /* fall through */ }
  // Migrate from old timestamp-based format
  const oldTs = parseInt(localStorage.getItem("peach_notif_last_read"), 10) || 0;
  if (oldTs > 0 && notifs.length > 0) {
    const ids = new Set(notifs.filter(n => n.createdAt <= oldTs).map(n => n.id));
    localStorage.removeItem("peach_notif_last_read");
    saveReadIds(ids, notifs);
    return ids;
  }
  localStorage.removeItem("peach_notif_last_read");
  return new Set();
}
function saveReadIds(readIds, notifs) {
  // Prune: only keep IDs that exist in current notifications
  const validIds = new Set(notifs.map(n => n.id));
  const pruned = [...readIds].filter(id => validIds.has(id));
  localStorage.setItem(LS_READ_IDS, JSON.stringify(pruned));
}

// ── Singleton polling state ──────────────────────────────────────────────────
let _interval      = null;
let _listeners     = new Set();
const _initNotifs  = loadNotifs();
let _state         = { notifications: _initNotifs, unreadCount: 0, readIds: loadReadIds(_initNotifs) };
let _prevContracts = new Map();   // id → { tradeStatus, unreadMessages }
let _prevOffers    = new Map();   // id → tradeStatus
let _isFirstPoll   = true;

// Compute unread on load
_state.unreadCount = _state.notifications.filter(n => !_state.readIds.has(n.id)).length;

function _notify() {
  _listeners.forEach(fn => fn({ ..._state }));
}

function _addEvents(newEvents) {
  if (newEvents.length === 0) return;
  _state.notifications = [...newEvents, ..._state.notifications].slice(0, MAX_NOTIFS);
  _state.unreadCount = _state.notifications.filter(n => !_state.readIds.has(n.id)).length;
  saveNotifs(_state.notifications);
  saveReadIds(_state.readIds, _state.notifications);
  _updateTitle();
  _notify();
}

function _updateTitle() {
  // Defer to useUnread if it has a message count showing
  const unreadMsgTotal = window.__PEACH_UNREAD__?.total ?? 0;
  if (unreadMsgTotal > 0) return; // useUnread already sets "(N) Peach"
  if (_state.unreadCount > 0) {
    document.title = "(\u25CF) Peach";
  } else {
    document.title = "Peach";
  }
}

function _makeNotif(id, type, title, body, contractId, offerId) {
  return { id, type, title, body, contractId: contractId || null, offerId: offerId || null, createdAt: Date.now() };
}

async function _poll(auth, base) {
  if (!window.__PEACH_AUTH__) {
    _stopPolling();
    _state = { notifications: _state.notifications, unreadCount: _state.unreadCount, readIds: _state.readIds };
    _notify();
    return;
  }

  const hdrs = { Authorization: `Bearer ${auth.token}` };
  const v069Base = base.replace(/\/v1$/, "/v069");

  try {
    const peachId = window.__PEACH_AUTH__?.peachId;
    const [contractsRes, buyRes, ownOffersRes] = await Promise.all([
      fetchWithSessionCheck(`${base}/contracts/summary`, { headers: hdrs }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetchWithSessionCheck(`${v069Base}/buyOffer?ownOffers=true`, { headers: hdrs }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetchWithSessionCheck(`${v069Base}/user/${peachId}/offers`, { headers: hdrs }).then(r => r.ok ? r.json() : null).catch(() => null),
    ]);

    // ── Parse responses ──
    const contracts = contractsRes
      ? (Array.isArray(contractsRes) ? contractsRes : (contractsRes.contracts ?? []))
      : [];
    // Share contracts with useUnread to avoid duplicate API calls
    window.__PEACH_CONTRACTS__ = { data: contracts, ts: Date.now() };
    const buyOffers  = buyRes  ? (Array.isArray(buyRes)  ? buyRes  : (buyRes.offers ?? []))  : [];
    // Own sell offers from /v069/user/{id}/offers (sellOffer endpoint doesn't support ownOffers param)
    const sellOffers = ownOffersRes?.sellOffers ?? [];
    const allOffers  = [
      ...buyOffers.map(o => ({ ...o, _dir: "buy" })),
      ...sellOffers.map(o => ({ ...o, _dir: "sell" })),
    ];

    // ── First poll = baseline only ──
    if (_isFirstPoll) {
      _isFirstPoll = false;
      for (const c of contracts) {
        _prevContracts.set(c.id, { tradeStatus: c.tradeStatus, unreadMessages: c.unreadMessages ?? 0 });
      }
      for (const o of allOffers) {
        _prevOffers.set(o.id, o.tradeStatus ?? o.tradeStatusNew ?? "");
      }
      _notify();
      return;
    }

    // ── Diff contracts ──
    const events = [];
    const now = Date.now();

    for (const c of contracts) {
      const prev = _prevContracts.get(c.id);
      const status = c.tradeStatus;
      const unread = c.unreadMessages ?? 0;
      const fmtId = formatTradeId(c.id);
      const isSeller = c.seller?.id === auth.peachId || (c.buyer?.id && c.buyer.id !== auth.peachId);
      const sellerOv = isSeller ? SELLER_OVERRIDE[status] : null;

      if (prev) {
        // Status changed
        if (prev.tradeStatus !== status && STATUS_NOTIF[status]) {
          const sn = STATUS_NOTIF[status];
          events.push(_makeNotif(
            `c-${c.id}-${status}-${now}`, sn.type,
            `${sellerOv?.title ?? sn.title}: contract ${fmtId}`, sellerOv?.body ?? sn.body, c.id, null
          ));
        }
        // New unread messages
        if (unread > prev.unreadMessages) {
          const diff = unread - prev.unreadMessages;
          events.push(_makeNotif(
            `c-${c.id}-msg-${now}`, "message",
            diff === 1 ? `New message: contract ${fmtId}` : `${diff} new messages: contract ${fmtId}`,
            "", c.id, null
          ));
        }
      } else {
        // Brand new contract since last poll — notify if it has an interesting status
        if (STATUS_NOTIF[status]) {
          const sn = STATUS_NOTIF[status];
          events.push(_makeNotif(
            `c-${c.id}-${status}-${now}`, sn.type,
            `${sellerOv?.title ?? sn.title}: contract ${fmtId}`, sellerOv?.body ?? sn.body, c.id, null
          ));
        }
      }

      _prevContracts.set(c.id, { tradeStatus: status, unreadMessages: unread });
    }

    // ── Diff offers ──
    for (const o of allOffers) {
      const status = o.tradeStatus ?? o.tradeStatusNew ?? "";
      const prev = _prevOffers.get(o.id);
      const fmtId = formatTradeId(o.id, "offer");

      if (prev && prev !== status && STATUS_NOTIF[status]) {
        const sn = STATUS_NOTIF[status];
        const body = (o._dir === "sell" && (status === "fundEscrow" || status === "waitingForFunding"))
          ? "Waiting for you to fund escrow."
          : sn.body;
        events.push(_makeNotif(
          `o-${o.id}-${status}-${now}`, sn.type,
          `${sn.title}: offer ${fmtId}`, body, null, o.id
        ));
      } else if (!prev && STATUS_NOTIF[status]) {
        // New offer appeared — skip, it's the user's own action
      }

      _prevOffers.set(o.id, status);
    }

    _addEvents(events);
  } catch {
    // Silently keep last known state on error
  }
}

function _startPolling() {
  if (_interval) return;
  const auth = window.__PEACH_AUTH__;
  if (!auth) return;
  const base = auth.baseUrl ?? import.meta.env.VITE_API_BASE;
  _poll(auth, base);
  _interval = setInterval(() => _poll(auth, base), 8_000);
}

function _stopPolling() {
  if (_interval) {
    clearInterval(_interval);
    _interval = null;
  }
}

// ── Public actions ───────────────────────────────────────────────────────────
function _markAllRead() {
  for (const n of _state.notifications) _state.readIds.add(n.id);
  _state.unreadCount = 0;
  saveReadIds(_state.readIds, _state.notifications);
  _updateTitle();
  _notify();
}

function _markRead(notifId) {
  if (_state.readIds.has(notifId)) return;
  _state.readIds.add(notifId);
  _state.unreadCount = _state.notifications.filter(n => !_state.readIds.has(n.id)).length;
  saveReadIds(_state.readIds, _state.notifications);
  _updateTitle();
  _notify();
}

// ── React hook ───────────────────────────────────────────────────────────────
export function useNotifications() {
  const [state, setState] = useState(_state);

  useEffect(() => {
    _listeners.add(setState);
    if (_listeners.size === 1) _startPolling();
    return () => {
      _listeners.delete(setState);
      if (_listeners.size === 0) _stopPolling();
    };
  }, []);

  return {
    notifications: state.notifications,
    unreadCount:   state.unreadCount,
    readIds:       state.readIds,
    markAllRead:   _markAllRead,
    markRead:      _markRead,
  };
}
