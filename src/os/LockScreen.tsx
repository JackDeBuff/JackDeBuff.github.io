import { useEffect, useState } from "react";
import { profile } from "../data/profile";
import { useSettings, wallpaperUrl } from "../state/settings";

const fmtTime = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const fmtDate = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const wallpaper = useSettings((s) => s.wallpaper);
  const [now, setNow] = useState(new Date());
  const [leaving, setLeaving] = useState(false);

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
    setLeaving(true);
    setTimeout(onUnlock, 450);
  }

  return (
    <div
      className={`relative h-full w-full cursor-pointer bg-cover bg-center transition-all duration-500 ${
        leaving ? "scale-105 opacity-0" : "opacity-100"
      }`}
      style={{ backgroundImage: `url(${wallpaperUrl(wallpaper)})` }}
      onClick={unlock}
    >
      <div className="absolute inset-0 backdrop-blur-2xl backdrop-brightness-75" />
      <div className="relative flex h-full flex-col items-center text-white">
        <div className="mt-20 text-center [text-shadow:0_2px_16px_rgba(0,0,0,0.4)]">
          <div className="text-2xl font-medium">{fmtDate.format(now)}</div>
          <div className="text-[96px] font-bold leading-none tracking-tight">{fmtTime.format(now)}</div>
        </div>
        <div className="flex-1" />
        <div className="mb-24 flex flex-col items-center gap-3">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-b from-sky-400 to-blue-600 text-3xl font-bold shadow-lg ring-2 ring-white/40">
            J
          </div>
          <div className="text-lg font-semibold [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
            {profile.name}
          </div>
          <div className="glass-thin rounded-full px-5 py-1.5 text-sm text-white/90">
            Click or press Enter to log in
          </div>
        </div>
      </div>
    </div>
  );
}
