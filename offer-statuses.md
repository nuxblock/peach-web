# Offer Statuses

## TradeStatus

### Open Action (user needs to act)

| Status | Description |
|--------|-------------|
| `hasMatchesAvailable` | Matches found, user can select |
| `offerHiddenWithMatchesAvailable` | Offer is hidden but has matches |
| `fundEscrow` | User needs to fund the escrow |
| `createEscrow` | User needs to create an escrow |
| `fundingAmountDifferent` | Funded amount doesn't match expected |
| `paymentRequired` | Buyer needs to send payment |
| `confirmPaymentRequired` | User needs to confirm payment was made |
| `paymentTooLate` | Payment was sent after the time limit |
| `acceptTradeRequest` | User needs to accept an incoming trade request (express flow) |
| `rateUser` | Trade done, user can rate their peer |

### Priority (urgent action needed)

| Status | Description |
|--------|-------------|
| `releaseEscrow` | Seller needs to release bitcoin from escrow |
| `confirmCancelation` | User needs to confirm a cancellation |
| `refundOrReviveRequired` | User must choose to refund or revive the trade |
| `refundTxSignatureRequired` | User needs to sign the refund transaction |
| `refundAddressRequired` | User needs to provide a refund address |
| `disputeWithoutEscrowFunded` | Dispute opened but escrow not yet funded |
| `wrongAmountFundedOnContractRefundWaiting` | Wrong amount funded, awaiting refund |

### Waiting (no action needed)

| Status | Description |
|--------|-------------|
| `searchingForPeer` | Looking for a match |
| `offerHidden` | Offer is paused/hidden from matching |
| `waitingForFunding` | Waiting for funding tx to be detected |
| `escrowWaitingForConfirmation` | Escrow tx awaiting blockchain confirmation |
| `payoutPending` | Payout tx is being processed |
| `waitingForTradeRequest` | Waiting for peer to send a trade request (express flow) |

### Error

| Status | Description |
|--------|-------------|
| `dispute` | Trade is in dispute |
| `refundAddressRequired` | Refund address missing (also priority) |
| `fundingExpired` | Funding window has expired |

### Past Offer (completed/closed)

| Status | Description |
|--------|-------------|
| `tradeCompleted` | Trade finished successfully |
| `tradeCanceled` | Trade was canceled |
| `offerCanceled` | Offer was canceled before matching |
| `wrongAmountFundedOnContract` | Wrong amount was funded, offer closed |
| `wrongAmountFundedOnContractRefundWaiting` | Wrong amount funded, refund in progress |

---

## FundingStatus

| Status | Description |
|--------|-------------|
| `NULL` | No funding detected yet |
| `MEMPOOL` | Funding tx seen in mempool, unconfirmed |
| `FUNDED` | Escrow successfully funded |
| `WRONG_FUNDING_AMOUNT` | Received amount doesn't match expected |
| `CANCELED` | Funding was canceled |
