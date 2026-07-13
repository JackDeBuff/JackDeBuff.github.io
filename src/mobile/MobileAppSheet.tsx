import { useState, type AnimationEvent } from "react";
import type { AppDef } from "../apps/apps.config";

/**
 * Apps whose own UI is a full-bleed dark surface (their own black header/chrome).
 * For these the sheet background goes near-black so the status-bar spacer blends
 * into the app, and the status bar switches to white text.
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

      {/* No sheet title bar — every app carries its own header (real iOS apps
          don't get a system chrome strip either). */}

      {/* App content */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <AppView />
      </div>

      {/* iOS home indicator — generous invisible tap area, closes the app.
          mix-blend-difference keeps the pill visible on any background
          (renders white over dark, dark over light). */}
      {/* The blend lives on the BUTTON: its `absolute z-10` makes it a stacking
          context, so a blend on the child span would only blend against the
          transparent button (always white). On the button it blends against
          the app content below — white bar over dark apps, dark over light. */}
      <button
        aria-label="Close app"
        onClick={() => setClosing(true)}
        className="absolute bottom-0 left-1/2 z-10 flex h-7 w-48 -translate-x-1/2 items-end justify-center mix-blend-difference"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
      >
        <span className="h-[5px] w-32 rounded-full bg-white" />
      </button>
    </div>
  );
}
