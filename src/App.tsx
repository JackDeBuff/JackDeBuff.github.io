import { useEffect, useState } from "react";
import BootScreen from "./os/BootScreen";
import LockScreen from "./os/LockScreen";
import Desktop from "./os/Desktop";
import MobileShell from "./mobile/MobileShell";
import { useSettings, wallpaperUrl } from "./state/settings";
import { useIsMobile } from "./state/useIsMobile";

type Stage = "boot" | "lock" | "desktop";

export default function App() {
  const [stage, setStage] = useState<Stage>("boot");
  const appearance = useSettings((s) => s.appearance);
  const wallpaper = useSettings((s) => s.wallpaper);
  const mobile = useIsMobile();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", appearance === "dark");
    root.classList.toggle("light", appearance === "light");
  }, [appearance]);

  // Preload + decode the wallpaper during the boot screen so the lock screen's
  // first paint already has it (first visits on mobile showed grey until a tap).
  useEffect(() => {
    const img = new Image();
    img.src = wallpaperUrl(wallpaper);
    img.decode?.().catch(() => {});
  }, [wallpaper]);

  return (
    <div className="h-full w-full">
      {/* Liquid Glass displacement filter (SVG turbulence technique, Chromium refraction) */}
      <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
        <filter id="lg-distortion" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale="52" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {stage === "boot" && <BootScreen onDone={() => setStage("lock")} />}
      {stage === "lock" && <LockScreen onUnlock={() => setStage("desktop")} />}
      {stage === "desktop" &&
        (mobile ? (
          <MobileShell onLock={() => setStage("lock")} />
        ) : (
          <Desktop onLock={() => setStage("lock")} onRestart={() => setStage("boot")} />
        ))}
    </div>
  );
}
