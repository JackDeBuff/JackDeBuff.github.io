import { useWindows } from "../state/windows";
import { LineupIcon } from "../icons/AppIcons";

/* ────────────────────────────────────────────────────────────────────────────
   Desktop widgets — fake-but-alive macOS Tahoe widgets pinned top-left, below
   the window layer (like the real thing). All static data except the clock:
   the calendar reads today's date and the weather generates the next 6 hour
   labels from the visitor's clock. No APIs, no deps.
   ──────────────────────────────────────────────────────────────────────────── */

const fmtWeekday = new Intl.DateTimeFormat("en-US", { weekday: "long" });

/* Real liquid glass (adapts light/dark via .light overrides in index.css);
   only Weather keeps an opaque iOS-blue card look */
const GLASS = "liquid-glass rounded-[22px] text-zinc-800 dark:text-zinc-100";

/* Tiny circular flags — SVG so they render everywhere (England's emoji flag doesn't) */
function Flag({ code }: { code: "FRA" | "ENG" | "ESP" | "ARG" }) {
  return (
    <svg viewBox="0 0 36 36" className="h-9 w-9">
      <defs>
        <clipPath id={`flag-${code}`}>
          <circle cx="18" cy="18" r="17" />
        </clipPath>
      </defs>
      <g clipPath={`url(#flag-${code})`}>
        {code === "FRA" && (
          <>
            <rect width="12" height="36" fill="#26499d" />
            <rect x="12" width="12" height="36" fill="#fff" />
            <rect x="24" width="12" height="36" fill="#d8262c" />
          </>
        )}
        {code === "ENG" && (
          <>
            <rect width="36" height="36" fill="#fff" />
            <rect x="15" width="6" height="36" fill="#d8262c" />
            <rect y="15" width="36" height="6" fill="#d8262c" />
          </>
        )}
        {code === "ESP" && (
          <>
            <rect width="36" height="36" fill="#c60b1e" />
            <rect y="10" width="36" height="16" fill="#ffc400" />
          </>
        )}
        {code === "ARG" && (
          <>
            <rect width="36" height="36" fill="#74acdf" />
            <rect y="12" width="36" height="12" fill="#fff" />
            <circle cx="18" cy="18" r="3.2" fill="#f6b40e" />
          </>
        )}
      </g>
      <circle cx="18" cy="18" r="17" fill="none" strokeWidth="1.2" className="stroke-black/10 dark:stroke-white/25" />
    </svg>
  );
}

const MATCHES: { home: "FRA" | "ENG" | "ESP" | "ARG"; away: "FRA" | "ENG" | "ESP" | "ARG"; when: string }[] = [
  { home: "FRA", away: "ENG", when: "Sun 04:00" },
  { home: "ESP", away: "ARG", when: "Mon 02:00" },
];

/* iOS-style battery ring */
function Ring({ pct, char, tint }: { pct: number; char: string; tint: string }) {
  const r = 15.5;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative h-12 w-12">
        <svg viewBox="0 0 40 40" className="h-12 w-12 -rotate-90">
          <circle cx="20" cy="20" r={r} fill="none" strokeWidth="4" className="stroke-black/10 dark:stroke-white/15" />
          <circle
            cx="20"
            cy="20"
            r={r}
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            stroke={tint}
            strokeDasharray={`${(pct / 100) * c} ${c}`}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-[15px]">{char}</span>
      </div>
      <span className="text-[11px] font-semibold tabular-nums">{pct}%</span>
    </div>
  );
}

/* 67% matches the menu-bar battery — keep them in sync */
const DEVICES: { pct: number; char: string; tint: string }[] = [
  { pct: 67, char: "💻", tint: "#32d74b" },
  { pct: 100, char: "🎧", tint: "#32d74b" },
  { pct: 54, char: "🎮", tint: "#ff9f0a" },
  { pct: 100, char: "🐱", tint: "#eab676" }, // Salmon: fully charged
];

const EVENTS: { time: string; label: string; color: string }[] = [
  { time: "10:30", label: "Gym (for real this time)", color: "bg-orange-400" },
  { time: "16:00", label: "Badminton", color: "bg-green-500" },
  { time: "19:30", label: "Board games & cards", color: "bg-sky-500" },
];

const HOURLY_ICONS = ["🌤️", "⛅", "☁️", "☁️", "🌥️", "⛅"];
const HOURLY_TEMPS = [30, 29, 28, 27, 26, 26];

export default function Widgets() {
  const { openWindow } = useWindows();
  const now = new Date();

  return (
    <div className="absolute left-5 top-11 hidden w-[368px] grid-cols-2 gap-4 lg:grid" aria-label="Desktop widgets">
      {/* FootMob — Following (opens the app) */}
      <button onClick={() => openWindow("lineup")} className={`${GLASS} p-3 text-left`} aria-label="FootMob widget">
        <div className="flex items-center justify-between px-1">
          <span className="flex items-center gap-1.5 text-[13px] font-bold">
            <span aria-hidden>★</span> Following
          </span>
          <span className="h-5 w-5">
            <LineupIcon />
          </span>
        </div>
        {MATCHES.map((m, i) => (
          <div key={m.when} className={`flex items-center justify-between px-1 py-2.5 ${i > 0 ? "border-t border-black/10 dark:border-white/10" : "mt-1"}`}>
            <div className="flex flex-col items-center gap-0.5">
              <Flag code={m.home} />
              <span className="text-[10px] font-bold">{m.home}</span>
            </div>
            <div className="text-center">
              <div className="text-[9px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">World Cup</div>
              <div className="text-[12px] font-semibold">{m.when}</div>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Flag code={m.away} />
              <span className="text-[10px] font-bold">{m.away}</span>
            </div>
          </div>
        ))}
      </button>

      {/* Batteries */}
      <div className={`${GLASS} grid grid-cols-2 place-items-center gap-1 p-3`}>
        {DEVICES.map((d) => (
          <Ring key={d.char} {...d} />
        ))}
      </div>

      {/* Weather — Durham, NC (Jack's side of the world) */}
      <div className="col-span-2 rounded-[22px] bg-gradient-to-b from-[#66abdd]/95 to-[#4a80bd]/95 p-4 text-white shadow-lg ring-1 ring-white/20 backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1 text-[13px] font-semibold">Durham, NC <span aria-hidden>➤</span></div>
            <div className="text-[34px] font-light leading-tight">31°</div>
          </div>
          <div className="text-right">
            <div className="text-[22px] leading-none" aria-hidden>⛅</div>
            <div className="mt-1 text-[12px]">Partly Cloudy</div>
            <div className="text-[12px] text-white/70">H:33° L:22°</div>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          {HOURLY_TEMPS.map((t, i) => {
            const h = (now.getHours() + i + 1) % 24;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="text-[11px] text-white/70">{String(h).padStart(2, "0")}</span>
                <span className="text-[13px]" aria-hidden>{HOURLY_ICONS[i]}</span>
                <span className="text-[12px] font-semibold">{t}°</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar — live date, fun fake schedule */}
      <div className={`${GLASS} col-span-2 flex gap-4 p-4`}>
        <div className="w-24 shrink-0">
          <div className="text-[12px] font-bold uppercase tracking-wide text-red-500">{fmtWeekday.format(now)}</div>
          <div className="text-[38px] font-semibold leading-tight">{now.getDate()}</div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
          {EVENTS.map((e) => (
            <div key={e.time} className="flex items-center gap-2">
              <span className={`h-8 w-1 shrink-0 rounded-full ${e.color}`} />
              <div className="min-w-0">
                <div className="truncate text-[12px] font-semibold leading-tight">{e.label}</div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{e.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
