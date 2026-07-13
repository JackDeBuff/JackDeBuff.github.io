import { useRef, useState } from "react";

const HOME_URL = "https://www.google.com/webhp?igu=1";

/** Jack's favourite song — Gut Genug, obviously. Starts at the good part. */
const GUT_GENUG_URL = "https://www.youtube-nocookie.com/embed/0GnA8VYOfko?start=14&autoplay=1";

/**
 * Wikipedia article for the visitor's country, via IP lookup (no browser
 * geolocation permission involved). Falls back to Thailand 🇹🇭.
 */
let wikiCountryUrl: string | null = null;
async function getWikipediaUrl(): Promise<string> {
  if (wikiCountryUrl) return wikiCountryUrl;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch("https://ipwho.is/?fields=country", { signal: ctrl.signal });
    clearTimeout(t);
    const data = await res.json();
    if (data?.country) {
      wikiCountryUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(data.country.replace(/ /g, "_"))}`;
      return wikiCountryUrl;
    }
  } catch {
    /* fall through to Thailand */
  }
  return "https://en.wikipedia.org/wiki/Thailand";
}

const BOOKMARKS: { label: string; url?: string; resolve?: () => Promise<string> }[] = [
  { label: "Google", url: HOME_URL },
  { label: "Wikipedia", resolve: getWikipediaUrl },
  { label: "Gut Genug 🎶", url: GUT_GENUG_URL },
  { label: "jackdebuff.github.io", url: "https://jackdebuff.github.io" },
];

function normalize(input: string): string {
  const v = input.trim();
  if (!v) return HOME_URL;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^[\w-]+(\.[\w-]+)+/.test(v)) return `https://${v}`;
  return `https://www.google.com/search?igu=1&q=${encodeURIComponent(v)}`;
}

export default function Chrome() {
  const [stack, setStack] = useState<string[]>([HOME_URL]);
  const [idx, setIdx] = useState(0);
  const [address, setAddress] = useState(HOME_URL);
  const [frameKey, setFrameKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const current = stack[idx];

  function go(url: string) {
    const next = normalize(url);
    const newStack = [...stack.slice(0, idx + 1), next];
    setStack(newStack);
    setIdx(newStack.length - 1);
    setAddress(next);
    setFrameKey((k) => k + 1);
  }

  function nav(delta: number) {
    const n = Math.min(Math.max(idx + delta, 0), stack.length - 1);
    setIdx(n);
    setAddress(stack[n]);
    setFrameKey((k) => k + 1);
  }

  return (
    <div className="flex h-full flex-col bg-zinc-800">
      {/* Toolbar */}
      <div className="glass-thin flex items-center gap-1 px-2.5 py-1.5">
        <button
          aria-label="Back"
          onClick={() => nav(-1)}
          disabled={idx === 0}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-zinc-600 transition hover:bg-black/[0.06] disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-300 dark:hover:bg-white/10"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>
        <button
          aria-label="Forward"
          onClick={() => nav(1)}
          disabled={idx >= stack.length - 1}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-zinc-600 transition hover:bg-black/[0.06] disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-300 dark:hover:bg-white/10"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
        <button
          aria-label="Reload"
          onClick={() => setFrameKey((k) => k + 1)}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-zinc-600 transition hover:bg-black/[0.06] dark:text-zinc-300 dark:hover:bg-white/10"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
        <form
          className="flex min-w-0 flex-1 justify-center px-1"
          onSubmit={(e) => {
            e.preventDefault();
            go(address);
          }}
        >
          <div className="relative flex w-full max-w-xl items-center">
            <svg
              aria-hidden
              className="pointer-events-none absolute left-3 text-zinc-400 dark:text-zinc-500"
              width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"
            >
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="w-full rounded-[9px] bg-black/[0.05] py-1 pl-8 pr-3 text-[13px] font-medium text-zinc-700 outline-none ring-1 ring-transparent transition placeholder:text-zinc-400 focus:bg-black/[0.08] focus:ring-blue-500/60 dark:bg-white/[0.08] dark:text-zinc-100 dark:focus:bg-white/[0.12]"
              spellCheck={false}
            />
          </div>
        </form>
        <a
          href={current}
          target="_blank"
          rel="noopener"
          title="Open in a real tab"
          aria-label="Open in a real tab"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-zinc-600 transition hover:bg-black/[0.06] hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <path d="M15 3h6v6" />
            <path d="M10 14 21 3" />
          </svg>
        </a>
      </div>
      {/* Bookmarks bar */}
      <div className="no-scrollbar flex items-center gap-1 overflow-x-auto border-b border-black/40 bg-zinc-900/80 px-3 py-1">
        {BOOKMARKS.map((b) => (
          <button
            key={b.label}
            onClick={() => {
              if (b.url) go(b.url);
              else b.resolve?.().then(go);
            }}
            className="shrink-0 whitespace-nowrap rounded-md px-2.5 py-0.5 text-xs text-zinc-300 hover:bg-white/10"
          >
            {b.label}
          </button>
        ))}
        <span className="ml-auto hidden shrink-0 self-center whitespace-nowrap pl-2 text-[10px] text-zinc-500 md:inline">
          some sites refuse to load in an embedded browser — use ↗
        </span>
      </div>
      <iframe
        key={frameKey}
        ref={iframeRef}
        src={current}
        title="Chrome"
        className="min-h-0 w-full flex-1 border-0 bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
