// ─── CENTRALISED MOCK / DEMO DATA ────────────────────────────────────────────
// All mock constants that screens use as fallbacks when not authenticated.
// When window.__PEACH_AUTH__ is set (regtest/prod), screens should NEVER
// fall back to any of these — use auth-guarded patterns instead.
//
// Kept in one place so it's obvious what is test scaffolding vs. production
// code, and easy to delete when mocks are no longer needed.
// ─────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════════
// TRADE EXECUTION — demo scenarios & chat
// ═══════════════════════════════════════════════════════════════════════════════

// Demo scenarios — switch between them to preview different states
// Uses real API TradeStatus values
export const DEMO_SCENARIOS = [
  {
    id:"buyer_escrow_pending",
    label:"Buyer — Awaiting Escrow",
    role:"buyer",
    tradeStatus:"fundEscrow",
    lifecycleStep: 0,
    instantTrade: false,
    contract: {
      id:"CT-00152",
      direction:"buy",
      amount:85000,
      fiat:"74.32",
      currency:"EUR",
      premium:-1.2,
      method:"SEPA",
      creationDate: Date.now() - 12 * 60_000,
      paymentExpectedBy: null,
      escrow:"bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    },
    counterparty:{ initials:"ST", color:"#65A519", name:"Peer #2B90", rep:5.0, trades:541, badges:["supertrader"], online:true },
    paymentDetails:null,
  },
  {
    id:"seller_escrow_pending",
    label:"Seller — Fund Escrow",
    role:"seller",
    tradeStatus:"fundEscrow",
    lifecycleStep: 0,
    instantTrade: true,
    contract: {
      id:"CT-00152",
      direction:"sell",
      amount:85000,
      fiat:"74.32",
      currency:"EUR",
      premium:-1.2,
      method:"SEPA",
      creationDate: Date.now() - 12 * 60_000,
      paymentExpectedBy: null,
      escrow:"bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    },
    counterparty:{ initials:"ST", color:"#65A519", name:"Peer #2B90", rep:5.0, trades:541, badges:["supertrader"], online:true },
    paymentDetails:null,
  },
  {
    id:"buyer_awaiting",
    label:"Buyer — Send Payment",
    role:"buyer",
    tradeStatus:"paymentRequired",
    lifecycleStep: 1,
    instantTrade: false,
    contract: {
      id:"CT-00148",
      direction:"buy",
      amount:85000,
      fiat:"74.32",
      currency:"EUR",
      premium:-1.2,
      method:"SEPA",
      creationDate: Date.now() - 4 * 3600_000,
      paymentExpectedBy: Date.now() + 8 * 3600_000,
      escrow:"bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    },
    counterparty:{ initials:"ST", color:"#65A519", name:"Peer #2B90", rep:5.0, trades:541, badges:["supertrader"], online:true },
    paymentDetails:{
      type:"SEPA",
      bank:"Deutsche Bank",
      iban:"DE89 3704 0044 0532 0130 00",
      bic:"COBADEFFXXX",
      name:"Stefan T.",
      reference:"PEACH-CT-00148",
    },
  },
  {
    id:"seller_awaiting",
    label:"Seller — Awaiting Payment",
    role:"seller",
    tradeStatus:"paymentRequired",
    lifecycleStep: 1,
    instantTrade: false,
    contract: {
      id:"CT-00149",
      direction:"sell",
      amount:120000,
      fiat:"104.92",
      currency:"EUR",
      premium:0.5,
      method:"Revolut",
      creationDate: Date.now() - 1.5 * 3600_000,
      paymentExpectedBy: Date.now() + 10.5 * 3600_000,
      escrow:"bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    },
    counterparty:{ initials:"DV", color:"#9B5CFF", name:"Peer #A1F3", rep:4.6, trades:67, badges:[], online:true },
    paymentDetails:null,
  },
  {
    id:"confirm_payment",
    label:"Seller — Confirm Payment",
    role:"seller",
    tradeStatus:"confirmPaymentRequired",
    lifecycleStep: 2,
    instantTrade: false,
    contract: {
      id:"CT-00150",
      direction:"sell",
      amount:55000,
      fiat:"47.88",
      currency:"EUR",
      premium:-0.5,
      method:"SEPA",
      creationDate: Date.now() - 6 * 3600_000,
      paymentExpectedBy: null,
      escrow:"bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    },
    counterparty:{ initials:"NB", color:"#037DB5", name:"Peer #C73E", rep:4.8, trades:156, badges:["fast"], online:false },
    paymentDetails:null,
  },
  {
    id:"rate_user",
    label:"Completed — Rate Counterparty",
    role:"buyer",
    tradeStatus:"rateUser",
    lifecycleStep: 3,
    instantTrade: false,
    contract: {
      id:"CT-00145",
      direction:"buy",
      amount:100000,
      fiat:"87.43",
      currency:"EUR",
      premium:-1.5,
      method:"SEPA",
      creationDate: Date.now() - 26 * 3600_000,
      paymentExpectedBy: null,
      escrow:"bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    },
    counterparty:{ initials:"PW", color:"#FF7A50", name:"Peer #4E2A", rep:4.9, trades:312, badges:["supertrader"], online:false },
    paymentDetails:null,
  },
  {
    id:"dispute",
    label:"Dispute Open",
    role:"buyer",
    tradeStatus:"dispute",
    lifecycleStep: 2,
    instantTrade: false,
    contract: {
      id:"CT-00143",
      direction:"buy",
      amount:30000,
      fiat:"26.23",
      currency:"EUR",
      premium:-2.0,
      method:"Revolut",
      creationDate: Date.now() - 28 * 3600_000,
      paymentExpectedBy: null,
      escrow:"bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    },
    counterparty:{ initials:"FR", color:"#DF321F", name:"Peer #D8B1", rep:3.9, trades:9, badges:[], online:false },
    paymentDetails:null,
  },
];

// Mock chat messages per scenario
export const MOCK_MESSAGES = {
  buyer_awaiting: [
    { id:1, from:"counterparty", text:"Hey, I'm ready. Please send the payment to the SEPA details above.", ts: Date.now() - 3 * 3600_000 + 5 * 60_000 },
    { id:2, from:"me",           text:"Got it, sending now. Will take a few minutes to process.", ts: Date.now() - 3 * 3600_000 + 8 * 60_000 },
    { id:3, from:"counterparty", text:"Perfect, let me know once it's done.", ts: Date.now() - 3 * 3600_000 + 10 * 60_000 },
    { id:4, from:"me",           text:"Payment is on its way! Should arrive within 2 hours.", ts: Date.now() - 2 * 3600_000 },
  ],
  seller_awaiting: [
    { id:1, from:"me",           text:"Hello! The escrow is funded. Please review the payment details and send when ready.", ts: Date.now() - 1 * 3600_000 },
    { id:2, from:"counterparty", text:"Hi, on it. My bank might take a little longer, is that ok?", ts: Date.now() - 55 * 60_000 },
    { id:3, from:"me",           text:"That's fine, you have plenty of time. Let me know if you need anything.", ts: Date.now() - 50 * 60_000 },
  ],
  confirm_payment: [
    { id:1, from:"me",           text:"Escrow is set, waiting on your payment.", ts: Date.now() - 5 * 3600_000 },
    { id:2, from:"counterparty", text:"Just sent it via SEPA. Reference: PEACH-CT-00150", ts: Date.now() - 4 * 3600_000 },
    { id:3, from:"counterparty", text:"Please confirm once you see it arrive.", ts: Date.now() - 4 * 3600_000 + 2 * 60_000 },
    { id:4, from:"me",           text:"Checking my account now…", ts: Date.now() - 30 * 60_000 },
  ],
  rate_user: [
    { id:1, from:"counterparty", text:"Payment sent, please confirm.", ts: Date.now() - 25 * 3600_000 },
    { id:2, from:"me",           text:"Confirmed! Releasing now.", ts: Date.now() - 24 * 3600_000 },
    { id:3, from:"counterparty", text:"Bitcoin arrived, thank you!", ts: Date.now() - 23 * 3600_000 },
    { id:4, from:"me",           text:"Smooth trade, thanks!", ts: Date.now() - 23 * 3600_000 + 5 * 60_000 },
  ],
  dispute: [
    { id:1, from:"counterparty", text:"I sent the payment 2 days ago. Why haven't you released?", ts: Date.now() - 27 * 3600_000 },
    { id:2, from:"me",           text:"I never received any payment in my Revolut account.", ts: Date.now() - 26 * 3600_000 },
    { id:3, from:"counterparty", text:"Check again, I have the screenshot.", ts: Date.now() - 25 * 3600_000 },
    { id:4, from:"me",           text:"I've opened a dispute. A Peach mediator will assist us.", ts: Date.now() - 24 * 3600_000 },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// TRADES DASHBOARD — pending offers + trade history
// ═══════════════════════════════════════════════════════════════════════════════

// Mock avatars by initials + color
export const AVATARS = ["KL","MR","ST","DV","NB","FR","PW","JC","EH","OT"];
export const AVATAR_COLORS = ["#FF7A50","#037DB5","#65A519","#F56522","#9B5CFF","#DF321F","#F5CE22","#05A85A"];

// 3 pending + 4 active + 8 history = 15 total
export const MOCK_PENDING = [
  {
    id: "1360", tradeId: "PC\u20111360", kind: "offer", direction: "buy",
    amount: 100000, premium: -1.0, fiatAmount: "87.43", currency: "EUR",
    tradeStatus: "hasMatchesAvailable",
    createdAt: new Date(Date.now() - 1 * 3600_000),
    methods: ["SEPA", "Revolut"], currencies: ["EUR"],
    matchCount: 3,
    matches: [
      {
        offerId: "mock-match-1", requestedAt: Date.now() - 20 * 60_000,
        user: { name: "Peach4E9F", initials: "PE", color: "#FF7A50", rep: 4.2, trades: 47, badges: ["supertrader"] },
        amount: 100000, premium: -1.0, methods: ["SEPA"], currencies: ["EUR"], _raw: {},
      },
      {
        offerId: "mock-match-2", requestedAt: Date.now() - 45 * 60_000,
        user: { name: "PeachB3A1", initials: "PB", color: "#037DB5", rep: 3.8, trades: 22, badges: ["fast"] },
        amount: 100000, premium: -0.8, methods: ["Revolut"], currencies: ["EUR"], _raw: {},
      },
      {
        offerId: "mock-match-3", requestedAt: Date.now() - 2 * 3600_000,
        user: { name: "PeachF712", initials: "PF", color: "#65A519", rep: 2.5, trades: 8, badges: [] },
        amount: 100000, premium: -1.2, methods: ["SEPA"], currencies: ["EUR"], _raw: {},
      },
    ],
  },
  {
    id: "1358", tradeId: "PC\u20111358", kind: "offer", direction: "buy",
    amount: 55000, premium: -0.5, fiatAmount: "48.09", currency: "EUR",
    tradeStatus: "waitingForTradeRequest",
    createdAt: new Date(Date.now() - 6 * 3600_000),
    methods: ["SEPA"], currencies: ["EUR"],
  },
  {
    id: "1355", tradeId: "PC\u20111355", kind: "offer", direction: "sell",
    amount: 200000, premium: 2.0, fiatAmount: "174.86", currency: "EUR",
    tradeStatus: "fundEscrow",
    createdAt: new Date(Date.now() - 12 * 3600_000),
    methods: ["Wise", "SEPA"], currencies: ["EUR", "CHF"],
  },
];

export const MOCK_TRADES = [
  // ── ACTIVE — BUY ──
  {
    id: "1350", tradeId: "PC\u20111350", kind: "contract", direction: "buy",
    amount: 85000, premium: -1.2, fiatAmount: "74.32", currency: "EUR",
    tradeStatus: "paymentRequired", unread: 2,
    createdAt: new Date(Date.now() - 4 * 3600_000),
  },
  {
    id: "1348", tradeId: "PC\u20111348", kind: "contract", direction: "buy",
    amount: 42000, premium: 0.5, fiatAmount: "38.14", currency: "CHF",
    tradeStatus: "confirmPaymentRequired", unread: 0,
    createdAt: new Date(Date.now() - 26 * 3600_000),
  },
  // ── ACTIVE — SELL ──
  {
    id: "1345", tradeId: "PC\u20111345", kind: "offer", direction: "sell",
    amount: 120000, premium: 1.8, fiatAmount: "106.81", currency: "EUR",
    tradeStatus: "paymentRequired",
    createdAt: new Date(Date.now() - 2 * 3600_000),
  },
  {
    id: "1342", tradeId: "PC\u20111342", kind: "contract", direction: "sell",
    amount: 95000, premium: 1.5, fiatAmount: "82.79", currency: "EUR",
    tradeStatus: "confirmPaymentRequired", unread: 1,
    createdAt: new Date(Date.now() - 30 * 60_000),
  },
  // ── HISTORY — COMPLETED (3 buy, 3 sell) ──
  {
    id: "1330-1329", tradeId: "PC\u20111330\u20111329", kind: "contract", direction: "buy",
    amount: 100000, premium: -1.5, fiatAmount: "87.43", currency: "EUR",
    tradeStatus: "tradeCompleted",
    createdAt: new Date(Date.now() - 2 * 86400_000),
  },
  {
    id: "1325-1324", tradeId: "PC\u20111325\u20111324", kind: "contract", direction: "sell",
    amount: 50000, premium: 0.8, fiatAmount: "44.21", currency: "EUR",
    tradeStatus: "tradeCompleted",
    createdAt: new Date(Date.now() - 5 * 86400_000),
  },
  {
    id: "1318-1317", tradeId: "PC\u20111318\u20111317", kind: "contract", direction: "buy",
    amount: 45000, premium: -2.1, fiatAmount: "39.34", currency: "CHF",
    tradeStatus: "tradeCompleted",
    createdAt: new Date(Date.now() - 12 * 86400_000),
  },
  {
    id: "1312-1311", tradeId: "PC\u20111312\u20111311", kind: "contract", direction: "sell",
    amount: 200000, premium: 1.2, fiatAmount: "174.86", currency: "EUR",
    tradeStatus: "tradeCompleted",
    createdAt: new Date(Date.now() - 14 * 86400_000),
  },
  {
    id: "1305-1304", tradeId: "PC\u20111305\u20111304", kind: "contract", direction: "buy",
    amount: 75000, premium: -0.5, fiatAmount: "65.57", currency: "EUR",
    tradeStatus: "tradeCompleted",
    createdAt: new Date(Date.now() - 21 * 86400_000),
  },
  {
    id: "1298-1297", tradeId: "PC\u20111298\u20111297", kind: "contract", direction: "sell",
    amount: 350000, premium: 0.3, fiatAmount: "306.01", currency: "EUR",
    tradeStatus: "tradeCompleted",
    createdAt: new Date(Date.now() - 30 * 86400_000),
  },
  // ── HISTORY — CANCELLED (1 buy, 1 sell) ──
  {
    id: "1290", tradeId: "PC\u20111290", kind: "offer", direction: "buy",
    amount: 60000, premium: -0.8, fiatAmount: "52.46", currency: "EUR",
    tradeStatus: "offerCanceled",
    createdAt: new Date(Date.now() - 8 * 86400_000),
  },
  {
    id: "1285-1284", tradeId: "PC\u20111285\u20111284", kind: "contract", direction: "sell",
    amount: 65000, premium: 1.0, fiatAmount: "56.73", currency: "EUR",
    tradeStatus: "tradeCanceled",
    createdAt: new Date(Date.now() - 18 * 86400_000),
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HOME — user profile & market stats
// ═══════════════════════════════════════════════════════════════════════════════

export const MOCK_STATS = {
  dailyVolume:    { sats: 4_280_000, eur: 3741 },
  dailyTrades:    14,
  activeOffers:   { buy: 6, sell: 8 },
  avgPremiumBuy:  -0.32,
  avgPremiumSell: 0.18,
  topMethods:     [
    { name:"SEPA",    volume:62, count:9  },
    { name:"Revolut", volume:21, count:4  },
    { name:"Wise",    volume:11, count:3  },
    { name:"PayPal",  volume:6,  count:2  },
  ],
  topCurrencies:  [
    { name:"EUR", volume:68, count:12 },
    { name:"CHF", volume:18, count:4  },
    { name:"GBP", volume:14, count:2  },
  ],
};

export const MOCK_USER = {
  peachId:          "PEACH08476D23",
  memberSince:      "March 2023",
  trades:           23,
  disputesTotal:    0,
  rating:           4.7,
  badges:           ["fast"],
  preferredMethods: ["SEPA", "Wise"],
  preferredCurrencies: ["EUR", "CHF"],
  totalVolumeBtc:   1.24,
  lastTradeDaysAgo: 3,
  blockedByCount:   0,
};

// ═══════════════════════════════════════════════════════════════════════════════
// MARKET VIEW — offers + user PMs
// ═══════════════════════════════════════════════════════════════════════════════

export const MOCK_OFFERS = [
  { id:"a_me", type:"ask", amount:73000, premium:0.8, methods:["SEPA","Wise"], currencies:["EUR","CHF"], rep:4.7, trades:23, badges:["fast"], auto:false, online:true, isOwn:true },
  { id:"b_me", type:"bid", amount:120000,  premium:-0.5, methods:["SEPA"],           currencies:["EUR"],       rep:4.7, trades:23,  badges:["fast"],               auto:false, online:true, isOwn:true },
  { id:"a1", type:"ask", amount:85000,   premium:-1.2, methods:["SEPA","Revolut"], currencies:["EUR","CHF"], rep:4.9, trades:312, badges:["supertrader","fast"], auto:true,  online:true  },
  { id:"a2", type:"ask", amount:42000,   premium:0.5,  methods:["SEPA"],           currencies:["EUR"],       rep:4.7, trades:88,  badges:["fast"],              auto:false, online:true,  requested:true },
  { id:"a3", type:"ask", amount:250000,  premium:1.0,  methods:["SEPA","PayPal"],  currencies:["EUR","GBP"], rep:5.0, trades:541, badges:["supertrader"],       auto:false, online:false },
  { id:"a4", type:"ask", amount:18000,   premium:2.1,  methods:["Revolut"],        currencies:["EUR"],       rep:4.3, trades:21,  badges:[],                    auto:false, online:true  },
  { id:"a5", type:"ask", amount:55000,   premium:-0.5, methods:["SEPA","Wise"],    currencies:["EUR","CHF"], rep:4.8, trades:156, badges:["fast"],              auto:true,  online:true  },
  { id:"a6", type:"ask", amount:120000,  premium:1.8,  methods:["PayPal"],         currencies:["EUR"],       rep:4.6, trades:67,  badges:[],                    auto:false, online:true  },
  { id:"a7", type:"ask", amount:9000,    premium:3.2,  methods:["Revolut","SEPA"], currencies:["EUR","CHF","GBP"], rep:3.9, trades:9, badges:[],               auto:false, online:false },
  { id:"b1", type:"bid", amount:80000,   premium:-2.0, methods:["SEPA"],           currencies:["EUR"],       rep:4.5, trades:44,  badges:["fast"],              auto:true,  online:true  },
  { id:"b2", type:"bid", amount:30000,   premium:-0.8, methods:["SEPA","Revolut"], currencies:["EUR","CHF"], rep:4.9, trades:201, badges:["supertrader"],       auto:false, online:true  },
  { id:"b3", type:"bid", amount:150000,  premium:0.3,  methods:["PayPal"],         currencies:["EUR"],       rep:4.2, trades:33,  badges:[],                    auto:false, online:true  },
  { id:"b4", type:"bid", amount:60000,   premium:-1.5, methods:["Wise","SEPA"],    currencies:["EUR","GBP"], rep:4.7, trades:119, badges:["fast"],              auto:false, online:false, requested:true },
  { id:"b5", type:"bid", amount:300000,  premium:1.2,  methods:["SEPA"],           currencies:["EUR","CHF"], rep:5.0, trades:489, badges:["supertrader","fast"],auto:true,  online:true  },
];

// Mock user PMs for market view (replaced by GET /v069/selfUser when authenticated)
export const MOCK_USER_PMS = [
  { id:"pm1", type:"SEPA",    currencies:["EUR","CHF"], details:{ holder:"Peter Weber", iban:"DE89370400440532013000" }},
  { id:"pm2", type:"Revolut", currencies:["EUR","GBP"], details:{ username:"@peterweber" }},
];

// Derived from MOCK_OFFERS — all unique methods
export const MOCK_ALL_METHODS = [...new Set(MOCK_OFFERS.flatMap(o => o.methods))].sort();

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENT METHODS — saved PM list
// ═══════════════════════════════════════════════════════════════════════════════

export const MOCK_SAVED_PMS = [
  { id:"pm1", methodId:"sepa",    name:"SEPA",    currencies:["EUR","CHF"], details:{ holder:"Peter Weber", iban:"DE89 3704 0044 0532 0130 00" }},
  { id:"pm2", methodId:"revolut", name:"Revolut",  currencies:["EUR","GBP"], details:{ username:"@peterweber" }},
  { id:"pm3", methodId:"twint",   name:"Twint",    currencies:["CHF"],       details:{ phone:"+41 79 123 45 67" }},
];

// ═══════════════════════════════════════════════════════════════════════════════
// OFFER CREATION — saved PMs + escrow address
// ═══════════════════════════════════════════════════════════════════════════════

export const MOCK_SAVED_OFFER_PMS = [
  {id:"pm1",type:"SEPA",    currencies:["EUR","CHF"],details:{holder:"Peter Weber",iban:"DE89370400440532013000"}},
  {id:"pm2",type:"Revolut", currencies:["EUR","GBP"],details:{username:"@peterweber"}},
];

export const MOCK_ESCROW = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
