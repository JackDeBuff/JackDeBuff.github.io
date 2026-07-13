import { useEffect, useRef, useState } from "react";
import type { AppDef } from "../apps/apps.config";

/**
 * Apps whose own UI is a full-bleed dark surface (their own black header/chrome).
 * For these the sheet background goes near-black so the status-bar spacer blends
 * into the app, and the status bar switches to white text.
 */
export const BARE_DARK_APPS = new Set(["music", "terminal"]);

const MAX_DRAG = 320; // cap the upward translate (px)
const CLOSE_THRESHOLD = 90; // release past this (px up) to close
const TAP_SLOP = 8; // moves under this count as a tap, not a drag

/**
 * Full-screen iOS app sheet. Slides up on mount (`.sheet-up`). Closing is the
 * iOS home gesture: drag the home indicator up and the whole app follows the
 * finger (with a slight shrink), flying up to the home screen past the
 * threshold, springing back otherwise. Tapping the indicator still closes.
 * The gesture is armed ONLY on the indicator button — never on app content,
 * so in-app scrolling and taps are untouched.
 */
export default function MobileAppSheet({
  app,
  onClose,
}: {
  app: AppDef;
  onClose: () => void;
}) {
  const AppView = app.component!;
  const bare = BARE_DARK_APPS.has(app.id);

  const [dragY, setDragY] = useState(0); // <= 0 while dragging up
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState(false); // upward fly-away plays, then onClose
  const indicatorRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  /** The whole gesture uses NATIVE listeners: pointerdown armed directly on
   *  the indicator element, move/up tracked on window. React's synthetic
   *  pointer events proved unreliable here (same class of quirk as the
   *  documented "coordinate clicks don't fire React onClick"), and window
   *  tracking keeps working wherever the finger wanders. All mutable gesture
   *  state lives in refs so fast gestures never race React renders. */
  useEffect(() => {
    const el = indicatorRef.current;
    if (!el) return;

    let startY: number | null = null;
    let dragYCur = 0;
    let moved = 0;
    let exited = false;

    const beginExit = () => {
      if (exited) return;
      exited = true;
      setDragging(false);
      setExiting(true);
      // Unmount after the fly-away finishes. A timeout (not transitionend) —
      // the same proven pattern as LockScreen: transitionend proved
      // unreliable here and a stuck invisible sheet would swallow all input.
      window.setTimeout(() => onCloseRef.current(), 370);
    };

    const onMove = (ev: PointerEvent) => {
      if (startY === null || exited) return;
      const dy = ev.clientY - startY;
      moved = Math.max(moved, Math.abs(dy));
      dragYCur = Math.max(Math.min(dy, 0), -MAX_DRAG); // upward only, capped
      setDragY(dragYCur);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (startY === null) return;
      startY = null;
      if (dragYCur <= -CLOSE_THRESHOLD || moved <= TAP_SLOP) {
        beginExit(); // committed swipe — or a plain tap, which also closes
      } else {
        setDragging(false);
        setDragY(0); // spring back
        dragYCur = 0;
      }
    };
    const onDown = (ev: PointerEvent) => {
      if (exited) return;
      ev.preventDefault();
      startY = ev.clientY;
      dragYCur = 0;
      moved = 0;
      setDragging(true);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    };

    el.addEventListener("pointerdown", onDown);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  // iOS feel while dragging: follow the finger and shrink slightly
  const scale = 1 - Math.min(Math.abs(dragY) / 1600, 0.08);
  const style: React.CSSProperties = {
    transform: exiting ? "translateY(-104%) scale(0.92)" : `translateY(${dragY}px) scale(${dragY ? scale : 1})`,
    opacity: exiting ? 0 : 1 - Math.min(Math.abs(dragY) / 640, 0.25),
    transition: dragging
      ? "none"
      : exiting
        ? "transform 0.34s var(--ease-out-expo), opacity 0.3s ease"
        : "transform 0.32s var(--ease-spring), opacity 0.32s ease",
  };

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col ${
        bare ? "bg-zinc-950" : "bg-zinc-100 dark:bg-zinc-900"
      } sheet-up`}
      style={style}
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

      {/* iOS home indicator — swipe up to close (or tap as fallback).
          The mix-blend-difference lives on the BUTTON: its `absolute z-10`
          makes it a stacking context, so a blend on the child span would only
          blend against the transparent button (always white). On the button it
          blends against the app content below — white bar over dark apps, dark
          over light. touch-none stops the browser from claiming the swipe. */}
      <button
        ref={indicatorRef}
        aria-label="Close app"
        className="absolute bottom-0 left-1/2 z-10 flex h-7 w-48 -translate-x-1/2 touch-none items-end justify-center mix-blend-difference"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
      >
        <span className="h-[5px] w-32 rounded-full bg-white" />
      </button>
    </div>
  );
}
