import { useEffect, useState } from "react";
import BootScreen from "./os/BootScreen";
import LockScreen from "./os/LockScreen";
import Desktop from "./os/Desktop";
import MobileFallback from "./os/MobileFallback";
import { useSettings } from "./state/settings";

type Stage = "boot" | "lock" | "desktop";

export default function App() {
  const [stage, setStage] = useState<Stage>("boot");
  const appearance = useSettings((s) => s.appearance);
  const [isNarrow, setIsNarrow] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", appearance === "dark");
    root.classList.toggle("light", appearance === "light");
  }, [appearance]);

  if (isNarrow) return <MobileFallback />;

  return (
    <div className="h-full w-full">
      {stage === "boot" && <BootScreen onDone={() => setStage("lock")} />}
      {stage === "lock" && <LockScreen onUnlock={() => setStage("desktop")} />}
      {stage === "desktop" && (
        <Desktop onLock={() => setStage("lock")} onRestart={() => setStage("boot")} />
      )}
    </div>
  );
}
