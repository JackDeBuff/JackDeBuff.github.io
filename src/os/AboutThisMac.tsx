import { useEffect } from "react";
import { PoopLogo } from "../icons/AppIcons";
import { useWindows } from "../state/windows";

/* About This Mac — a centered glass panel opened from the poop system menu.
   Modeled on the macOS Tahoe "About This Mac" window (never Apple assets: the
   product mark is Jack's poop logo, the specs are fun-but-believable). */

const SPECS: { label: string; value: string }[] = [
  { label: "Chip", value: "Jack M∞ (Imagination Engine)" },
  { label: "Memory", value: "∞ GB unified imagination" },
  { label: "Startup Disk", value: "Poop HD" },
  { label: "Serial number", value: "JACK-2026-DEBUFF" },
  { label: "macOS", value: "jackOS 26 Tahoe — Portfolio Edition" },
];

export default function AboutThisMac({ onClose }: { onClose: () => void }) {
  const { openWindow } = useWindows();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fade-in fixed inset-0 z-[8000] grid place-items-center"
      style={{ background: "rgba(0,0,0,0.18)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="menu-in glass-menu w-[350px] overflow-hidden text-zinc-800 dark:text-zinc-100"
        style={{ borderRadius: "var(--radius-window)" }}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-2 px-3.5 pt-3.5">
          <button
            onClick={onClose}
            aria-label="Close"
            className="group grid h-3 w-3 place-items-center rounded-full bg-[#FF5F57]"
          >
            <svg viewBox="0 0 12 12" className="h-2 w-2 opacity-0 group-hover:opacity-100">
              <path d="M3.5 3.5 8.5 8.5 M8.5 3.5 3.5 8.5" stroke="#5c0400" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
          <span className="h-3 w-3 rounded-full bg-[#FDBC40]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>

        {/* Product mark — poop logo on a soft radial glow */}
        <div className="flex justify-center pb-1 pt-4">
          <div
            className="grid h-24 w-24 place-items-center rounded-full"
            style={{ background: "radial-gradient(circle at 50% 38%, rgba(180,120,60,0.28), rgba(120,72,32,0.05) 70%)" }}
          >
            <PoopLogo className="h-16 w-16 text-amber-700 dark:text-amber-500" />
          </div>
        </div>

        {/* Model name */}
        <div className="pb-4 text-center">
          <div className="text-[17px] font-bold leading-tight">MacBook Pro</div>
          <div className="mt-0.5 text-[12px] text-zinc-500 dark:text-zinc-400">14-inch, 2026</div>
        </div>

        {/* Spec rows */}
        <div className="mx-4 mb-3 overflow-hidden rounded-[10px] ring-1 ring-black/10 dark:ring-white/10">
          {SPECS.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between gap-3 px-3.5 py-2 text-[12px] ${
                i % 2 === 0 ? "bg-black/[0.03] dark:bg-white/[0.04]" : "bg-white/50 dark:bg-white/[0.02]"
              } ${i < SPECS.length - 1 ? "border-b border-black/[0.06] dark:border-white/[0.06]" : ""}`}
            >
              <span className="shrink-0 text-zinc-500 dark:text-zinc-400">{row.label}</span>
              <span className="text-right font-medium text-zinc-800 dark:text-zinc-100">{row.value}</span>
            </div>
          ))}
        </div>

        {/* More Info */}
        <div className="flex justify-center pb-3.5">
          <button
            onClick={() => {
              openWindow("settings");
              onClose();
            }}
            className="rounded-[7px] bg-black/[0.06] px-4 py-1.5 text-[12px] font-medium text-zinc-800 ring-1 ring-black/10 transition hover:bg-black/[0.1] dark:bg-white/10 dark:text-zinc-100 dark:ring-white/10 dark:hover:bg-white/[0.16]"
          >
            More Info…
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 text-center text-[10px] leading-relaxed text-zinc-400 dark:text-zinc-500">
          Regulatory-free. Vibes-certified. © 2026 Jack DeBuff.
        </div>
      </div>
    </div>
  );
}
