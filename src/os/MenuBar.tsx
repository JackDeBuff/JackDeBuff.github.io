import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { PoopLogo } from "../icons/AppIcons";
import { useWindows } from "../state/windows";
import { useSettings } from "../state/settings";
import { apps } from "../apps/apps.config";

const REPO_URL = "https://github.com/JackDeBuff/JackDeBuff.github.io";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

const fmtDate = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
const fmtTime = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: false });

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
      {/* fill width = 67% of the 18.5px interior — keep in sync with the Battery popover % */}
      <rect x="2.5" y="2.5" width="12.4" height="9" rx="2" fill="currentColor" />
      <path d="M25.5 4.6 v4.8 c1.5 -0.45 2.2 -1.3 2.2 -2.4 s-0.7 -1.95 -2.2 -2.4Z" fill="currentColor" fillOpacity="0.55" />
    </svg>
  );
}

function MoonGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-[15px] w-[15px]" fill="currentColor" aria-label="appearance">
      <path d="M9.2 1.6 a6.6 6.6 0 1 0 5.2 9.7 a5.4 5.4 0 0 1 -5.2 -9.7Z" />
    </svg>
  );
}

function SunGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-[13px] w-[13px]" fill="none" stroke="currentColor" strokeLinecap="round" aria-label="brightness">
      <circle cx="8" cy="8" r="3" strokeWidth="1.4" />
      <path d="M8 1.4 v1.8 M8 12.8 v1.8 M1.4 8 h1.8 M12.8 8 h1.8 M3.3 3.3 l1.3 1.3 M11.4 11.4 l1.3 1.3 M12.7 3.3 l-1.3 1.3 M4.6 11.4 l-1.3 1.3" strokeWidth="1.4" />
    </svg>
  );
}

/* ── Dropdown menu primitives (shared glass recipe with the poop menu) ────── */

type MenuItemDef =
  | "sep"
  | {
      label: string;
      action?: () => void;
      disabled?: boolean;
      checked?: boolean;
      shortcut?: string;
    };

function MenuList({
  items,
  onDone,
  width = "w-56",
  right = false,
}: {
  items: MenuItemDef[];
  onDone: () => void;
  width?: string;
  right?: boolean;
}) {
  return (
    <div className={`menu-in glass-menu absolute top-8 ${right ? "right-0" : "left-0"} ${width} rounded-[var(--radius-menu)] p-1`}>
      {items.map((it, i) =>
        it === "sep" ? (
          <div key={i} className="mx-2 my-1 h-px bg-black/10 dark:bg-white/15" />
        ) : (
          <button
            key={i}
            disabled={it.disabled}
            onClick={() => {
              it.action?.();
              onDone();
            }}
            className="flex w-full items-center rounded-md px-2 py-1 text-left text-[13px] text-zinc-800 enabled:hover:bg-blue-500 enabled:hover:text-white disabled:text-zinc-400 dark:text-zinc-100 dark:disabled:text-zinc-500"
          >
            <span className="w-4 shrink-0 text-[11px]">{it.checked ? "✓" : ""}</span>
            <span className="flex-1 truncate">{it.label}</span>
            {it.shortcut && <span className="ml-4 shrink-0 text-[12px] tracking-wide opacity-50">{it.shortcut}</span>}
          </button>
        ),
      )}
    </div>
  );
}

/* ── Menu bar ─────────────────────────────────────────────────────────────── */

