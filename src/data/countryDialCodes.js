// ─── COUNTRY DIAL CODES ──────────────────────────────────────────────────────
// Data port of mobile's countryMap.ts (peach-app/src/utils/country/countryMap.ts).
// Trimmed: only the fields needed for `isPhoneAllowed`:
//   - dialCode (E.164 country prefix)
//   - phoneAreaCodes (US/CA disambiguation only — both share +1)
//   - highRisk (mobile blocks these regardless of US check)
// `name` and explicit `highRisk: false` removed to keep the file small.
//
// Allowlist semantics: any phone whose dial code matches no entry here is
// rejected by `isPhoneAllowed` (matches mobile behaviour where `getCountryCodeByPhone`
// returns undefined → `isHighRiskCountry` returns true).
// ─────────────────────────────────────────────────────────────────────────────

export const COUNTRY_MAP = {
  AF: {
    dialCode: "+93",
  },
  AX: {
    dialCode: "+358",
  },
  AL: {
    dialCode: "+355",
  },
  DZ: {
    dialCode: "+213",
  },
  AS: {
    dialCode: "+1684",
  },
  AD: {
    dialCode: "+376",
  },
  AO: {
    dialCode: "+244",
  },
  AI: {
    dialCode: "+1264",
  },
  AQ: {
    dialCode: "+672",
  },
  AG: {
    dialCode: "+1268",
  },
  AR: {
    dialCode: "+54",
  },
  AM: {
    dialCode: "+374",
  },
  AW: {
    dialCode: "+297",
  },
  AU: {
    dialCode: "+61",
  },
  AT: {
    dialCode: "+43",
  },
  AZ: {
    dialCode: "+994",
  },
  BS: {
    dialCode: "+1242",
  },
  BH: {
    dialCode: "+973",
  },
  BD: {
    dialCode: "+880",
  },
  BB: {
    dialCode: "+1246",
  },
  BY: {
    dialCode: "+375",
  },
  BE: {
    dialCode: "+32",
  },
  BZ: {
    dialCode: "+501",
  },
  BJ: {
    dialCode: "+229",
  },
  BM: {
    dialCode: "+1441",
  },
  BT: {
    dialCode: "+975",
  },
  BO: {
    dialCode: "+591",
  },
  BA: {
    dialCode: "+387",
  },
  BW: {
    dialCode: "+267",
  },
  BR: {
    dialCode: "+55",
  },
  IO: {
    dialCode: "+246",
  },
  BN: {
    dialCode: "+673",
  },
  BG: {
    dialCode: "+359",
  },
  BF: {
    dialCode: "+226",
  },
  BI: {
    dialCode: "+257",
  },
  KH: {
    dialCode: "+855",
  },
  CM: {
    dialCode: "+237",
  },
  CA: {
    dialCode: "+1",
    phoneAreaCodes: [
      "204",
      "226",
      "236",
      "249",
      "250",
      "289",
      "306",
      "343",
      "365",
      "403",
      "416",
      "418",
      "431",
      "437",
      "438",
      "450",
      "506",
      "514",
      "519",
      "579",
      "581",
      "587",
      "604",
      "613",
      "639",
      "647",
      "705",
      "709",
      "778",
      "780",
      "807",
      "819",
      "867",
      "873",
      "902",
      "905",
    ],
  },
  CV: {
    dialCode: "+238",
  },
  KY: {
    dialCode: "+ 345",
  },
  CF: {
    dialCode: "+236",
  },
  TD: {
    dialCode: "+235",
  },
  CL: {
    dialCode: "+56",
  },
  CN: {
    dialCode: "+86",
  },
  CX: {
    dialCode: "+61",
  },
  CC: {
    dialCode: "+61",
  },
  CO: {
    dialCode: "+57",
  },
  KM: {
    dialCode: "+269",
  },
  CG: {
    dialCode: "+242",
  },
  CD: {
    dialCode: "+243",
  },
  CK: {
    dialCode: "+682",
  },
  CR: {
    dialCode: "+506",
  },
  CI: {
    dialCode: "+225",
  },
  HR: {
    dialCode: "+385",
  },
  CU: {
    dialCode: "+53",
  },
  CY: {
    dialCode: "+357",
  },
  CZ: {
    dialCode: "+420",
  },
  DK: {
    dialCode: "+45",
  },
  DJ: {
    dialCode: "+253",
  },
  DM: {
    dialCode: "+1767",
  },
  DO: {
    dialCode: "+1849",
  },
  EC: {
    dialCode: "+593",
  },
  EG: {
    dialCode: "+20",
  },
  SV: {
    dialCode: "+503",
  },
  GQ: {
    dialCode: "+240",
  },
  ER: {
    dialCode: "+291",
  },
  EE: {
    dialCode: "+372",
  },
  ET: {
    dialCode: "+251",
  },
  FK: {
    dialCode: "+500",
  },
  FO: {
    dialCode: "+298",
  },
  FJ: {
    dialCode: "+679",
  },
  FI: {
    dialCode: "+358",
  },
  FR: {
    dialCode: "+33",
  },
  GF: {
    dialCode: "+594",
  },
  PF: {
    dialCode: "+689",
  },
  GA: {
    dialCode: "+241",
  },
  GM: {
    dialCode: "+220",
  },
  GE: {
    dialCode: "+995",
  },
  DE: {
    dialCode: "+49",
  },
  GH: {
    dialCode: "+233",
  },
  GI: {
    dialCode: "+350",
  },
  GR: {
    dialCode: "+30",
  },
  GL: {
    dialCode: "+299",
  },
  GD: {
    dialCode: "+1473",
  },
  GP: {
    dialCode: "+590",
  },
  GU: {
    dialCode: "+1671",
  },
  GT: {
    dialCode: "+502",
  },
  GG: {
    dialCode: "+44",
  },
  GN: {
    dialCode: "+224",
  },
  GW: {
    dialCode: "+245",
  },
  GY: {
    dialCode: "+595",
  },
  HT: {
    dialCode: "+509",
  },
  VA: {
    dialCode: "+379",
  },
  HN: {
    dialCode: "+504",
  },
  HK: {
    dialCode: "+852",
  },
  HU: {
    dialCode: "+36",
  },
  IS: {
    dialCode: "+354",
  },
  IN: {
    dialCode: "+91",
  },
  ID: {
    dialCode: "+62",
  },
  IR: {
    dialCode: "+98",
    highRisk: true,
  },
  IQ: {
    dialCode: "+964",
  },
  IE: {
    dialCode: "+353",
  },
  IM: {
    dialCode: "+44",
  },
  IL: {
    dialCode: "+972",
  },
  IT: {
    dialCode: "+39",
  },
  JM: {
    dialCode: "+1876",
  },
  JP: {
    dialCode: "+81",
  },
  JE: {
    dialCode: "+44",
  },
  JO: {
    dialCode: "+962",
  },
  KZ: {
    dialCode: "+77",
  },
  KE: {
    dialCode: "+254",
  },
  KI: {
    dialCode: "+686",
  },
  KP: {
    dialCode: "+850",
    highRisk: true,
  },
  KR: {
    dialCode: "+82",
  },
  KW: {
    dialCode: "+965",
  },
  KG: {
    dialCode: "+996",
  },
  LA: {
    dialCode: "+856",
  },
  LV: {
    dialCode: "+371",
  },
  LB: {
    dialCode: "+961",
  },
  LS: {
    dialCode: "+266",
  },
  LR: {
    dialCode: "+231",
  },
  LY: {
    dialCode: "+218",
  },
  LI: {
    dialCode: "+423",
  },
  LT: {
    dialCode: "+370",
  },
  LU: {
    dialCode: "+352",
  },
  MO: {
    dialCode: "+853",
  },
  MK: {
    dialCode: "+389",
  },
  MG: {
    dialCode: "+261",
  },
  MW: {
    dialCode: "+265",
  },
  MY: {
    dialCode: "+60",
  },
  MV: {
    dialCode: "+960",
  },
  ML: {
    dialCode: "+223",
  },
  MT: {
    dialCode: "+356",
  },
  MH: {
    dialCode: "+692",
  },
  MQ: {
    dialCode: "+596",
  },
  MR: {
    dialCode: "+222",
  },
  MU: {
    dialCode: "+230",
  },
  YT: {
    dialCode: "+262",
  },
  MX: {
    dialCode: "+52",
  },
  FM: {
    dialCode: "+691",
  },
  MD: {
    dialCode: "+373",
  },
  MC: {
    dialCode: "+377",
  },
  MN: {
    dialCode: "+976",
  },
  ME: {
    dialCode: "+382",
  },
  MS: {
    dialCode: "+1664",
  },
  MA: {
    dialCode: "+212",
  },
  MZ: {
    dialCode: "+258",
  },
  MM: {
    dialCode: "+95",
    highRisk: true,
  },
  NA: {
    dialCode: "+264",
  },
  NR: {
    dialCode: "+674",
  },
  NP: {
    dialCode: "+977",
  },
  NL: {
    dialCode: "+31",
  },
  AN: {
    dialCode: "+599",
  },
  NC: {
    dialCode: "+687",
  },
  NZ: {
    dialCode: "+64",
  },
  NI: {
    dialCode: "+505",
  },
  NE: {
    dialCode: "+227",
  },
  NG: {
    dialCode: "+234",
  },
  NU: {
    dialCode: "+683",
  },
  NF: {
    dialCode: "+672",
  },
  MP: {
    dialCode: "+1670",
  },
  NO: {
    dialCode: "+47",
  },
  OM: {
    dialCode: "+968",
  },
  PK: {
    dialCode: "+92",
  },
  PW: {
    dialCode: "+680",
  },
  PS: {
    dialCode: "+970",
  },
  PA: {
    dialCode: "+507",
  },
  PG: {
    dialCode: "+675",
  },
  PY: {
    dialCode: "+595",
  },
  PE: {
    dialCode: "+51",
  },
  PH: {
    dialCode: "+63",
  },
  PN: {
    dialCode: "+872",
  },
  PL: {
    dialCode: "+48",
  },
  PT: {
    dialCode: "+351",
  },
  PR: {
    dialCode: "+1939",
  },
  QA: {
    dialCode: "+974",
  },
  RO: {
    dialCode: "+40",
  },
  RU: {
    dialCode: "+7",
  },
  RW: {
    dialCode: "+250",
  },
  RE: {
    dialCode: "+262",
  },
  BL: {
    dialCode: "+590",
  },
  SH: {
    dialCode: "+290",
  },
  KN: {
    dialCode: "+1869",
  },
  LC: {
    dialCode: "+1758",
  },
  MF: {
    dialCode: "+590",
  },
  PM: {
    dialCode: "+508",
  },
  VC: {
    dialCode: "+1784",
  },
  WS: {
    dialCode: "+685",
  },
  SM: {
    dialCode: "+378",
  },
  ST: {
    dialCode: "+239",
  },
  SA: {
    dialCode: "+966",
  },
  SN: {
    dialCode: "+221",
  },
  RS: {
    dialCode: "+381",
  },
  SC: {
    dialCode: "+248",
  },
  SL: {
    dialCode: "+232",
  },
  SG: {
    dialCode: "+65",
  },
  SK: {
    dialCode: "+421",
  },
  SI: {
    dialCode: "+386",
  },
  SB: {
    dialCode: "+677",
  },
  SO: {
    dialCode: "+252",
  },
  ZA: {
    dialCode: "+27",
  },
  SS: {
    dialCode: "+211",
  },
  GS: {
    dialCode: "+500",
  },
  ES: {
    dialCode: "+34",
  },
  LK: {
    dialCode: "+94",
  },
  SD: {
    dialCode: "+249",
  },
  SR: {
    dialCode: "+597",
  },
  SJ: {
    dialCode: "+47",
  },
  SZ: {
    dialCode: "+268",
  },
  SE: {
    dialCode: "+46",
  },
  CH: {
    dialCode: "+41",
  },
  SY: {
    dialCode: "+963",
  },
  TW: {
    dialCode: "+886",
  },
  TJ: {
    dialCode: "+992",
  },
  TZ: {
    dialCode: "+255",
  },
  TH: {
    dialCode: "+66",
  },
  TL: {
    dialCode: "+670",
  },
  TG: {
    dialCode: "+228",
  },
  TK: {
    dialCode: "+690",
  },
  TO: {
    dialCode: "+676",
  },
  TT: {
    dialCode: "+1868",
  },
  TN: {
    dialCode: "+216",
  },
  TR: {
    dialCode: "+90",
  },
  TM: {
    dialCode: "+993",
  },
  TC: {
    dialCode: "+1649",
  },
  TV: {
    dialCode: "+688",
  },
  UG: {
    dialCode: "+256",
  },
  UA: {
    dialCode: "+380",
  },
  AE: {
    dialCode: "+971",
  },
  GB: {
    dialCode: "+44",
  },
  UK: {
    dialCode: "+44",
  },
  US: {
    dialCode: "+1",
  },
  UY: {
    dialCode: "+598",
  },
  UZ: {
    dialCode: "+998",
  },
  VU: {
    dialCode: "+678",
  },
  VE: {
    dialCode: "+58",
  },
  VN: {
    dialCode: "+84",
  },
  VG: {
    dialCode: "+1284",
  },
  VI: {
    dialCode: "+1340",
  },
  WF: {
    dialCode: "+681",
  },
  YE: {
    dialCode: "+967",
  },
  ZM: {
    dialCode: "+260",
  },
  ZW: {
    dialCode: "+263",
  },
};
