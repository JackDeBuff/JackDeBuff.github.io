import { useEffect, useRef, useState } from "react";
import { PoopLogo } from "../icons/AppIcons";
import { useWindows } from "../state/windows";
import { apps } from "../apps/apps.config";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

const fmtDate = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
const fmtTime = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

/* Clean, symmetric status glyphs — all drawn on the same 16×16 grid, stroke-based */
function WifiGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeLinecap="round" aria-label="wifi">
      <path d="M1.5 6.2 a10 10 0 0 1 13 0" strokeWidth="1.6" />
      <path d="M3.9 8.9 a6.5 6.5 0 0 1 8.2 0" strokeWidth="1.6" />
      <path d="M6.3 11.5 a3.2 3.2 0 0 1 3.4 0" strokeWidth="1.6" />
      <circle cx="8" cy="13.4" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SearchGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeLinecap="round" aria-label="search">
      <circle cx="7" cy="7" r="4.6" strokeWidth="1.6" />
      <path d="M10.6 10.6 L14 14" strokeWidth="1.6" />
    </svg>
  );
}

function ControlCenterGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" aria-label="control center">
      <rect x="1.2" y="2.6" width="13.6" height="4.6" rx="2.3" strokeWidth="1.5" />
      <circle cx="4.9" cy="4.9" r="1.4" fill="currentColor" stroke="none" />
      <rect x="1.2" y="8.8" width="13.6" height="4.6" rx="2.3" strokeWidth="1.5" />
      <circle cx="11.1" cy="11.1" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BatteryGlyph() {
  return (
    <svg viewBox="0 0 28 14" className="h-[13px] w-[26px]" aria-label="battery">
      <rect x="0.75" y="0.75" width="22.5" height="12.5" rx="3.75" fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" />
      <rect x="2.5" y="2.5" width="15.5" height="9" rx="2" fill="currentColor" />
      <path d="M25.5 4.6 v4.8 c1.5 -0.45 2.2 -1.3 2.2 -2.4 s-0.7 -1.95 -2.2 -2.4Z" fill="currentColor" fillOpacity="0.55" />
    </svg>
  );
}

export default function MenuBar({
  onLock,
  onRestart,
  onAboutMac,
}: {
  onLock: () => void;
  onRestart: () => void;
  onAboutMac: () => void;
}) {
  const now = useClock();
  const { activeId, openWindow } = useWindows();
  const [appleOpen, setAppleOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!appleOpen) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setAppleOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [appleOpen]);

  const activeApp = apps.find((a) => a.id === activeId);
  const appName = activeApp?.title ?? "Finder";

  const item = (label: string, action?: () => void, disabled = false) => (
    <button
      key={label}
      disabled={disabled}
      onClick={() => {
        action?.();
        setAppleOpen(false);
      }}
      className="block w-full rounded-md px-3 py-1 text-left text-[13px] text-zinc-800 enabled:hover:bg-blue-500 enabled:hover:text-white disabled:text-zinc-400 dark:text-zinc-100 dark:disabled:text-zinc-500"
    >
      {label}
    </button>
  );

  return (
    <div className="relative z-[9000] flex h-7 items-center px-3 text-[13px] font-medium text-white/95 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
      <div ref={menuRef} className="relative">
        <button
          className={`rounded px-2 py-0.5 ${appleOpen ? "bg-white/20" : "hover:bg-white/10"}`}
          onClick={() => setAppleOpen((v) => !v)}
        >
          <PoopLogo className="h-4 w-4" />
        </button>
        {appleOpen && (
          <div className="menu-in glass-menu absolute left-0 top-8 w-56 rounded-[var(--radius-menu)] p-1">
            {item("About This Mac", onAboutMac)}
            <div className="mx-2 my-1 h-px bg-black/10 dark:bg-white/15" />
            {item("System Settings…", () => openWindow("settings"))}
            <div className="mx-2 my-1 h-px bg-black/10 dark:bg-white/15" />
            {item("Lock Screen", onLock)}
            {item("Restart…", onRestart)}
            {item("Shut Down…", onRestart)}
          </div>
        )}
      </div>
      <span className="max-w-36 truncate whitespace-nowrap px-2 font-bold">{appName}</span>
      {["File", "Edit", "View", "Go", "Window", "Help"].map((m) => (
        <span key={m} className="hidden cursor-default rounded px-2 py-0.5 hover:bg-white/10 md:inline">
          {m}
        </span>
      ))}
      <div className="flex-1" />
      {/* status area — even rhythm, uniform glyph grid */}
      <div className="flex items-center gap-1">
        <span className="grid h-6 w-7 place-items-center rounded hover:bg-white/10"><BatteryGlyph /></span>
        <span className="grid h-6 w-7 place-items-center rounded hover:bg-white/10"><WifiGlyph /></span>
        <span className="grid h-6 w-7 place-items-center rounded hover:bg-white/10"><SearchGlyph /></span>
        <span className="grid h-6 w-7 place-items-center rounded hover:bg-white/10"><ControlCenterGlyph /></span>
      </div>
      <span className="ml-2 hidden whitespace-nowrap sm:inline">{fmtDate.format(now)}</span>
      <span className="ml-2 whitespace-nowrap tabular-nums">{fmtTime.format(now)}</span>
    </div>
  );
}
