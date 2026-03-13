// ─── TRADE STATUS CONFIGURATION ──────────────────────────────────────────────
// Single source of truth for all TradeStatus values from the Peach API.
// Used by: trade-execution, trades-dashboard
//
// Status chip colours — 3 categories:
//   Orange (#FEEDE5 / #C45104) = action required
//   Yellow (#FEFCE5 / #9A7000) = warning, attention requested
//   Grey   (#F4EEEB / #7D675E) = pending, no action required
// Plus: green for completed, red for disputes/cancellation
//
// All values from mobile app TradeStatus type — no invented statuses.
// ─────────────────────────────────────────────────────────────────────────────

export const STATUS_CONFIG = {
  // ── Pending (offer stage) ──
  searchingForPeer:    { label: "Looking for Match",     bg: "#F4EEEB", color: "#7D675E", action: false },
  waitingForTradeRequest:{ label: "Waiting for Match",   bg: "#F4EEEB", color: "#7D675E", action: false },
  offerHidden:         { label: "Offer Hidden",          bg: "#F4EEEB", color: "#7D675E", action: false },
  offerHiddenWithMatchesAvailable: { label: "Hidden (Matches)", bg: "#FEEDE5", color: "#C45104", action: true },
  hasMatchesAvailable: { label: "Select Match",           bg: "#FEEDE5", color: "#C45104", action: true  },
  acceptTradeRequest:  { label: "Accept Trade Request",  bg: "#FEEDE5", color: "#C45104", action: true  },

  // ── Active (contract stage) ──
  createEscrow:        { label: "Create Escrow",         bg: "#FEFCE5", color: "#9A7000", action: true  },
  fundEscrow:          { label: "Fund Escrow",           bg: "#FEFCE5", color: "#9A7000", action: true  },
  waitingForFunding:   { label: "Waiting for Funding",   bg: "#F4EEEB", color: "#7D675E", action: false },
  escrowWaitingForConfirmation: { label: "Transaction Pending", bg: "#F4EEEB", color: "#7D675E", action: false },
  fundingAmountDifferent:{ label: "Wrong Amount Funded",  bg: "#FEFCE5", color: "#9A7000", action: true  },
  paymentRequired:     { label: "Make Payment",           bg: "#FEEDE5", color: "#C45104", action: true  },
  confirmPaymentRequired:{ label: "Confirm Payment",     bg: "#FEEDE5", color: "#C45104", action: true  },
  releaseEscrow:       { label: "Release Escrow",        bg: "#FEEDE5", color: "#C45104", action: true  },
  paymentTooLate:      { label: "Not Paid in Time",      bg: "#FEFCE5", color: "#9A7000", action: true  },
  payoutPending:       { label: "Payout Pending",        bg: "#F4EEEB", color: "#7D675E", action: false },
  rateUser:            { label: "Rate Counterparty",     bg: "#FEEDE5", color: "#C45104", action: true  },
  dispute:             { label: "Dispute",               bg: "#FFE6E1", color: "#DF321F", action: true  },
  disputeWithoutEscrowFunded: { label: "Dispute",        bg: "#FFE6E1", color: "#DF321F", action: true  },
  confirmCancelation:  { label: "Cancel Requested",       bg: "#FFE6E1", color: "#DF321F", action: true  },

  // ── Finished ──
  tradeCompleted:      { label: "Completed",             bg: "#F2F9E7", color: "#65A519", action: false },
  offerCanceled:       { label: "Offer Cancelled",       bg: "#F4EEEB", color: "#7D675E", action: false },
  tradeCanceled:       { label: "Trade Cancelled",       bg: "#F4EEEB", color: "#7D675E", action: false },
  fundingExpired:      { label: "Funding Expired",       bg: "#F4EEEB", color: "#7D675E", action: false },
  wrongAmountFundedOnContract: { label: "Wrong Amount",  bg: "#FEFCE5", color: "#9A7000", action: false },
  wrongAmountFundedOnContractRefundWaiting: { label: "Refund Pending", bg: "#F4EEEB", color: "#7D675E", action: false },

  // ── Refund-related ──
  refundAddressRequired:     { label: "Refund Address Needed", bg: "#FEEDE5", color: "#C45104", action: true  },
  refundOrReviveRequired:    { label: "Refund or Revive",      bg: "#FEEDE5", color: "#C45104", action: true  },
  refundTxSignatureRequired: { label: "Sign Refund",           bg: "#FEEDE5", color: "#C45104", action: true  },
};

// Statuses that represent a finished state → Trade History tab
export const FINISHED_STATUSES = new Set([
  "tradeCompleted", "offerCanceled", "tradeCanceled", "fundingExpired",
  "wrongAmountFundedOnContract", "wrongAmountFundedOnContractRefundWaiting",
]);

// Statuses that represent a pending/open offer → Pending Offers tab
export const PENDING_STATUSES = new Set([
  "searchingForPeer", "waitingForTradeRequest",
  "hasMatchesAvailable", "acceptTradeRequest",
  "offerHidden", "offerHiddenWithMatchesAvailable",
]);

// Trade lifecycle steps in order (used by HorizontalStepper in trade execution)
export const LIFECYCLE = [
  { id: "fundEscrow",              label: "Matched",        desc: "Offers paired, awaiting escrow" },
  { id: "paymentRequired",         label: "Escrow Funded",  desc: "Bitcoin locked in escrow" },
  { id: "confirmPaymentRequired",  label: "Payment Sent",   desc: "Buyer marked fiat as sent — seller reviewing" },
  { id: "tradeCompleted",          label: "Completed",      desc: "Bitcoin released, trade closed" },
];