const WIFI_NETWORKS = ["DukeBlue", "eduroam", "KBTG-Secure", "MWIT-Hall-of-Fame", "ChulaWiFi"];

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
  const { windows, activeId, openWindow, closeWindow, minimizeWindow, toggleMaximize, focusWindow } = useWindows();
  const { appearance, setAppearance } = useSettings();
  const [open, setOpen] = useState<string | null>(null);
  const [wifiOn, setWifiOn] = useState(true);
  const [wifiNet, setWifiNet] = useState(WIFI_NETWORKS[0]);
  const [brightness, setBrightness] = useState(100);
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Esc; ⌘K summons Spotlight from anywhere
  useEffect(() => {
    const down = (e: MouseEvent) => {
      if (open && !barRef.current?.contains(e.target as Node)) setOpen(null);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => (v === "spotlight" ? null : "spotlight"));
      }
    };
    window.addEventListener("mousedown", down);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("mousedown", down);
      window.removeEventListener("keydown", key);
    };
  }, [open]);

  useEffect(() => {
    if (open !== "spotlight") {
      setQuery("");
      setSel(0);
    }
  }, [open]);

  const activeApp = apps.find((a) => a.id === activeId);
  const appName = activeApp?.title ?? "Finder";
  const activeWin = activeId ? windows[activeId] : undefined;
  const hasActive = !!activeWin?.open;
  const openApps = apps.filter((a) => a.component && windows[a.id]?.open);

  const toggle = (id: string) => setOpen((v) => (v === id ? null : id));
  // Real macOS: once a menu is open, hovering a SIBLING title switches to it —
  // but only within the same group (menus ↔ menus, status ↔ status), and never
  // to/from Spotlight (it's a click-only action, not a dropdown).
  const MENU_GROUP = ["poop", "app", "file", "edit", "view", "go", "window", "help"];
  const STATUS_GROUP = ["battery", "wifi", "control"];
  const hoverSwitch = (id: string) => {
    if (!open || open === id) return;
    const sameGroup =
      (MENU_GROUP.includes(open) && MENU_GROUP.includes(id)) ||
      (STATUS_GROUP.includes(open) && STATUS_GROUP.includes(id));
    if (sameGroup) setOpen(id);
  };

  const titleBtn = (id: string, label: ReactNode, extra = "") => (
    <button
      className={`rounded px-2 py-0.5 ${open === id ? "bg-white/20" : "hover:bg-white/10"} ${extra}`}
      onClick={() => toggle(id)}
      onMouseEnter={() => hoverSwitch(id)}
    >
      {label}
    </button>
  );

  const statusBtn = (id: string, glyph: ReactNode, label: string) => (
    <button
      aria-label={label}
      className={`grid h-6 w-7 place-items-center rounded ${open === id ? "bg-white/20" : "hover:bg-white/10"}`}
      onClick={() => toggle(id)}
      onMouseEnter={() => hoverSwitch(id)}
    >
      {glyph}
    </button>
  );

  /* Menu definitions */
  const poopItems: MenuItemDef[] = [
    { label: "About This Mac", action: onAboutMac },
    "sep",
    { label: "System Settings…", action: () => openWindow("settings") },
    "sep",
    { label: "Sleep", action: onLock },
    { label: "Restart…", action: onRestart },
    { label: "Shut Down…", action: onRestart },
    "sep",
    { label: "Lock Screen", action: onLock, shortcut: "⌃⌘Q" },
    { label: "Log Out Jack…", action: onLock, shortcut: "⇧⌘Q" },
  ];

  const appItems: MenuItemDef[] = [
    { label: `About ${appName}`, action: () => openWindow("about") },
    "sep",
    { label: "Settings…", action: () => openWindow("settings"), shortcut: "⌘," },
    "sep",
    { label: `Hide ${appName}`, action: () => activeId && minimizeWindow(activeId), disabled: !hasActive, shortcut: "⌘H" },
    { label: `Quit ${appName}`, action: () => activeId && closeWindow(activeId), disabled: !hasActive, shortcut: "⌘Q" },
  ];

  const fileItems: MenuItemDef[] = [
    { label: "New Window", action: () => activeId && openWindow(activeId), disabled: !hasActive, shortcut: "⌘N" },
    { label: "Close Window", action: () => activeId && closeWindow(activeId), disabled: !hasActive, shortcut: "⌘W" },
    "sep",
    { label: "Move to Trash", action: () => openWindow("trash"), shortcut: "⌘⌫" },
  ];

  const editItems: MenuItemDef[] = [
    { label: "Undo", disabled: true, shortcut: "⌘Z" },
    { label: "Redo", disabled: true, shortcut: "⇧⌘Z" },
    "sep",
    { label: "Cut", disabled: true, shortcut: "⌘X" },
    { label: "Copy", disabled: true, shortcut: "⌘C" },
    { label: "Paste", disabled: true, shortcut: "⌘V" },
    { label: "Select All", disabled: true, shortcut: "⌘A" },
  ];

  const viewItems: MenuItemDef[] = [
    {
      label: activeWin?.maximized ? "Exit Full Screen" : "Enter Full Screen",
      action: () => activeId && toggleMaximize(activeId),
      disabled: !hasActive,
      shortcut: "⌃⌘F",
    },
    "sep",
    { label: "Show Toolbar", disabled: true },
    { label: "Show Path Bar", disabled: true },
  ];

  const goItems: MenuItemDef[] = [
    ...apps
      .filter((a) => a.component)
      .map((a) => ({ label: a.title, action: () => openWindow(a.id) })),
    "sep" as const,
    ...apps
      .filter((a) => a.external)
      .map((a) => ({ label: `${a.title} ↗`, action: () => window.open(a.external, "_blank", "noopener") })),
  ];

  const windowItems: MenuItemDef[] = [
    { label: "Minimize", action: () => activeId && minimizeWindow(activeId), disabled: !hasActive, shortcut: "⌘M" },
    { label: "Zoom", action: () => activeId && toggleMaximize(activeId), disabled: !hasActive },
    "sep",
    { label: "Bring All to Front", action: () => activeId && focusWindow(activeId), disabled: openApps.length === 0 },
    ...(openApps.length > 0
      ? [
          "sep" as const,
          ...openApps.map((a) => ({ label: a.title, checked: a.id === activeId, action: () => openWindow(a.id) })),
        ]
      : []),
  ];

  const helpItems: MenuItemDef[] = [
    { label: "jackOS Help", action: () => openWindow("about"), shortcut: "⌘?" },
    { label: "Terminal Commands", action: () => openWindow("terminal") },
    "sep",
    { label: "View Source on GitHub ↗", action: () => window.open(REPO_URL, "_blank", "noopener") },
  ];

  /* Spotlight */
  const results = query.trim()
    ? apps.filter((a) => a.title.toLowerCase().includes(query.trim().toLowerCase()))
    : [];
  const openResult = (a: (typeof apps)[number]) => {
    if (a.external) window.open(a.external, "_blank", "noopener");
    else openWindow(a.id);
    setOpen(null);
  };

  const pct = ((brightness - 30) / 70) * 100;

  return (
    <div
      ref={barRef}
      className="relative z-[9000] flex h-7 items-center px-3 text-[13px] font-medium text-white/95 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]"
    >
      {/* Display-brightness dim layer (Control Center) — below the bar's own UI */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-black transition-opacity duration-150"
        style={{ opacity: (100 - brightness) / 160 }}
      />

      <div className="relative">
        {titleBtn("poop", <PoopLogo className="h-4 w-4" />)}
        {open === "poop" && <MenuList items={poopItems} onDone={() => setOpen(null)} />}
      </div>

      <div className="relative">
        {titleBtn("app", <span className="block max-w-36 truncate font-bold">{appName}</span>)}
        {open === "app" && <MenuList items={appItems} onDone={() => setOpen(null)} />}
      </div>

      {(
        [
          ["file", "File", fileItems],
          ["edit", "Edit", editItems],
          ["view", "View", viewItems],
          ["go", "Go", goItems],
          ["window", "Window", windowItems],
          ["help", "Help", helpItems],
        ] as [string, string, MenuItemDef[]][]
      ).map(([id, label, items]) => (
        <div key={id} className="relative hidden md:block">
          {titleBtn(id, label)}
          {open === id && <MenuList items={items} onDone={() => setOpen(null)} />}
        </div>
      ))}

      <div className="flex-1" />

      {/* status area — even rhythm, uniform glyph grid */}
      <div className="flex items-center gap-1">
        <div className="relative">
          {statusBtn("battery", <BatteryGlyph />, "Battery")}
          {open === "battery" && (
            <div className="menu-in glass-menu absolute right-0 top-8 w-60 rounded-[var(--radius-menu)] p-1 text-zinc-800 dark:text-zinc-100">
              <div className="flex items-baseline justify-between px-3 pb-0.5 pt-1.5 text-[13px] font-semibold">
                Battery
                <span className="font-normal text-zinc-500 dark:text-zinc-400">67%</span>
              </div>
              <div className="px-3 pb-1.5 text-[12px] text-zinc-500 dark:text-zinc-400">Power Source: Battery</div>
              <div className="mx-2 my-1 h-px bg-black/10 dark:bg-white/15" />
              <div className="px-3 py-1 text-[11px] leading-snug text-zinc-400 dark:text-zinc-500">
                Health: better than Jack's sleep schedule
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          {statusBtn("wifi", <WifiGlyph />, "Wi-Fi")}
          {open === "wifi" && (
            <div className="menu-in glass-menu absolute right-0 top-8 w-64 rounded-[var(--radius-menu)] p-1 text-zinc-800 dark:text-zinc-100">
              <div className="flex items-center justify-between px-3 py-1.5">
                <span className="text-[13px] font-semibold">Wi-Fi</span>
                <button
                  aria-label="Toggle Wi-Fi"
                  onClick={() => setWifiOn((v) => !v)}
                  className={`relative h-[18px] w-8 rounded-full transition-colors ${wifiOn ? "bg-blue-500" : "bg-zinc-400/60"}`}
                >
                  <span
                    className={`absolute left-0 top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow transition-transform ${
                      wifiOn ? "translate-x-[16px]" : "translate-x-[2px]"
                    }`}
                  />
                </button>
              </div>
              <div className="mx-2 my-1 h-px bg-black/10 dark:bg-white/15" />
              <div className="px-3 pb-0.5 pt-1 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Known Networks</div>
              {WIFI_NETWORKS.map((n) => (
                <button
                  key={n}
                  disabled={!wifiOn}
                  onClick={() => setWifiNet(n)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] enabled:hover:bg-blue-500 enabled:hover:text-white disabled:text-zinc-400 dark:disabled:text-zinc-500"
                >
                  <span className="w-4 shrink-0 text-[11px]">{wifiOn && n === wifiNet ? "✓" : ""}</span>
                  <WifiGlyph />
                  <span className="truncate">{n}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          {statusBtn("spotlight", <SearchGlyph />, "Spotlight")}
        </div>

        <div className="relative">
          {statusBtn("control", <ControlCenterGlyph />, "Control Center")}
          {open === "control" && (
            <div className="menu-in glass-menu absolute right-0 top-8 w-[300px] rounded-2xl p-2.5 text-zinc-800 dark:text-zinc-100">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setWifiOn((v) => !v)}
                  className="flex items-center gap-2.5 rounded-xl bg-white/45 p-2.5 text-left ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10"
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors ${
                      wifiOn ? "bg-blue-500 text-white" : "bg-zinc-400/40 text-zinc-600 dark:bg-white/15 dark:text-zinc-300"
                    }`}
                  >
                    <WifiGlyph />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12px] font-semibold leading-tight">Wi-Fi</span>
                    <span className="block truncate text-[11px] text-zinc-500 dark:text-zinc-400">{wifiOn ? wifiNet : "Off"}</span>
                  </span>
                </button>
                <button
                  onClick={() => setAppearance(appearance === "dark" ? "light" : "dark")}
                  className="flex items-center gap-2.5 rounded-xl bg-white/45 p-2.5 text-left ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10"
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors ${
                      appearance === "dark" ? "bg-indigo-500 text-white" : "bg-zinc-400/40 text-zinc-600"
                    }`}
                  >
                    <MoonGlyph />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12px] font-semibold leading-tight">Appearance</span>
                    <span className="block text-[11px] text-zinc-500 dark:text-zinc-400">{appearance === "dark" ? "Dark" : "Light"}</span>
                  </span>
                </button>
              </div>
              <div className="mt-2.5 rounded-xl bg-white/45 p-2.5 ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10">
                <div className="mb-1.5 text-[12px] font-semibold">Display</div>
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <SunGlyph />
                  <input
                    type="range"
                    min={30}
                    max={100}
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    aria-label="Display brightness"
                    className="cc-slider"
                    style={{
                      background: `linear-gradient(to right, rgba(255,255,255,0.95) ${pct}%, rgba(120,120,128,0.3) ${pct}%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <span className="ml-2 hidden whitespace-nowrap sm:inline">{fmtDate.format(now)}</span>
      <span className="ml-2 whitespace-nowrap tabular-nums">{fmtTime.format(now)}</span>

      {/* Spotlight — centered glass search over everything */}
      {open === "spotlight" && (
        <div className="fixed inset-0 z-[9500]" onMouseDown={() => setOpen(null)}>
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="menu-in glass-menu mx-auto mt-[18vh] w-[560px] max-w-[92vw] rounded-2xl p-2 text-zinc-800 dark:text-zinc-100"
          >
            <div className="flex items-center gap-2.5 px-2">
              <svg viewBox="0 0 16 16" className="h-5 w-5 shrink-0 text-zinc-400" fill="none" stroke="currentColor" strokeLinecap="round">
                <circle cx="7" cy="7" r="4.6" strokeWidth="1.6" />
                <path d="M10.6 10.6 L14 14" strokeWidth="1.6" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSel(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSel((s) => Math.min(s + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSel((s) => Math.max(s - 1, 0));
                  } else if (e.key === "Enter" && results[sel]) {
                    openResult(results[sel]);
                  }
                }}
                placeholder="Spotlight Search"
                className="w-full bg-transparent py-1.5 text-[19px] font-normal outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </div>
            {query.trim() && (
              <div className="mt-1.5 border-t border-black/10 pt-1.5 dark:border-white/10">
                {results.length === 0 ? (
                  <div className="px-3 py-2 text-[13px] text-zinc-400 dark:text-zinc-500">No Results</div>
                ) : (
                  results.map((a, i) => (
                    <button
                      key={a.id}
                      onClick={() => openResult(a)}
                      onMouseEnter={() => setSel(i)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] ${
                        i === sel ? "bg-blue-500 text-white" : ""
                      }`}
                    >
                      <span className="h-6 w-6 shrink-0">{a.icon}</span>
                      <span className="flex-1 truncate">{a.title}</span>
                      <span className={`text-[11px] ${i === sel ? "text-white/70" : "text-zinc-400 dark:text-zinc-500"}`}>
                        {a.external ? "Link" : "Application"}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
