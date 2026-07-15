// Build-time stock-quote fetcher.
//
// Runs in GitHub Actions (and locally) — NOT in the browser — so it sidesteps
// CORS and needs no API key. Pulls Jack's watchlist from Yahoo Finance's public
// chart endpoint and writes src/data/quotes.json, which the Stocks app imports
// statically. The committed file doubles as an offline/local-dev fallback.
//
//   node scripts/fetch-quotes.mjs
//
// Watchlist only: prices + day change + a 1-month sparkline. No holdings, no
// amounts — this is a public site.

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "src", "data", "quotes.json");

/** Yahoo symbol → display name + group. Order here is the display order. */
const WATCHLIST = [
  { symbol: "NVDA", name: "NVIDIA", group: "US" },
  { symbol: "GOOGL", name: "Alphabet", group: "US" },
  { symbol: "MSFT", name: "Microsoft", group: "US" },
  { symbol: "AMZN", name: "Amazon", group: "US" },
  { symbol: "AMD", name: "AMD", group: "US" },
  { symbol: "ASML", name: "ASML Holding", group: "US" },
  { symbol: "SMH", name: "VanEck Semiconductor ETF", group: "US" },
  { symbol: "QQQM", name: "Invesco Nasdaq 100 ETF", group: "US" },
  { symbol: "IVV", name: "iShares Core S&P 500 ETF", group: "US" },
  { symbol: "DELTA.BK", name: "Delta Electronics (Thailand)", group: "SET" },
  { symbol: "KBANK.BK", name: "Kasikornbank", group: "SET" },
];

async function fetchOne({ symbol, name, group }) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol,
  )}?range=1mo&interval=1d`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${symbol}: HTTP ${res.status}`);
  const json = await res.json();
  const r = json?.chart?.result?.[0];
  if (!r) throw new Error(`${symbol}: no result`);
  const meta = r.meta;
  const price = meta.regularMarketPrice;
  const closes = (r.indicators?.quote?.[0]?.close ?? []).filter(
    (v) => typeof v === "number" && !Number.isNaN(v),
  );
  // Day change = latest daily bar vs the PRIOR trading day's close. With a
  // 1-month range, meta.chartPreviousClose is a month-ago close (wrong), so
  // derive the previous close from the second-to-last daily bar instead.
  const prev = closes.length >= 2 ? closes[closes.length - 2] : meta.chartPreviousClose ?? price;
  const spark = closes.slice(-24).map((v) => Math.round(v * 100) / 100);
  return {
    symbol,
    name,
    group,
    currency: meta.currency ?? "USD",
    price: Math.round(price * 100) / 100,
    change: Math.round((price - prev) * 100) / 100,
    changePercent: Math.round(((price - prev) / prev) * 10000) / 100,
    spark,
  };
}

async function main() {
  const results = await Promise.allSettled(WATCHLIST.map(fetchOne));
  const quotes = [];
  const failed = [];
  results.forEach((res, i) => {
    if (res.status === "fulfilled") quotes.push(res.value);
    else failed.push(`${WATCHLIST[i].symbol} (${res.reason?.message ?? res.reason})`);
  });

  if (!quotes.length) {
    // Total failure (e.g. Yahoo down / network blocked): keep the committed
    // fallback untouched so the app still shows real-ish data.
    console.error("fetch-quotes: all symbols failed, keeping existing quotes.json");
    console.error(failed.join("\n"));
    process.exit(0);
  }

  // Preserve display order from WATCHLIST even though Promise ordering is stable.
  quotes.sort(
    (a, b) =>
      WATCHLIST.findIndex((w) => w.symbol === a.symbol) -
      WATCHLIST.findIndex((w) => w.symbol === b.symbol),
  );

  const payload = { updatedAt: new Date().toISOString(), quotes };

  // If some symbols failed, backfill them from the previous file so we never
  // shrink the watchlist on a flaky run.
  if (failed.length) {
    try {
      const prev = JSON.parse(await readFile(OUT, "utf8"));
      const have = new Set(quotes.map((q) => q.symbol));
      for (const q of prev.quotes ?? []) if (!have.has(q.symbol)) quotes.push(q);
      quotes.sort(
        (a, b) =>
          WATCHLIST.findIndex((w) => w.symbol === a.symbol) -
          WATCHLIST.findIndex((w) => w.symbol === b.symbol),
      );
    } catch {
      /* no previous file — fine */
    }
    console.warn("fetch-quotes: some symbols failed:\n" + failed.join("\n"));
  }

  await writeFile(OUT, JSON.stringify(payload, null, 2) + "\n");
  console.log(`fetch-quotes: wrote ${quotes.length} quotes → ${OUT}`);
}

main().catch((e) => {
  console.error("fetch-quotes: fatal", e);
  process.exit(0); // never fail the build over stock prices
});
