import { useEffect } from "react";
import { AppleLogo } from "../icons/AppIcons";

export default function BootScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-black">
      <AppleLogo className="h-24 w-24 text-white" />
      <div className="mt-16 h-1.5 w-56 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white"
          style={{ animation: "boot-fill 2.1s cubic-bezier(0.4,0.1,0.3,1) forwards" }}
        />
      </div>
    </div>
  );
}
