import { useState, type AnimationEvent } from "react";
import type { AppDef } from "../apps/apps.config";

/**
 * Apps whose own UI is a full-bleed dark surface (their own black header/chrome).
 * For these we drop the redundant light title bar and give the sheet a near-black
 * background so the status-bar spacer blends into the app — it feels native rather
 * than like an app boxed inside a light sheet.
 */
export const BARE_DARK_APPS = new Set(["music", "terminal"]);

/**
 * Full-screen iOS app sheet. Slides up on mount (`.sheet-up`) and, when the
 * home indicator is tapped, slides down (`.sheet-down`) then fires `onClose`
 * on animation end. The `target === currentTarget` guard makes sure a bubbling
 * animationend from a child (e.g. the Photos grid) never closes the sheet.
 */
export default function MobileAppSheet({
  app,
  onClose,
}: {
  app: AppDef;
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);
  const AppView = app.component!;
  const bare = BARE_DARK_APPS.has(app.id);

  const onAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (closing && e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col ${
        bare ? "bg-zinc-950" : "bg-zinc-100 dark:bg-zinc-900"
      } ${closing ? "sheet-down" : "sheet-up"}`}
      onAnimationEnd={onAnimationEnd}
    >
      {/* Spacer under the always-on-top status bar */}
      <div
        className="shrink-0"
        style={{ height: "calc(env(safe-area-inset-top) + 44px)" }}
      />

      {/* Thin app title bar — dropped for bare dark apps that carry their own chrome */}
      {!bare && (
        <div className="flex h-11 shrink-0 items-center justify-center border-b border-black/10 px-4 text-[15px] font-semibold text-zinc-800 dark:border-white/10 dark:text-zinc-100">
          <span className="truncate">{app.title}</span>
        </div>
      )}

      {/* App content */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <AppView />
      </div>

      {/* iOS home indicator — generous invisible tap area, closes the app.
          mix-blend-difference keeps the pill visible on any background
          (renders white over dark, dark over light). */}
      <button
        aria-label="Close app"
        onClick={() => setClosing(true)}
        className="absolute inset-x-0 bottom-0 z-10 flex h-8 items-end justify-center"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
      >
        <span className="h-[5px] w-32 rounded-full bg-white mix-blend-difference" />
      </button>
    </div>
  );
}
