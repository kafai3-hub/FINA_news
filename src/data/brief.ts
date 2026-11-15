export const yields = [
  { name: "HKAA 29", yield: 3.96, book: "local" as const },
  { name: "MTR 31", yield: 4.01, book: "local" as const },
  { name: "HKAA 36", yield: 4.13, book: "local" as const },
  { name: "MTR 36", yield: 4.18, book: "local" as const },
  { name: "HKE 31", yield: 4.25, book: "local" as const },
  { name: "GOOGL 2y", yield: 4.35, book: "new" as const },
  { name: "GOOGL 5y", yield: 4.7, book: "new" as const },
  { name: "GOOGL 10y", yield: 5.2, book: "new" as const },
];

export const tightening = [
  { tenor: "2y", ipt: 4.6, final: 4.35 },
  { tenor: "5y", ipt: 5.0, final: 4.7 },
  { tenor: "10y", ipt: 5.5, final: 5.2 },
];

export const hkdSize = [
  { tenor: "2y", hkdbn: 7.5 },
  { tenor: "5y", hkdbn: 7.0 },
  { tenor: "10y", hkdbn: 1.5 },
];

export const sgdSize = [
  { tenor: "2y", sgdbn: 0.37, coupon: 2.5 },
  { tenor: "5y", sgdbn: 0.9, coupon: 3.0 },
  { tenor: "10y", sgdbn: 0.33, coupon: 3.4 },
  { tenor: "30y", sgdbn: 0.68, coupon: 3.8 },
];

export const books = {
  hkd: [
    { name: "Orders", value: 32.5 },
    { name: "Print", value: 16 },
  ],
  sgd: [
    { name: "Orders", value: 4 },
    { name: "Print", value: 2.28 },
  ],
};

export const carry = [
  { name: "1M HIBOR", rate: 2.68, role: "fund" as const },
  { name: "2y 4.35", rate: 4.35, role: "bond" as const },
  { name: "5y 4.70", rate: 4.7, role: "bond" as const },
  { name: "10y 5.20", rate: 5.2, role: "bond" as const },
];

export const debtStock = [
  { when: "End-2025", debt: 46.5 },
  { when: "Sep-2026", debt: 125 },
];

export const q3Cash = [
  { name: "Operating CF", value: 42.3 },
  { name: "Capex", value: 51.4 },
];

export const rateShock = [
  { move: "+50bp", y2: -1.0, y5: -2.3, y10: -3.8 },
  { move: "+100bp", y2: -1.9, y5: -4.5, y10: -7.5 },
  { move: "+150bp", y2: -2.9, y5: -6.8, y10: -11.3 },
];

export const pickup = [
  { pair: "2y vs HKAA 29", bp: 39 },
  { pair: "5y vs HKE 31", bp: 45 },
  { pair: "10y vs MTR 36", bp: 102 },
];

export const currencySplit = [
  { name: "HKD", usd: 2.0 },
  { name: "SGD", usd: 1.8 },
];

export type Slide = {
  id: string;
  kicker: string;
  title: string;
  insight: string;
  caption: string;
  audio: string;
  note: string;
};

export const slides: Slide[] = [
  {
    id: "open",
    kicker: "12 Nov 2026",
    title: "First HKD print",
    insight: "HK$16bn plus S$2.28bn. About US$3.8bn. Priced inside guidance.",
    caption:
      "Alphabet priced its first Hong Kong dollar bonds on 12 November 2026. Sixteen billion Hong Kong dollars, plus a Singapore dollar leg, about 3.8 billion US dollars together.",
    audio: "/vo/01.mp3",
    note: "Reoffer, term sheets reported by Reuters.",
  },
  {
    id: "yields",
    kicker: "Versus the local book",
    title: "Yield sits above the comps",
    insight: "Local AA-range names cluster near 4.0–4.3%. The new 10-year is 5.20%.",
    caption:
      "MTR, the Airport Authority and HK Electric were indicated around four to four and a quarter percent. Alphabet's ten-year came at 5.20.",
    audio: "/vo/02.mp3",
    note: "Secondary indications around launch, not a same-day composite.",
  },
  {
    id: "tighten",
    kicker: "IPT to reoffer",
    title: "Books tightened 25–30bp",
    insight: "Talk started at 4.60 / 5.00 / 5.50. Final was 4.35 / 4.70 / 5.20.",
    caption:
      "Initial thoughts were 4.60, 5.00 and 5.50. Final Hong Kong dollar yields were 25 to 30 basis points tighter.",
    audio: "/vo/03.mp3",
    note: "Hong Kong dollar tranches only.",
  },
  {
    id: "size",
    kicker: "Where the paper went",
    title: "Size leaned short",
    insight: "HK$7.5bn two-year, HK$7bn five-year, HK$1.5bn ten-year.",
    caption:
      "Size leaned to the short end. Singapore dollars added four tenors out to thirty years, from 2.50 to 3.80 percent.",
    audio: "/vo/04.mp3",
    note: "HK$ billion and S$ billion, final allocations.",
  },
  {
    id: "books",
    kicker: "Cover",
    title: "Orders ran ahead of the print",
    insight: "HKD book above HK$32.5bn. SGD book above S$4bn.",
    caption:
      "Hong Kong dollar orders topped 32.5 billion against a 16 billion print. Singapore dollar orders topped 4 billion.",
    audio: "/vo/05.mp3",
    note: "Orders include joint-lead interest, as reported.",
  },
  {
    id: "carry",
    kicker: "Funding versus coupon",
    title: "The gap is not locked",
    insight: "1-month HIBOR 2.68%. Coupons are fixed. Funding is not.",
    caption:
      "One-month HIBOR is about 2.68 percent. The gap versus the coupons is not a locked spread. HIBOR has spiked above 5 percent before.",
    audio: "/vo/06.mp3",
    note: "HKAB 1-month HIBOR, 13 Nov 2026.",
  },
  {
    id: "issuer",
    kicker: "Why the bid exists",
    title: "Debt up, cash gap open",
    insight: "Long-term debt about $46.5bn to $125bn. Q3 capex $51.4bn vs OCF $42.3bn.",
    caption:
      "Long-term debt rose from about 46.5 billion dollars to about 125 billion. Third-quarter capex ran ahead of operating cash flow.",
    audio: "/vo/07.mp3",
    note: "Company filings, year-end 2025 and quarter ended Sep 2026.",
  },
  {
    id: "risk",
    kicker: "What you actually own",
    title: "Pickup versus price risk",
    insight: "10-year duration about 7.5. +100bp is roughly −7.5 points.",
    caption:
      "A one percent rise in yields takes roughly seven and a half percent off the ten-year. The yield pickup is real. It is not a free carry trade.",
    audio: "/vo/08.mp3",
    note: "Illustrative. Modified duration approx. 1.9 / 4.5 / 7.5.",
  },
];
