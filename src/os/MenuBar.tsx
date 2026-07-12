import { useEffect, useRef, useState } from "react";
import { AppleLogo } from "../icons/AppIcons";
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

export default function MenuBar({ onLock, onRestart }: { onLock: () => void; onRestart: () => void }) {
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
      className="block w-full rounded-md px-3 py-1 text-left text-[13px] text-zinc-100 enabled:hover:bg-blue-500 enabled:hover:text-white disabled:text-zinc-500"
    >
      {label}
    </button>
  );

  return (
    <div className="relative z-[9000] flex h-7 items-center gap-1 px-3 text-[13px] font-medium text-white/95 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
      <div ref={menuRef} className="relative">
        <button
          className={`rounded px-2 py-0.5 ${appleOpen ? "bg-white/20" : "hover:bg-white/10"}`}
          onClick={() => setAppleOpen((v) => !v)}
        >
          <AppleLogo className="h-4 w-4" />
        </button>
        {appleOpen && (
          <div className="menu-in glass absolute left-0 top-8 w-56 rounded-xl p-1">
            {item("About This Mac", () => openWindow("about"))}
            <div className="mx-2 my-1 h-px bg-white/15" />
            {item("System Settings…", () => openWindow("settings"))}
            <div className="mx-2 my-1 h-px bg-white/15" />
            {item("Lock Screen", onLock)}
            {item("Restart…", onRestart)}
            {item("Shut Down…", onRestart)}
          </div>
        )}
      </div>
      <span className="px-2 font-bold">{appName}</span>
      {["File", "Edit", "View", "Go", "Window", "Help"].map((m) => (
        <span key={m} className="hidden cursor-default rounded px-2 py-0.5 hover:bg-white/10 md:inline">
          {m}
        </span>
      ))}
      <div className="flex-1" />
      {/* status glyphs */}
      <svg viewBox="0 0 24 24" className="mx-1 h-4 w-4" fill="currentColor" aria-label="wifi">
        <path d="M12 18.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Zm0-5.2c-2.1 0-4 .8-5.4 2.2l1.8 1.8a5.2 5.2 0 0 1 7.2 0l1.8-1.8A7.6 7.6 0 0 0 12 13.3Zm0-5.1c-3.5 0-6.7 1.4-9 3.6l1.8 1.8A10.2 10.2 0 0 1 12 10.7c2.8 0 5.4 1.1 7.2 2.9l1.8-1.8a12.7 12.7 0 0 0-9-3.6Z" />
      </svg>
      <svg viewBox="0 0 30 14" className="mx-1 h-3.5 w-8" aria-label="battery">
        <rect x="0.5" y="0.5" width="25" height="13" rx="3.5" fill="none" stroke="currentColor" strokeOpacity="0.6" />
        <rect x="2" y="2" width="19" height="10" rx="2" fill="currentColor" />
        <path d="M27.5 4.5v5c1.4-.4 2.2-1.3 2.2-2.5s-.8-2.1-2.2-2.5Z" fill="currentColor" fillOpacity="0.6" />
      </svg>
      <span className="ml-1">{fmtDate.format(now)}</span>
      <span className="ml-2 tabular-nums">{fmtTime.format(now)}</span>
    </div>
  );
}
