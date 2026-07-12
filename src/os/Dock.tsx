import { useRef, useState } from "react";
import { apps } from "../apps/apps.config";
import { useWindows } from "../state/windows";

const BASE = 52;
const MAX_SCALE = 1.5;
const RANGE = 110; // px falloff radius for magnification

/** Gaussian-ish falloff like the real dock's parabolic magnification. */
function scaleFor(distance: number): number {
  const t = Math.max(0, 1 - (distance / RANGE) ** 2);
  return 1 + (MAX_SCALE - 1) * t * t;
}

export default function Dock() {
  const { windows, openWindow } = useWindows();
  const dockApps = apps.filter((a) => a.dock);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-2 z-[8000] flex justify-center">
      <div
        className="glass pointer-events-auto flex items-end gap-1 rounded-[22px] px-2 pb-1.5 pt-1.5"
        onMouseMove={(e) => setMouseX(e.clientX)}
        onMouseLeave={() => setMouseX(null)}
      >
        {dockApps.map((app, i) => {
          const el = refs.current[i];
          let scale = 1;
          if (mouseX !== null && el) {
            const r = el.getBoundingClientRect();
            scale = scaleFor(Math.abs(mouseX - (r.left + r.width / 2)));
          }
          const running = app.external ? false : windows[app.id]?.open;
          return (
            <button
              key={app.id}
              ref={(node) => {
                refs.current[i] = node;
              }}
              className="group relative flex flex-col items-center justify-end"
              style={{ width: BASE, height: BASE, zIndex: scale > 1.05 ? 10 : 1 }}
              onClick={() => {
                if (app.external) window.open(app.external, "_blank", "noopener");
                else openWindow(app.id);
              }}
            >
              {/* tooltip */}
              <span className="glass-thin pointer-events-none absolute -top-10 hidden whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium text-white group-hover:block">
                {app.title}
              </span>
              {/* transform-only magnification: no layout shift, click target never moves */}
              <div
                className="h-full w-full"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "bottom center",
                  transition: mouseX === null ? "transform 0.22s var(--ease-out-quint)" : "transform 0.05s linear",
                }}
              >
                {app.icon}
              </div>
              <span
                className={`absolute -bottom-1 h-1 w-1 rounded-full bg-white/80 ${running ? "" : "opacity-0"}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
