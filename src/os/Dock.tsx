import { useState } from "react";
import { apps } from "../apps/apps.config";
import { useWindows } from "../state/windows";

export default function Dock() {
  const { windows, openWindow } = useWindows();
  const dockApps = apps.filter((a) => a.dock);
  const [blinkId, setBlinkId] = useState<string | null>(null);

  function launch(id: string, external?: string) {
    setBlinkId(id);
    setTimeout(() => setBlinkId(null), 380);
    if (external) window.open(external, "_blank", "noopener");
    else openWindow(id);
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-2 z-[8000] flex justify-center">
      <div className="liquid-glass pointer-events-auto flex items-end gap-2 rounded-[var(--radius-dock)] px-2 py-1.5">
        {dockApps.map((app) => {
          const running = app.external ? false : windows[app.id]?.open;
          return (
            <button
              key={app.id}
              className="group relative flex flex-col items-center"
              style={{ width: 52, height: 52 }}
              onClick={() => launch(app.id, app.external)}
            >
              {/* tooltip */}
              <span className="liquid-glass pointer-events-none absolute -top-10 hidden whitespace-nowrap rounded-[var(--radius-tooltip)] px-2.5 py-1 text-xs font-medium text-white shadow-[var(--shadow-tooltip)] group-hover:block">
                {app.title}
              </span>
              <div
                className={`h-full w-full transition-transform duration-150 ease-out group-active:scale-95 ${
                  blinkId === app.id ? "dock-blink" : ""
                }`}
              >
                {app.icon}
              </div>
              <span
                className={`absolute -bottom-1 h-1 w-1 rounded-full bg-white/80 ${
                  running ? "" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
