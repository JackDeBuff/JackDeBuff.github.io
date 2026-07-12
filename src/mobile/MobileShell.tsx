import { useState } from "react";
import { apps, type AppDef } from "../apps/apps.config";
import { useSettings, wallpaperUrl } from "../state/settings";
import MobileStatusBar from "./MobileStatusBar";
import MobileHome from "./MobileHome";
import MobileDock from "./MobileDock";
import MobileAppSheet from "./MobileAppSheet";

/**
 * iOS-style mobile shell: a single full-screen app at a time (no z-order,
 * minimize, or the react-rnd windowing the desktop uses). Deliberately keeps
 * its own `activeAppId` state instead of the `useWindows` store.
 */
export default function MobileShell({ onLock }: { onLock: () => void }) {
  const wallpaper = useSettings((s) => s.wallpaper);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);

  const open = (app: AppDef) => {
    if (app.external) {
      window.open(app.external, "_blank", "noopener");
      return;
    }
    setActiveAppId(app.id);
  };

  // Only resolve to an app that can actually render a component.
  const activeApp = apps.find((a) => a.id === activeAppId && a.component) ?? null;

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${wallpaperUrl(wallpaper)})` }}
    >
      {/* Home stays mounted under the sheet (cheap — just icons). Heavy app
          components mount only while a sheet is open. */}
      <MobileHome onOpen={open} />
      <MobileDock onOpen={open} />

      {activeApp && (
        <MobileAppSheet
          key={activeApp.id}
          app={activeApp}
          onClose={() => setActiveAppId(null)}
        />
      )}

      {/* Always on top so the clock stays visible over any app sheet. */}
      <MobileStatusBar onLock={onLock} overContent={!!activeApp} />
    </div>
  );
}
