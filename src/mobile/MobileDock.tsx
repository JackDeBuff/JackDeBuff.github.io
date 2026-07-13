import { apps, type AppDef } from "../apps/apps.config";

/**
 * The four apps pinned to the iOS-style dock. "photos" is added to
 * apps.config by another workstream later, so ids are resolved defensively —
 * a missing id simply drops out of the dock instead of crashing.
 */
export const MOBILE_DOCK_IDS = ["about", "chrome", "photos", "music"];

export default function MobileDock({ onOpen }: { onOpen: (app: AppDef) => void }) {
  const dockApps = MOBILE_DOCK_IDS.map((id) => apps.find((a) => a.id === id)).filter(
    Boolean,
  ) as AppDef[];

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center px-4"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
    >
      <div
        className="liquid-glass pointer-events-auto flex w-full max-w-[380px] items-center justify-around rounded-[var(--radius-dock)] px-3"
        style={{ height: 92 }}
      >
        {dockApps.map((app) => (
          <button
            key={app.id}
            aria-label={app.title}
            onClick={() => onOpen(app)}
            className="grid h-[64px] w-[64px] place-items-center transition-transform duration-150 ease-out active:scale-90"
          >
            {app.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
