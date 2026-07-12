import MenuBar from "./MenuBar";
import Dock from "./Dock";
import DesktopIcon from "./DesktopIcon";
import WindowFrame from "./Window";
import { apps } from "../apps/apps.config";
import { useWindows } from "../state/windows";
import { useSettings, wallpaperUrl } from "../state/settings";

export default function Desktop({ onLock, onRestart }: { onLock: () => void; onRestart: () => void }) {
  const { openWindow } = useWindows();
  const wallpaper = useSettings((s) => s.wallpaper);

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-cover bg-center transition-[background-image] duration-300"
      style={{ backgroundImage: `url(${wallpaperUrl(wallpaper)})` }}
    >
      <MenuBar onLock={onLock} onRestart={onRestart} />

      {/* Desktop shortcuts — right-aligned column, macOS style */}
      <div className="absolute right-3 top-10 flex flex-col items-end gap-1">
        {apps
          .filter((a) => a.desktop)
          .map((a) => (
            <DesktopIcon
              key={a.id}
              label={a.title}
              icon={a.icon}
              onOpen={() => {
                if (a.external) window.open(a.external, "_blank", "noopener");
                else openWindow(a.id);
              }}
            />
          ))}
      </div>

      {/* Window layer — pointer-events-none so the empty layer never blocks the desktop */}
      <div className="pointer-events-none absolute inset-0">
        {apps
          .filter((a) => a.component)
          .map((a) => {
            const AppView = a.component!;
            return (
              <WindowFrame
                key={a.id}
                id={a.id}
                title={a.title}
                defaultSize={a.defaultSize!}
                defaultPosition={a.defaultPosition!}
              >
                <AppView />
              </WindowFrame>
            );
          })}
      </div>

      <Dock />
    </div>
  );
}
