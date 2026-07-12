import { useEffect, useRef, useState, type ReactNode } from "react";
import { Rnd } from "react-rnd";
import { useWindows } from "../state/windows";

export interface WindowFrameProps {
  id: string;
  title: string;
  children: ReactNode;
  defaultSize: { width: number; height: number };
  defaultPosition: { x: number; y: number };
  minWidth?: number;
  minHeight?: number;
}

const MENUBAR_H = 28;
const DOCK_SAFE = 90;

export default function WindowFrame({
  id,
  title,
  children,
  defaultSize,
  defaultPosition,
  minWidth = 420,
  minHeight = 280,
}: WindowFrameProps) {
  const { windows, activeId, closeWindow, minimizeWindow, toggleMaximize, focusWindow } =
    useWindows();
  const st = windows[id];
  const rndRef = useRef<Rnd>(null);

  // Exit-animation state machine. While non-null we're playing an exit
  // animation on the inner div and must ignore further close/minimize clicks.
  const [anim, setAnim] = useState<"closing" | "minimizing" | null>(null);
  // Controls the one-shot `.window-open` enter/restore replay. Starts true so
  // the mount animation runs; cleared on animationEnd; re-armed when the window
  // becomes visible again (restore from minimize, or reopen after close).
  const [openAnim, setOpenAnim] = useState(true);
  const prevVisible = useRef(false);

  useEffect(() => {
    const visible = !!st?.open && !st?.minimized;
    if (visible && !prevVisible.current) setOpenAnim(true);
    prevVisible.current = visible;
  }, [st?.open, st?.minimized]);

  if (!st?.open) return null;

  const active = activeId === id;
  const maximized = st.maximized;

  const animClass =
    anim === "closing"
      ? "window-close"
      : anim === "minimizing"
        ? "window-minimize"
        : openAnim
          ? "window-open"
          : "";

  const onInnerAnimEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    // Only react to the inner div's own animation, not children (app content).
    if (e.target !== e.currentTarget) return;
    if (anim === "closing") {
      closeWindow(id);
      setAnim(null);
    } else if (anim === "minimizing") {
      minimizeWindow(id);
      setAnim(null);
    } else if (openAnim) {
      setOpenAnim(false);
    }
  };

  return (
    <Rnd
      ref={rndRef}
      default={{ ...defaultPosition, ...defaultSize }}
      size={
        maximized
          ? { width: "100%", height: `calc(100% - ${MENUBAR_H + DOCK_SAFE}px)` }
          : undefined
      }
      position={maximized ? { x: 0, y: MENUBAR_H } : undefined}
      minWidth={minWidth}
      minHeight={minHeight}
      bounds="parent"
      dragHandleClassName="window-drag-handle"
      enableResizing={!maximized}
      disableDragging={maximized}
      style={{ zIndex: st.z, display: st.minimized ? "none" : undefined, pointerEvents: "auto" }}
      onDragStart={() => focusWindow(id)}
      onResizeStart={() => focusWindow(id)}
    >
      <div
        className={`${animClass} flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-window)] ${
          active ? "shadow-[var(--shadow-window)]" : "shadow-[var(--shadow-window-inactive)]"
        } ring-1 ring-black/20 dark:ring-black/60`}
        onAnimationEnd={onInnerAnimEnd}
        onMouseDownCapture={() => focusWindow(id)}
      >
        {/* Title bar */}
        <div
          className="window-drag-handle glass-thin relative flex h-11 shrink-0 cursor-default items-center px-3"
          onDoubleClick={() => toggleMaximize(id)}
        >
          <div className="group flex items-center gap-2">
            <button
              aria-label="close"
              onClick={() => {
                if (anim) return;
                setAnim("closing");
              }}
              className="grid h-3 w-3 place-items-center rounded-full bg-[#FF5F57] ring-1 ring-black/15"
            >
              <span className="hidden text-[8px] font-bold leading-none text-black/60 group-hover:block">×</span>
            </button>
            <button
              aria-label="minimize"
              onClick={() => {
                if (anim) return;
                setAnim("minimizing");
              }}
              className="grid h-3 w-3 place-items-center rounded-full bg-[#FEBC2E] ring-1 ring-black/15"
            >
              <span className="hidden text-[8px] font-bold leading-none text-black/60 group-hover:block">–</span>
            </button>
            <button
              aria-label="zoom"
              onClick={() => toggleMaximize(id)}
              className="grid h-3 w-3 place-items-center rounded-full bg-[#28C840] ring-1 ring-black/15"
            >
              <span className="hidden text-[7px] font-bold leading-none text-black/60 group-hover:block">⤢</span>
            </button>
          </div>
          <span
            className={`pointer-events-none absolute inset-x-0 text-center text-[13px] font-semibold ${
              active ? "text-zinc-800 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            {title}
          </span>
        </div>
        {/* Content */}
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </Rnd>
  );
}
