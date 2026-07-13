import { useEffect, useState } from "react";

/** Coarse 10s clock — matches the MenuBar cadence; the status bar only shows minutes. */
function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

const fmtTime = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: false });
/** iOS status bar shows no AM/PM. */
const clockText = (now: Date) => fmtTime.format(now);

/* Tiny iOS-scale status glyphs, all matched to ~11px height, using currentColor
   so they adapt to the status bar's text color in light/dark. */
function SignalGlyph() {
  return (
    <svg viewBox="0 0 18 12" className="h-[11px] w-[17px]" fill="currentColor" aria-label="cellular">
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" />
      <rect x="15" y="0" width="3" height="12" rx="1" />
    </svg>
  );
}

function WifiGlyph() {
  return (
    <svg viewBox="0 0 16 13" className="h-[11px] w-[14px]" fill="currentColor" aria-label="wifi">
      <path d="M8 2.4c2.6 0 5 1 6.8 2.7a.6.6 0 0 0 .85-.85A11 11 0 0 0 8 1 11 11 0 0 0 .35 4.25a.6.6 0 0 0 .85.85A9.4 9.4 0 0 1 8 2.4Z" />
      <path d="M8 5.7c1.7 0 3.3.65 4.5 1.8a.6.6 0 0 0 .85-.85A7.7 7.7 0 0 0 8 4.4a7.7 7.7 0 0 0-5.35 2.25.6.6 0 0 0 .85.85A6.3 6.3 0 0 1 8 5.7Z" />
      <path d="M8 9c.85 0 1.65.32 2.25.9a.6.6 0 0 0 .85-.85A4.3 4.3 0 0 0 8 7.7a4.3 4.3 0 0 0-3.1 1.35.6.6 0 0 0 .85.85A3 3 0 0 1 8 9Z" />
      <circle cx="8" cy="11.4" r="1.15" />
    </svg>
  );
}

function BatteryGlyph() {
  return (
    <svg viewBox="0 0 28 13" className="h-[12px] w-[26px]" aria-label="battery">
      <rect x="0.75" y="0.75" width="22.5" height="11.5" rx="3.4" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
      <rect x="2.25" y="2.25" width="16.5" height="8.5" rx="1.8" fill="currentColor" />
      <path d="M25.4 4.3v4.4c1.35-.4 2-1.15 2-2.2s-.65-1.8-2-2.2Z" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

/** Small padlock — the only way to return to the Lock Screen on mobile. */
function LockGlyph() {
  return (
    <svg viewBox="0 0 14 16" className="h-[13px] w-[12px]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <rect x="1.6" y="6.6" width="10.8" height="8" rx="2" fill="currentColor" stroke="none" />
      <path d="M3.8 6.6V4.6a3.2 3.2 0 0 1 6.4 0v2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * iOS-style status bar. `overContent` flips the palette: over the wallpaper
 * (home) it is white with a shadow so it reads on any wallpaper; over an open
 * app sheet it matches the sheet's opaque surface (dark text in light mode,
 * white in dark mode). `darkSurface` overrides that to always-white for sheets
 * that render a near-black surface (Music/Terminal) regardless of appearance.
 */
export default function MobileStatusBar({
  onLock,
  overContent = false,
  darkSurface = false,
}: {
  onLock: () => void;
  overContent?: boolean;
  darkSurface?: boolean;
}) {
  const now = useClock();

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-between px-7 ${
        darkSurface
          ? "text-white"
          : overContent
          ? "text-zinc-900 dark:text-white"
          : "text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.45)]"
      }`}
      style={{ height: "calc(env(safe-area-inset-top) + 44px)", paddingTop: "env(safe-area-inset-top)" }}
    >
      <span className="text-[15px] font-semibold tabular-nums">{clockText(now)}</span>
      <div className="pointer-events-auto flex items-center gap-1.5">
        <SignalGlyph />
        <WifiGlyph />
        <BatteryGlyph />
        <button
          onClick={onLock}
          aria-label="Lock screen"
          className="ml-1 grid h-6 w-5 place-items-center opacity-90 active:opacity-60"
        >
          <LockGlyph />
        </button>
      </div>
    </div>
  );
}
