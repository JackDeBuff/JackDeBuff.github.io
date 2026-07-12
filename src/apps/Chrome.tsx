import { useRef, useState } from "react";

const HOME_URL = "https://www.google.com/webhp?igu=1";

const BOOKMARKS: { label: string; url: string }[] = [
  { label: "Google", url: HOME_URL },
  { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Machine_learning" },
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
      <div className="glass-thin flex items-center gap-2 px-3 py-2">
        <button onClick={() => nav(-1)} disabled={idx === 0} className="text-lg text-zinc-300 disabled:text-zinc-600">
          ←
        </button>
        <button onClick={() => nav(1)} disabled={idx >= stack.length - 1} className="text-lg text-zinc-300 disabled:text-zinc-600">
          →
        </button>
        <button onClick={() => setFrameKey((k) => k + 1)} className="text-base text-zinc-300">
          ⟳
        </button>
        <form
          className="flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            go(address);
          }}
        >
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="w-full rounded-full bg-black/30 px-4 py-1.5 text-[13px] text-zinc-100 outline-none ring-1 ring-white/10 focus:ring-blue-500"
            spellCheck={false}
          />
        </form>
        <a
          href={current}
          target="_blank"
          rel="noopener"
          title="Open in a real tab"
          className="text-sm text-zinc-300 hover:text-white"
        >
          ↗
        </a>
      </div>
      {/* Bookmarks bar */}
      <div className="flex gap-1 border-b border-black/40 bg-zinc-900/80 px-3 py-1">
        {BOOKMARKS.map((b) => (
          <button
            key={b.label}
            onClick={() => go(b.url)}
            className="rounded-md px-2.5 py-0.5 text-xs text-zinc-300 hover:bg-white/10"
          >
            {b.label}
          </button>
        ))}
        <span className="ml-auto self-center text-[10px] text-zinc-500">
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
