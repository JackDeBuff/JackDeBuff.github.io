import { useEffect, useRef, useState } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   Salmon — Jack's real cat (since Jan 2019), living on the desktop as a little
   companion. She wanders the floor, sits, naps, and says something when clicked.
   Hand-drawn SVG (a cream-orange cat to match the name); all motion is
   transform/opacity and respects prefers-reduced-motion.
   ──────────────────────────────────────────────────────────────────────────── */

const LINES = [
  "meow",
  "feed me 🐟",
  "since 2019 🎂",
  "still wants to fight",
  "purrr…",
  "you're doing great",
  "nap time?",
];

type Mode = "walk" | "sit" | "sleep";

export default function SalmonPet() {
  const [x, setX] = useState(48);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [mode, setMode] = useState<Mode>("sit");
  const [say, setSay] = useState<string | null>(null);
  const sayTimer = useRef<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // just sit still

    let alive = true;
    const tick = () => {
      if (!alive) return;
      const roll = Math.random();
      if (roll < 0.55) {
        // wander to a new spot along the left/lower desktop
        const maxX = Math.max(120, Math.min(window.innerWidth * 0.42, 560));
        const target = 24 + Math.random() * maxX;
        setFacing(target >= x ? 1 : -1);
        setMode("walk");
        setX(target);
        // arrive → sit (walk transition is ~ distance-based, capped)
        window.setTimeout(() => alive && setMode("sit"), 2600);
      } else if (roll < 0.8) {
        setMode("sit");
      } else {
        setMode("sleep");
      }
      window.setTimeout(tick, 4200 + Math.random() * 4200);
    };
    const first = window.setTimeout(tick, 2000);
    return () => {
      alive = false;
      window.clearTimeout(first);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onPet() {
    setMode("sit");
    setSay(LINES[Math.floor(Math.random() * LINES.length)]);
    if (sayTimer.current) window.clearTimeout(sayTimer.current);
    sayTimer.current = window.setTimeout(() => setSay(null), 2200);
  }

  return (
    <div
      className="pointer-events-none absolute bottom-2 left-0 z-[5] select-none"
      style={{
        transform: `translateX(${x}px)`,
        transition: "transform 2.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      aria-hidden
    >
      <div style={{ transform: `scaleX(${facing})` }} className="relative">
        {say && (
          <div
            className="salmon-pop absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-zinc-800 shadow-md ring-1 ring-black/10"
            style={{ transform: `scaleX(${facing}) translateX(-50%)` }}
          >
            {say}
          </div>
        )}
        <button
          onClick={onPet}
          className={`pointer-events-auto block ${mode === "walk" ? "salmon-walk" : ""}`}
          aria-label="Salmon the cat"
          title="Salmon"
        >
          <CatSVG mode={mode} />
        </button>
      </div>
    </div>
  );
}

function CatSVG({ mode }: { mode: Mode }) {
  // cream-orange coat + darker ears/stripes; eyes close when sleeping
  const body = "#eab676";
  const dark = "#d99450";
  const sleeping = mode === "sleep";
  return (
    // overflow-visible: the tail sways past the right edge of the viewBox
    <svg width="52" height="46" viewBox="0 0 52 46" fill="none" className="overflow-visible">
      {/* tail */}
      <path
        className="salmon-tail"
        d="M42 34 C50 32 50 22 45 22"
        stroke={body}
        strokeWidth="5"
        strokeLinecap="round"
        style={{ transformOrigin: "42px 34px" }}
      />
      {/* body */}
      <ellipse cx="26" cy="34" rx="16" ry="10" fill={body} />
      {/* head */}
      <circle cx="16" cy="24" r="11" fill={body} />
      {/* ears */}
      <path d="M8 16 L6 7 L15 13 Z" fill={body} />
      <path d="M24 15 L27 7 L18 12 Z" fill={body} />
      <path d="M9 14 L8 9 L13 12 Z" fill={dark} />
      <path d="M23 13 L25 9 L20 12 Z" fill={dark} />
      {/* stripes */}
      <path d="M26 27 q3 -2 6 0" stroke={dark} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M28 31 q3 -2 6 0" stroke={dark} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* eyes */}
      {sleeping ? (
        <>
          <path d="M11 24 q2 2 4 0" stroke="#4a3520" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M18 24 q2 2 4 0" stroke="#4a3520" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <text x="30" y="14" fontSize="8" fill="#c9c9c9" className="salmon-z">z</text>
        </>
      ) : (
        <>
          <circle className="salmon-eye" cx="13" cy="24" r="1.7" fill="#2a2018" />
          <circle className="salmon-eye" cx="20" cy="24" r="1.7" fill="#2a2018" />
        </>
      )}
      {/* nose + legs */}
      <path d="M15.4 27 l1.2 0 l-0.6 0.9 Z" fill="#b56a5a" />
      <rect x="18" y="41" width="3" height="4" rx="1.4" fill={dark} />
      <rect x="30" y="41" width="3" height="4" rx="1.4" fill={dark} />
    </svg>
  );
}
