import { useRef, type ReactNode } from "react";
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
  /** Render children edge-to-edge (app draws its own chrome background), title bar overlays content. */
  transparentChrome?: boolean;
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
  transparentChrome = false,
}: WindowFrameProps) {
  const { windows, activeId, closeWindow, minimizeWindow, toggleMaximize, focusWindow } =
    useWindows();
  const st = windows[id];
  const rndRef = useRef<Rnd>(null);
  if (!st?.open) return null;

  const active = activeId === id;
  const maximized = st.maximized;

  return (
    <Rnd
      ref={rndRef}
      default={{ ...defaultPosition, ...defaultSize }}
      size={maximized ? { width: "100%", height: `calc(100% - ${MENUBAR_H + DOCK_SAFE}px)` } : undefined}
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
        className={`window-open flex h-full w-full flex-col overflow-hidden rounded-xl ${
          active ? "shadow-[0_22px_70px_rgba(0,0,0,0.55)]" : "shadow-[0_10px_34px_rgba(0,0,0,0.35)]"
        } ring-1 ring-black/40 dark:ring-black/60`}
        onMouseDownCapture={() => focusWindow(id)}
      >
        {/* Title bar */}
        <div
          className={`window-drag-handle relative flex h-11 shrink-0 cursor-default items-center px-3 ${
            transparentChrome ? "absolute inset-x-0 top-0 z-10" : "glass-thin"
          }`}
          onDoubleClick={() => toggleMaximize(id)}
        >
          <div className="group flex items-center gap-2">
            <button
              aria-label="close"
              onClick={() => closeWindow(id)}
              className="grid h-3 w-3 place-items-center rounded-full bg-[#FF5F57] ring-1 ring-black/15"
            >
              <span className="hidden text-[8px] font-bold leading-none text-black/60 group-hover:block">×</span>
            </button>
            <button
              aria-label="minimize"
              onClick={() => minimizeWindow(id)}
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
              active ? "text-zinc-100" : "text-zinc-400"
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
