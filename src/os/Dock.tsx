import { useState } from "react";
import { apps } from "../apps/apps.config";
import { useWindows } from "../state/windows";
import { useIsMobile } from "../state/useIsMobile";

export default function Dock() {
  const { windows, openWindow } = useWindows();
  const dockApps = apps.filter((a) => a.dock);
  const [blinkId, setBlinkId] = useState<string | null>(null);
  const mobile = useIsMobile();

  function launch(id: string, external?: string) {
    setBlinkId(id);
    setTimeout(() => setBlinkId(null), 380);
    if (external) window.open(external, "_blank", "noopener");
    else openWindow(id);
  }

  // On phones a maximized window owns the screen; the dock returns when it closes.
  const anyOpen = Object.values(windows).some((w) => w.open && !w.minimized);
  if (mobile && anyOpen) return null;

  return (
    <div
      className={
        mobile
          ? "pointer-events-none fixed inset-y-0 left-1.5 z-[8000] flex items-center"
          : "pointer-events-none fixed inset-x-0 bottom-2 z-[8000] flex justify-center"
      }
    >
      <div
        className={`liquid-glass pointer-events-auto flex gap-2 ${
          mobile ? "flex-col rounded-[24px] px-1.5 py-2" : "items-end rounded-[24px] px-2 py-1.5"
        }`}
      >
        {dockApps.map((app) => {
          const running = app.external ? false : windows[app.id]?.open;
          return (
            <button
              key={app.id}
              className="group relative flex flex-col items-center"
              style={{ width: mobile ? 44 : 52, height: mobile ? 44 : 52 }}
              onClick={() => launch(app.id, app.external)}
            >
              {/* tooltip (desktop only) */}
              {!mobile && (
                <span className="liquid-glass pointer-events-none absolute -top-10 hidden whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium text-white group-hover:block">
                  {app.title}
                </span>
              )}
              <div
                className={`h-full w-full transition-transform duration-150 ease-out group-active:scale-95 ${
                  blinkId === app.id ? "dock-blink" : ""
                }`}
              >
                {app.icon}
              </div>
              <span
                className={`absolute rounded-full bg-white/80 ${
                  mobile ? "-right-1 top-1/2 h-1 w-1 -translate-y-1/2" : "-bottom-1 h-1 w-1"
                } ${running ? "" : "opacity-0"}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
