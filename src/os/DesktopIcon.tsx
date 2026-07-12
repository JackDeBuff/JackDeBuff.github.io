import { useState, type ReactNode } from "react";

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
      className="flex w-24 flex-col items-center gap-1.5 rounded-lg p-2 outline-none"
      onClick={() => setSelected(true)}
      onBlur={() => setSelected(false)}
      onDoubleClick={onOpen}
    >
      <div className={`h-14 w-14 rounded-[14px] ${selected ? "bg-white/20 ring-2 ring-white/40" : ""}`}>
        {icon}
      </div>
      <span
        className={`max-w-full truncate rounded px-1.5 py-0.5 text-[12px] font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] ${
          selected ? "bg-blue-500 [text-shadow:none]" : ""
        }`}
      >
        {label}
      </span>
    </button>
  );
}
