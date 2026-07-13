import { apps, type AppDef } from "../apps/apps.config";
import { MOBILE_DOCK_IDS } from "./MobileDock";

/**
 * iPhone-style home screen: a 4-column icon grid of every app that isn't
 * pinned to the dock. Single tap opens (external apps open in a new tab,
 * handled by the shell's `onOpen`).
 */
export default function MobileHome({ onOpen }: { onOpen: (app: AppDef) => void }) {
  const homeApps = apps.filter((a) => !MOBILE_DOCK_IDS.includes(a.id));

  return (
    <div
      className="no-scrollbar absolute inset-0 z-10 overflow-y-auto px-6"
      style={{
        paddingTop: "calc(env(safe-area-inset-top) + 60px)",
        paddingBottom: "calc(env(safe-area-inset-bottom) + 132px)",
      }}
    >
      <div className="grid grid-cols-4 gap-x-4 gap-y-6">
        {homeApps.map((app) => (
          <button
            key={app.id}
            onClick={() => onOpen(app)}
            className="flex flex-col items-center gap-1.5 transition-transform duration-150 ease-out active:scale-90"
          >
            <span className="grid h-[60px] w-[60px] place-items-center">{app.icon}</span>
            <span className="max-w-full truncate text-[11px] font-medium leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]">
              {app.mobileTitle ?? app.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
