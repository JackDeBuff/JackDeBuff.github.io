/* Jack's journey — the real places that carried him from a river town in
   Samut Prakan to Duke, each one a little further from home. Coordinates are
   the actual sites (via OpenStreetMap); captions are public copy (honest + a
   little funny). Order = chronological. */

export interface Stop {
  id: string;
  title: string;
  place: string;
  period: string;
  emoji: string;
  caption: string;
  country: "TH" | "US";
  lat: number;
  lon: number;
}

export const journey: Stop[] = [
  {
    id: "home",
    title: "Home — Samut Prakan",
    place: "Thai Ban, Samut Prakan",
    period: "2000",
    emoji: "🏠",
    caption: "Where it all starts. Born here, an only child, on the coast just south of Bangkok.",
    country: "TH",
    lat: 13.55694,
    lon: 100.59576,
  },
  {
    id: "acsp",
    title: "Assumption College Samut Prakan",
    place: "Samut Prakan",
    period: "2009 – 2013",
    emoji: "✝️",
    caption: "A Christian school close to home. Where I first realized I was good at math and science.",
    country: "TH",
    lat: 13.62855,
    lon: 100.60339,
  },
  {
    id: "suankularb",
    title: "Suankularb Wittayalai",
    place: "Bangkok",
    period: "2013 – 2016",
    emoji: "🚌",
    caption: "One of Thailand's 'big four' all-boys schools — 40 km from home. Scholarship in one hand, bus pass in the other.",
    country: "TH",
    lat: 13.74293,
    lon: 100.49793,
  },
  {
    id: "mwit",
    title: "Mahidol Wittayanusorn (MWIT)",
    place: "Salaya, Nakhon Pathom",
    period: "2016 – 2019",
    emoji: "🔬",
    caption:
      "Thailand's toughest science school to get into. I snuck in as the very last student on the reserve list — then stayed for good.",
    country: "TH",
    lat: 13.79999,
    lon: 100.31911,
  },
  {
    id: "chula",
    title: "Chulalongkorn University",
    place: "Bangkok",
    period: "2019 – 2023",
    emoji: "🎓",
    caption: "Computer Engineering at Thailand's #1 university — on a scholarship.",
    country: "TH",
    lat: 13.74309,
    lon: 100.53287,
  },
  {
    id: "kbtg",
    title: "KASIKORN Labs (KBTG)",
    place: "Chaeng Watthana, Nonthaburi",
    period: "2022 – 2025",
    emoji: "💻",
    caption:
      "Shipped ML that appraises land in minutes instead of weeks — and earned the scholarship that flew me across the world.",
    country: "TH",
    lat: 13.91057,
    lon: 100.55153,
  },
  {
    id: "duke",
    title: "Duke University",
    place: "Durham, NC 🇺🇸",
    period: "2025 – now",
    emoji: "🇺🇸",
    caption:
      "13,000 km from home. First time truly independent — cooking daily, laundry weekly, English all day. Quiet town, kind people. I love it here.",
    country: "US",
    lat: 36.00016,
    lon: -78.94423,
  },
];
