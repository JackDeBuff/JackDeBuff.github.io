/* ────────────────────────────────────────────────────────────────────────────
   FootMob — Jack's toolkit as Real Madrid's iconic 2017/18 4-3-3. Skills lined
   up on a pitch instead of a boring list; shirt numbers are the real squad
   (Navas 1, Marcelo 12, Ramos 4 ©, Varane 5, Carvajal 2, Kroos 8, Casemiro 14,
   Modrić 10, Ronaldo 7, Benzema 9, Bale 11).
   ──────────────────────────────────────────────────────────────────────────── */

interface Player {
  name: string;
  role: string;
  num: number;
  x: number; // % across the pitch
  y: number; // % down the pitch (0 = attacking end)
  captain?: boolean;
}

const XI: Player[] = [
  { name: "Python", role: "GK", num: 1, x: 50, y: 89 },
  { name: "PyTorch", role: "DF", num: 12, x: 17, y: 70 },
  { name: "TensorFlow", role: "DF", num: 4, x: 39, y: 73, captain: true },
  { name: "scikit-learn", role: "DF", num: 5, x: 61, y: 73 },
  { name: "Pandas", role: "DF", num: 2, x: 83, y: 70 },
  { name: "Docker", role: "MF", num: 8, x: 26, y: 50 },
  { name: "Kubernetes", role: "MF", num: 14, x: 50, y: 47 },
  { name: "SQL", role: "MF", num: 10, x: 74, y: 50 },
  { name: "Computer Vision", role: "FW", num: 7, x: 23, y: 25 },
  { name: "Generative AI", role: "FW", num: 9, x: 50, y: 19 },
  { name: "Geospatial ML", role: "FW", num: 11, x: 77, y: 25 },
];

export default function Lineup() {
  return (
    <div className="flex h-full flex-col bg-[#0f1713] text-white">
      <header className="flex items-baseline justify-between px-4 pb-2 pt-4">
        <div>
          <h1 className="text-[18px] font-bold leading-none">Starting XI</h1>
          <p className="mt-1 text-[12px] text-white/60">My toolkit, in a 4-3-3. ¡Hala Madrid! ⚪️</p>
        </div>
        <span className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-semibold tracking-wide">4-3-3</span>
      </header>

      {/* Pitch */}
      <div className="relative min-h-0 flex-1 p-3">
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
          {/* turf with mown stripes */}
          <div className="absolute inset-0 bg-[#1c8a43]" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "repeating-linear-gradient(0deg, #199040 0 10%, #157a37 10% 20%)",
            }}
          />
          {/* markings */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <g fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.4">
              <rect x="2" y="2" width="96" height="96" />
              <line x1="2" y1="50" x2="98" y2="50" />
              <circle cx="50" cy="50" r="11" />
              <circle cx="50" cy="50" r="0.7" fill="#fff" stroke="none" />
              <rect x="30" y="2" width="40" height="16" />
              <rect x="30" y="82" width="40" height="16" />
              <rect x="41" y="2" width="18" height="6" />
              <rect x="41" y="92" width="18" height="6" />
            </g>
          </svg>

          {/* players */}
          {XI.map((p) => (
            <div
              key={p.name}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <div className="relative grid h-8 w-8 place-items-center rounded-full bg-white text-[12px] font-bold text-[#0b1e3f] shadow-md ring-2 ring-[#0b1e3f]/20">
                {p.num}
                {p.captain && (
                  <span className="absolute -right-1 -top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-[#febe10] text-[7px] font-bold text-[#0b1e3f] ring-1 ring-black/10">
                    C
                  </span>
                )}
              </div>
              <span className="mt-1 whitespace-nowrap rounded bg-black/45 px-1.5 py-0.5 text-[10px] font-semibold leading-none backdrop-blur-sm">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
