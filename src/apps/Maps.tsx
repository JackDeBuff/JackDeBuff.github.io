import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { journey, type Stop } from "../data/journey";
import { useSettings } from "../state/settings";

/* ────────────────────────────────────────────────────────────────────────────
   Maps — Jack's journey on a REAL map. OpenStreetMap data rendered with CARTO's
   light/dark basemaps via Leaflet (no API key). Every pin sits on the actual
   place; a line threads the Thailand stops so you can see them march further and
   further from home. Duke sits ~13,000 km away — select it to fly across.
   ──────────────────────────────────────────────────────────────────────────── */

const TILES = {
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};
const ATTRIB =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const thStops = journey.filter((s) => s.country === "TH");

function pinHtml(stop: Stop, active: boolean) {
  const size = active ? 36 : 26;
  const bg = active ? "#0a84ff" : "#ffffff";
  const fg = active ? "#fff" : "#111";
  return `<div style="
    width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);background:${bg};
    border:2px solid ${active ? "#fff" : "#ff3b30"};
    box-shadow:0 2px 6px rgba(0,0,0,.4);
    display:grid;place-items:center;">
    <span style="transform:rotate(45deg);font-size:${active ? 16 : 12}px;line-height:1;color:${fg}">${stop.emoji}</span>
  </div>`;
}

function makeIcon(stop: Stop, active: boolean) {
  const size = active ? 36 : 26;
  return L.divIcon({
    html: pinHtml(stop, active),
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size], // bottom tip
  });
}

export default function Maps() {
  const appearance = useSettings((s) => s.appearance);
  const [activeId, setActiveId] = useState<string>("home");
  const active = journey.find((s) => s.id === activeId) ?? journey[0];

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  // Init the map once (the window unmounts this component on close, so this is
  // a genuine mount each time it opens — the container always has a real size).
  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true,
    });
    mapRef.current = map;

    tileRef.current = L.tileLayer(TILES[appearance === "dark" ? "dark" : "light"], {
      attribution: ATTRIB,
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Route through the Thailand stops (in order).
    L.polyline(
      thStops.map((s) => [s.lat, s.lon] as [number, number]),
      { color: "#0a84ff", weight: 2.5, opacity: 0.85, dashArray: "1 7", lineCap: "round" },
    ).addTo(map);

    // Markers
    journey.forEach((s) => {
      const m = L.marker([s.lat, s.lon], { icon: makeIcon(s, s.id === activeIdRef.current) })
        .addTo(map)
        .on("click", () => setActiveId(s.id));
      markersRef.current[s.id] = m;
    });

    // Start framed on the Thailand chapter so the "further from home" spread reads.
    map.fitBounds(thStops.map((s) => [s.lat, s.lon] as [number, number]), { padding: [50, 50] });

    // Keep Leaflet in sync with the resizable window.
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap tiles on light/dark change.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    tileRef.current?.remove();
    tileRef.current = L.tileLayer(TILES[appearance === "dark" ? "dark" : "light"], {
      attribution: ATTRIB,
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);
  }, [appearance]);

  // Recenter on the active stop + refresh marker highlight. Use a pan animation
  // for nearby hops but snap instantly for the trans-Pacific jump to Duke —
  // Leaflet's flyTo turns janky across ~13,000 km.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    journey.forEach((s) => markersRef.current[s.id]?.setIcon(makeIcon(s, s.id === activeId)));
    const s = journey.find((j) => j.id === activeId);
    if (!s) return;
    const far = Math.abs(map.getCenter().lng - s.lon) > 40;
    map.setView([s.lat, s.lon], 12, { animate: !far });
  }, [activeId]);

  return (
    <div className="flex h-full flex-col bg-white text-zinc-900 dark:bg-[#1b1c1e] dark:text-white md:flex-row">
      {/* Sidebar — Maps-style "guide" list */}
      <aside className="z-[500] shrink-0 border-b border-black/10 bg-white md:w-64 md:border-b-0 md:border-r dark:border-white/10 dark:bg-[#1b1c1e]">
        <div className="px-4 pb-2 pt-4">
          <h1 className="text-[20px] font-bold leading-none">The Journey</h1>
          <p className="mt-1 text-[12px] text-zinc-500 dark:text-zinc-400">
            Home → Durham. Each stop, a little further out.
          </p>
        </div>
        <ol className="flex gap-2 overflow-x-auto px-3 pb-3 md:block md:max-h-[calc(100%-64px)] md:space-y-1 md:overflow-y-auto md:px-2">
          {journey.map((s, i) => {
            const on = s.id === activeId;
            return (
              <li key={s.id} className="shrink-0 md:shrink">
                <button
                  onClick={() => setActiveId(s.id)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors ${
                    on ? "bg-[#0a84ff]/12 dark:bg-[#0a84ff]/22" : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-black/[0.06] text-[14px] dark:bg-white/10">
                    {s.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className={`block truncate text-[13px] font-semibold leading-tight ${on ? "text-[#0a84ff]" : ""}`}>
                      {s.title}
                    </span>
                    <span className="block truncate text-[11px] leading-tight text-zinc-500 dark:text-zinc-400">
                      {s.period}
                    </span>
                  </span>
                  <span className="ml-auto hidden text-[11px] tabular-nums text-zinc-400 md:block">{i + 1}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      {/* Map + detail card */}
      <div className="relative min-h-0 flex-1">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />

        <div className="pointer-events-none absolute inset-x-3 bottom-6 z-[500] md:left-4 md:right-auto md:max-w-sm">
          <div className="pointer-events-auto rounded-2xl bg-white/85 p-4 shadow-xl ring-1 ring-black/10 backdrop-blur-xl dark:bg-black/60 dark:ring-white/15">
            <div className="flex items-baseline gap-2">
              <span className="text-[17px]">{active.emoji}</span>
              <h2 className="text-[16px] font-bold leading-tight">{active.title}</h2>
            </div>
            <div className="mt-0.5 text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
              {active.place} · {active.period}
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-zinc-700 dark:text-zinc-200">{active.caption}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
