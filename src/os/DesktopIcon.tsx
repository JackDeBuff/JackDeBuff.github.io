import { useState, type ReactNode } from "react";

/**
 * macOS-style desktop shortcut: the selection highlight is a larger rounded
 * plate behind a smaller icon; the label turns into a blue pill and can wrap
 * to two lines (no "Google C…" truncation).
 */
export default function DesktopIcon({
  label,
  icon,
  onOpen,
}: {
  label: string;
  icon: ReactNode;
  onOpen: () => void;
}) {
  const [selected, setSelected] = useState(false);
  return (
    <button
      className="flex w-[92px] flex-col items-center gap-1 outline-none"
      onClick={() => setSelected(true)}
      onBlur={() => setSelected(false)}
      onDoubleClick={onOpen}
    >
      <div
        className={`grid h-[68px] w-[68px] place-items-center rounded-2xl transition-colors ${
          selected ? "bg-white/25 ring-1 ring-white/30 backdrop-blur-sm" : ""
        }`}
      >
        <div className="h-12 w-12">{icon}</div>
      </div>
      <span
        className={`line-clamp-2 max-w-full rounded-md px-1.5 py-px text-center text-[12px] font-medium leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] ${
          selected ? "bg-[#2662D9] [text-shadow:none]" : ""
        }`}
      >
        {label}
      </span>
    </button>
  );
}
