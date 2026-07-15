import quotesData from "../data/quotes.json";

/* ────────────────────────────────────────────────────────────────────────────
   Stocks — a macOS-Stocks-style watchlist of the tickers Jack actually follows.
   Prices are real (fetched from Yahoo at build time by scripts/fetch-quotes.mjs,
   refreshed on every deploy + a daily cron). WATCHLIST ONLY: no holdings, no
   amounts, no P&L — this is a public site.
   ──────────────────────────────────────────────────────────────────────────── */

interface Quote {
  symbol: string;
  name: string;
  group: string;
  currency: string;
  price: number;
  change: number;
  changePercent: number;
  spark: number[];
}

const data = quotesData as { updatedAt: string; quotes: Quote[] };

const CCY: Record<string, string> = { USD: "$", THB: "฿" };

function fmtPrice(q: Quote) {
  const sym = CCY[q.currency] ?? "";
  return sym + q.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Sparkline({ points, up }: { points: number[]; up: boolean }) {
  if (points.length < 2) return <div className="h-8 w-24" />;
  const w = 96;
  const h = 32;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = w / (points.length - 1);
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(h - ((p - min) / span) * (h - 4) - 2).toFixed(1)}`)
    .join(" ");
  const stroke = up ? "#30d158" : "#ff453a";
  return (
    <svg width={w} height={h} className="shrink-0" aria-hidden>
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Row({ q }: { q: Quote }) {
  const up = q.change >= 0;
  const pill = up
    ? "bg-[#30d158]/15 text-[#1a8f3c] dark:bg-[#30d158]/20 dark:text-[#30d158]"
    : "bg-[#ff453a]/15 text-[#c92a20] dark:bg-[#ff453a]/20 dark:text-[#ff453a]";
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.05]">
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold leading-tight text-zinc-900 dark:text-white">{q.symbol.replace(".BK", "")}</div>
        <div className="truncate text-[12px] leading-tight text-zinc-500 dark:text-zinc-400">{q.name}</div>
      </div>
      <Sparkline points={q.spark} up={up} />
      <div className="w-[112px] shrink-0 text-right">
        <div className="text-[15px] font-semibold tabular-nums leading-tight text-zinc-900 dark:text-white">{fmtPrice(q)}</div>
        <div className={`ml-auto mt-0.5 inline-block rounded-md px-1.5 py-0.5 text-[12px] font-semibold tabular-nums ${pill}`}>
          {up ? "+" : ""}
          {q.changePercent.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

export default function Stocks() {
  const us = data.quotes.filter((q) => q.group === "US");
  const set = data.quotes.filter((q) => q.group === "SET");
  const asOf = new Date(data.updatedAt);
  const asOfStr = asOf.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="flex h-full flex-col bg-white text-zinc-900 dark:bg-[#1c1c1e] dark:text-white">
      <header className="flex items-baseline justify-between px-4 pb-2 pt-4">
        <div>
          <h1 className="text-[22px] font-bold leading-none">Stocks</h1>
          <p className="mt-1 text-[12px] text-zinc-500 dark:text-zinc-400">
            Jack's watchlist — what I follow, not what I hold.
          </p>
        </div>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">as of {asOfStr}</span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        <Section title="US Market · USD" quotes={us} />
        <Section title="Thailand (SET) · THB" quotes={set} />
        <p className="px-3 pt-3 text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
          Prices via Yahoo Finance, refreshed at each deploy. Started with less, so I invest like it —
          slowly, and mostly in things that make chips. 📈
        </p>
      </div>
    </div>
  );
}

function Section({ title, quotes }: { title: string; quotes: Quote[] }) {
  if (!quotes.length) return null;
  return (
    <section className="mt-2">
      <h2 className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
        {title}
      </h2>
      <div className="space-y-0.5">
        {quotes.map((q) => (
          <Row key={q.symbol} q={q} />
        ))}
      </div>
    </section>
  );
}
