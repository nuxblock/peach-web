/**
 * Debug helper — paste into browser console (on the web app, while logged in).
 *
 * Creates a minimal sell offer with instantTradeCriteria, then fetches it back
 * from the v069 endpoint to check allowedToInstantTrade.
 *
 * Usage:
 *   debugInstant()                          // defaults
 *   debugInstant({ premium: 5 })            // override premium
 *   debugInstant({ amount: 100000 })        // override amount
 */
async function debugInstant(overrides = {}) {
  const auth = window.__PEACH_AUTH__;
  if (!auth) { console.error("Not logged in"); return; }

  const base = auth.baseUrl;
  const hdrs = { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' };

  // ── 1. Build payload ──
  const payload = {
    type: "ask",
    amount: 50000,
    premium: 0,
    meansOfPayment: { EUR: ["revolut"] },
    paymentData: { revolut: { hashes: ["debug-test"] } },
    returnAddress: "bcrt1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080",
    instantTradeCriteria: { minReputation: -1, minTrades: 0, badges: [] },
    ...overrides,
  };

  console.log("━━━ DEBUG INSTANT TRADE ━━━");
  console.log("POST /v1/offer payload:", JSON.stringify(payload, null, 2));

  // ── 2. Create the offer ──
  const createRes = await fetch(`${base}/offer`, {
    method: 'POST', headers: hdrs, body: JSON.stringify(payload),
  });
  const createData = await createRes.json().catch(() => null);
  console.log("Create response status:", createRes.status);
  console.log("Create response body:", JSON.stringify(createData, null, 2));

  if (!createRes.ok) {
    console.error("Offer creation failed:", createData?.error || createData?.message);
    return;
  }

  const offerId = createData.offerId || createData.id;
  console.log("Created offer ID:", offerId);

  // ── 3. Fetch back from v069 to check allowedToInstantTrade ──
  const v069 = base.replace(/\/v1$/, '/v069');
  const peachId = auth.publicKey.substring(0, 16);

  // Fetch user's own offers
  const offersRes = await fetch(`${v069}/user/${auth.publicKey}/offers`, { headers: hdrs });
  const offersData = await offersRes.json().catch(() => null);

  if (offersData?.sellOffers) {
    const thisOffer = offersData.sellOffers.find(o => String(o.id) === String(offerId));
    if (thisOffer) {
      console.log(`Own-view: allowedToInstantTrade = ${thisOffer.allowedToInstantTrade}`);
      console.log(`Own-view: instantTradeCriteria =`, thisOffer.instantTradeCriteria);
    } else {
      console.log("Offer not found in own offers list");
    }
  }

  // Also try the general sellOffer endpoint
  const marketRes = await fetch(`${v069}/sellOffer`, { headers: hdrs });
  const marketData = await marketRes.json().catch(() => null);

  if (marketData?.sellOffers) {
    const thisOffer = marketData.sellOffers.find(o => String(o.id) === String(offerId));
    if (thisOffer) {
      console.log(`Market-view: allowedToInstantTrade = ${thisOffer.allowedToInstantTrade}`);
    } else {
      console.log("Offer not in market list (expected — own offers are excluded)");
    }
  }

  console.log("━━━ DONE ━━━");
  console.log("Now check from the OTHER account: does offer", offerId, "show allowedToInstantTrade: true?");
  return offerId;
}

// Quick comparison: create one with and one without instantTradeCriteria
async function debugCompare() {
  console.log("=== Test A: WITH instantTradeCriteria ===");
  const idA = await debugInstant();
  console.log("\n=== Test B: WITHOUT instantTradeCriteria ===");
  const idB = await debugInstant({ instantTradeCriteria: undefined });
  console.log(`\nCompare offers ${idA} and ${idB} from the other account.`);
}
