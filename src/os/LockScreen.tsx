import { useEffect, useRef, useState } from "react";
import { profile } from "../data/profile";
import { useSettings, wallpaperUrl } from "../state/settings";
import { useIsMobile } from "../state/useIsMobile";

const fmtTime = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: false });
const fmtDate = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });

const MAX_DRAG = 260; // cap the upward translate (px)
const UNLOCK_THRESHOLD = 90; // release past this (px up) to unlock

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const wallpaper = useSettings((s) => s.wallpaper);
  const isMobile = useIsMobile();
  const [now, setNow] = useState(new Date());
  const [leaving, setLeaving] = useState(false);

  // Mobile swipe-to-unlock state
  const [dragY, setDragY] = useState(0); // <= 0 while dragging up
  const [dragging, setDragging] = useState(false);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const go = (e: KeyboardEvent) => {
      if (e.key === "Enter") unlock();
    };
    window.addEventListener("keydown", go);
    return () => window.removeEventListener("keydown", go);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function unlock() {
    if (leaving) return;
    setDragging(false);
    setLeaving(true);
    setTimeout(onUnlock, isMobile ? 420 : 450);
  }

  // --- Pointer Events (mouse + touch) so mobile-resized desktop testing works too ---
  function onPointerDown(e: React.PointerEvent) {
    if (!isMobile || leaving) return;
    startY.current = e.clientY;
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!isMobile || leaving || startY.current === null) return;
    const dy = e.clientY - startY.current;
    // only upward drags translate; cap it (no rubber-banding)
    setDragY(Math.max(Math.min(dy, 0), -MAX_DRAG));
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!isMobile || startY.current === null) return;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    startY.current = null;
    if (dragY <= -UNLOCK_THRESHOLD) {
      unlock(); // leaving transform takes over
    } else {
      setDragging(false);
      setDragY(0); // snap back with transition
    }
  }

  // Inline transform/opacity for the mobile branch (transform/opacity only)
  const mobileStyle: React.CSSProperties | undefined = isMobile
    ? {
        transform: leaving ? "translateY(-100%)" : `translateY(${dragY}px)`,
        opacity: leaving ? 0 : 1 - Math.min(Math.abs(dragY) / 520, 0.28),
        transition: dragging
          ? "none"
          : leaving
            ? "transform 0.42s var(--ease-out-expo), opacity 0.42s ease"
            : "transform 0.35s var(--ease-spring), opacity 0.35s ease",
      }
    : undefined;

  const desktopClasses = `transition-all duration-500 ${leaving ? "scale-105 opacity-0" : "opacity-100"}`;

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-zinc-900 ${
        isMobile ? "touch-none select-none" : `cursor-pointer ${desktopClasses}`
      }`}
      style={mobileStyle}
      onClick={isMobile ? undefined : unlock}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Wallpaper as a real <img> with the blur applied directly — NOT a CSS
          background + backdrop-filter overlay: iOS Safari caches the backdrop
          before the image loads (grey lock screen on first visit) and doesn't
          repaint until a touch. An <img> repaints itself on load. scale-110
          hides the blur's soft edges. */}
      <img
        src={wallpaperUrl(wallpaper)}
        alt=""
        aria-hidden
        draggable={false}
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-75"
      />
      <div className="relative flex h-full flex-col items-center text-white">
        <div className="mt-20 text-center [text-shadow:0_2px_16px_rgba(0,0,0,0.4)]">
          <div className="text-2xl font-medium">{fmtDate.format(now)}</div>
          <div className="text-[96px] font-bold leading-none tracking-tight">{fmtTime.format(now)}</div>
        </div>
        <div className="flex-1" />
        {!isMobile && (
          <div className="mb-24 flex flex-col items-center gap-3">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-b from-sky-400 to-blue-600 text-3xl font-bold shadow-lg ring-2 ring-white/40">
              J
            </div>
            <div className="text-lg font-semibold [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
              {profile.name}
            </div>
            {/* liquid-glass-dim pins the dark glass recipe in light mode too —
                the lock backdrop is always a dimmed wallpaper. */}
            <div className="liquid-glass liquid-glass-dim rounded-full px-5 py-1.5 text-sm text-white/90">
              Click or press Enter to log in
            </div>
          </div>
        )}

        {isMobile && (
          // iOS-style swipe-up affordance: bare shimmer text, no pill.
          // Tapping it is an accessibility fallback.
          <button
            type="button"
            aria-label="Swipe up to unlock"
            onClick={unlock}
            className="mb-9 flex cursor-pointer flex-col items-center gap-5 bg-transparent"
          >
            <span className="lock-shimmer text-[15px] font-medium">Swipe up to unlock</span>
            <span className="lock-home-indicator block h-[5px] w-[140px] rounded-full bg-white/90" />
          </button>
        )}
      </div>
    </div>
  );
}
