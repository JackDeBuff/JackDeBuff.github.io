import { useState } from "react";
import { useSettings, WALLPAPERS, wallpaperUrl, type Appearance } from "../state/settings";
import { profile } from "../data/profile";

const PANES = ["Appearance", "Wallpaper", "About"] as const;
type Pane = (typeof PANES)[number];

const PANE_ICONS: Record<Pane, string> = { Appearance: "🌗", Wallpaper: "🖼️", About: "💻" };

export default function Settings() {
  const [pane, setPane] = useState<Pane>("Wallpaper");
  const { wallpaper, appearance, setWallpaper, setAppearance } = useSettings();

  return (
    <div className="flex h-full bg-zinc-100/95 text-zinc-900 dark:bg-zinc-900/95 dark:text-zinc-100">
      <aside className="glass-thin w-52 shrink-0 space-y-0.5 overflow-y-auto p-2">
        {PANES.map((p) => (
          <button
            key={p}
            onClick={() => setPane(p)}
            className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium ${
              pane === p
                ? "bg-blue-500 text-white"
                : "text-zinc-700 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10"
            }`}
          >
            <span>{PANE_ICONS[p]}</span>
            {p}
          </button>
        ))}
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto p-6">
        {pane === "Appearance" && (
          <div>
            <h1 className="mb-4 text-lg font-bold">Appearance</h1>
            <div className="flex gap-4">
              {(["dark", "light"] as Appearance[]).map((a) => (
                <button
                  key={a}
                  onClick={() => setAppearance(a)}
                  className={`overflow-hidden rounded-2xl ring-2 transition ${
                    appearance === a
                      ? "ring-blue-500"
                      : "ring-black/10 hover:ring-black/30 dark:ring-white/10 dark:hover:ring-white/30"
                  }`}
                >
                  <div
                    className={`flex h-24 w-40 items-end p-2 ${
                      a === "dark" ? "bg-gradient-to-b from-zinc-700 to-zinc-900" : "bg-gradient-to-b from-sky-100 to-zinc-200"
                    }`}
                  >
                    <div
                      className={`h-8 w-24 rounded-lg ${a === "dark" ? "bg-zinc-800 ring-1 ring-white/20" : "bg-white ring-1 ring-black/10"}`}
                    />
                  </div>
                  <div className="bg-black/10 py-1.5 text-center text-xs font-medium capitalize dark:bg-black/30">{a}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {pane === "Wallpaper" && (
          <div>
            <h1 className="mb-4 text-lg font-bold">Wallpaper</h1>
            <div className="grid grid-cols-3 gap-3">
              {WALLPAPERS.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setWallpaper(w.id)}
                  className={`group overflow-hidden rounded-xl ring-2 transition ${
                    wallpaper === w.id
                      ? "ring-blue-500"
                      : "ring-black/10 hover:ring-black/30 dark:ring-white/10 dark:hover:ring-white/30"
                  }`}
                >
                  <img src={wallpaperUrl(w.id)} alt={w.name} className="h-24 w-full object-cover" />
                  <div className="flex items-center justify-between bg-black/10 px-2 py-1.5 dark:bg-black/30">
                    <span className="text-xs font-medium">{w.name}</span>
                    {wallpaper === w.id && <span className="text-xs text-blue-500 dark:text-blue-400">✓</span>}
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              Drop your own images into <code>public/wallpapers/</code> and register them in{" "}
              <code>src/state/settings.ts</code>.
            </p>
          </div>
        )}

        {pane === "About" && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-b from-sky-400 to-blue-600 text-3xl font-bold text-white">
              J
            </div>
            <h1 className="mt-4 text-xl font-bold">Jack's MacBook Pro</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">jackOS 26 “Tahoe” · Portfolio Edition</p>
            <div className="mt-4 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
              <p>Chip — Apple M∞ (Imagination Engine)</p>
              <p>Memory — 411 Keep notes migrated</p>
              <p>Owner — {profile.name}</p>
            </div>
            <p className="mt-6 max-w-sm text-xs leading-relaxed text-zinc-500">
              Built with React + Tailwind. UI inspired by macOS Tahoe (no Apple assets used) and{" "}
              <a className="text-sky-600 hover:underline dark:text-sky-400" href="https://github.com/vivek9patel/vivek9patel.github.io" target="_blank" rel="noopener">
                vivek9patel's Ubuntu portfolio
              </a>{" "}
              (MIT).
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
