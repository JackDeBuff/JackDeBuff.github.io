import { useEffect, useMemo, useState, type ReactNode } from "react";
import { photoMeta, type PhotoMeta } from "../data/photos";
import { useIsMobile } from "../state/useIsMobile";

/* --------------------------------------------------------------------------
   Discovery — every image dropped in ../photos shows up automatically.
   The <string> generic + import:"default" keep tsc happy (values are urls).
   -------------------------------------------------------------------------- */
const photoModules = import.meta.glob<string>("../photos/*.{jpg,jpeg,png,webp,gif}", {
  eager: true,
  query: "?url",
  import: "default",
});

interface Photo {
  filename: string;
  url: string;
  meta: PhotoMeta;
}

const ALL_PHOTOS: Photo[] = Object.entries(photoModules)
  .map(([path, url]) => {
    const filename = path.split("/").pop()!;
    return { filename, url, meta: photoMeta[filename] ?? {} };
  })
  // date desc where present (empty date sorts last), then filename asc
  .sort((a, b) => {
    const da = a.meta.date ?? "";
    const db = b.meta.date ?? "";
    if (da !== db) return db.localeCompare(da);
    return a.filename.localeCompare(b.filename);
  });

const titleOf = (p: Photo) => p.meta.title ?? p.filename.replace(/\.[^.]+$/, "");

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

/* ---------------------------------- glyphs -------------------------------- */
const glyphProps = {
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function ClockGlyph() {
  return (
    <svg {...glyphProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function HeartGlyph({ filled }: { filled?: boolean }) {
  return (
    <svg {...glyphProps} fill={filled ? "currentColor" : "none"}>
      <path d="M12 20s-7-4.6-7-9.4A3.9 3.9 0 0 1 12 7a3.9 3.9 0 0 1 7 3.6C19 15.4 12 20 12 20z" />
    </svg>
  );
}
function FolderGlyph() {
  return (
    <svg {...glyphProps}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

/* ------------------------------- heart button ----------------------------- */
function HeartButton({
  liked,
  onToggle,
  className = "",
}: {
  liked: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={liked ? "Remove from Favorites" : "Add to Favorites"}
      className={`grid place-items-center rounded-full transition ${
        liked ? "text-red-500" : "text-white/90 hover:text-white"
      } ${className}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20s-7-4.6-7-9.4A3.9 3.9 0 0 1 12 7a3.9 3.9 0 0 1 7 3.6C19 15.4 12 20 12 20z" />
      </svg>
    </button>
  );
}

/* ================================ main app ================================ */
export default function Photos() {
  const isMobile = useIsMobile();
  const [album, setAlbum] = useState<string>("Library");
  const [liked, setLiked] = useState<Set<string>>(
    () => new Set(ALL_PHOTOS.filter((p) => p.meta.liked).map((p) => p.filename)),
  );
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const toggleLike = (filename: string) =>
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(filename)) next.delete(filename);
      else next.add(filename);
      return next;
    });

  const albums = useMemo(() => {
    const names = [...new Set(ALL_PHOTOS.map((p) => p.meta.album).filter(Boolean))] as string[];
    return [
      { id: "Library", glyph: <ClockGlyph />, count: ALL_PHOTOS.length },
      { id: "Favorites", glyph: <HeartGlyph />, count: liked.size },
      ...names.map((name) => ({
        id: name,
        glyph: <FolderGlyph />,
        count: ALL_PHOTOS.filter((p) => p.meta.album === name).length,
      })),
    ];
  }, [liked]);

  const shown = useMemo(
    () =>
      ALL_PHOTOS.filter((p) => {
        if (album === "Library") return true;
        if (album === "Favorites") return liked.has(p.filename);
        return p.meta.album === album;
      }),
    [album, liked],
  );

  // Keep the lightbox in range when the visible set changes.
  useEffect(() => {
    if (lightboxIdx !== null && lightboxIdx >= shown.length) setLightboxIdx(null);
  }, [shown.length, lightboxIdx]);

  const openPhoto = shown[lightboxIdx ?? -1] ?? null;

  // Keyboard: Esc closes, arrows navigate (only while open).
  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      else if (e.key === "ArrowRight") setLightboxIdx((i) => (i === null ? i : (i + 1) % shown.length));
      else if (e.key === "ArrowLeft")
        setLightboxIdx((i) => (i === null ? i : (i - 1 + shown.length) % shown.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, shown.length]);

  return (
    <div className="relative flex h-full bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      {isMobile ? (
        <MobileLayout
          albums={albums}
          album={album}
          setAlbum={setAlbum}
          shown={shown}
          liked={liked}
          onOpen={setLightboxIdx}
        />
      ) : (
        <DesktopLayout
          albums={albums}
          album={album}
          setAlbum={setAlbum}
          shown={shown}
          liked={liked}
          toggleLike={toggleLike}
          onOpen={setLightboxIdx}
        />
      )}

      {openPhoto && (
        <Lightbox
          photo={openPhoto}
          liked={liked.has(openPhoto.filename)}
          onToggleLike={() => toggleLike(openPhoto.filename)}
          onClose={() => setLightboxIdx(null)}
          onPrev={
            shown.length > 1
              ? () => setLightboxIdx((i) => (i === null ? i : (i - 1 + shown.length) % shown.length))
              : undefined
          }
          onNext={
            shown.length > 1
              ? () => setLightboxIdx((i) => (i === null ? i : (i + 1) % shown.length))
              : undefined
          }
        />
      )}
    </div>
  );
}

/* ----------------------------- shared sub-types --------------------------- */
interface AlbumEntry {
  id: string;
  glyph: ReactNode;
  count: number;
}
interface LayoutProps {
  albums: AlbumEntry[];
  album: string;
  setAlbum: (a: string) => void;
  shown: Photo[];
  liked: Set<string>;
  onOpen: (i: number) => void;
}

/* ================================ desktop ================================= */
function DesktopLayout({
  albums,
  album,
  setAlbum,
  shown,
  liked,
  toggleLike,
  onOpen,
}: LayoutProps & { toggleLike: (f: string) => void }) {
  return (
    <>
      <aside className="glass-thin flex w-44 shrink-0 flex-col overflow-y-auto p-2">
        <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Library
        </p>
        {albums.map((a) => {
          const active = album === a.id;
          return (
            <button
              key={a.id}
              onClick={() => setAlbum(a.id)}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] font-medium transition-colors ${
                active
                  ? "bg-blue-500/90 text-white"
                  : "text-zinc-700 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10"
              }`}
            >
              <span className={active ? "text-white" : "text-zinc-500 dark:text-zinc-400"}>{a.glyph}</span>
              <span className="flex-1 truncate">{a.id}</span>
              <span className={`text-[11px] tabular-nums ${active ? "text-white/80" : "text-zinc-400"}`}>
                {a.count}
              </span>
            </button>
          );
        })}
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-baseline gap-2 border-b border-black/5 px-4 py-3 dark:border-white/10">
          <h1 className="text-lg font-bold">{album}</h1>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {shown.length} {shown.length === 1 ? "photo" : "photos"}
          </span>
        </header>

        {shown.length === 0 ? (
          <EmptyState album={album} />
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <div className="grid gap-1.5 [grid-template-columns:repeat(auto-fill,minmax(128px,1fr))]">
              {shown.map((p, i) => (
                <div
                  key={p.filename}
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpen(i)}
                  onKeyDown={(e) => e.key === "Enter" && onOpen(i)}
                  style={{ animationDelay: `${Math.min(i, 12) * 25}ms` }}
                  className="photo-in group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-[10px] ring-1 ring-black/5 transition-transform duration-200 hover:scale-[1.03] dark:ring-white/10"
                >
                  <img
                    src={p.url}
                    alt={titleOf(p)}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  {/* hover overlay: title + heart */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="truncate text-[11px] font-medium text-white drop-shadow">
                      {titleOf(p)}
                    </span>
                    <span className="pointer-events-auto shrink-0">
                      <HeartButton liked={liked.has(p.filename)} onToggle={() => toggleLike(p.filename)} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

/* ================================= mobile ================================= */
function MobileLayout({ albums, album, setAlbum, shown, onOpen }: LayoutProps) {
  return (
    <div className="flex h-full w-full flex-col">
      <header className="px-4 pb-2 pt-3">
        <h1 className="text-[28px] font-bold tracking-tight">Photos</h1>
      </header>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
        {albums.map((a) => {
          const active = album === a.id;
          return (
            <button
              key={a.id}
              onClick={() => setAlbum(a.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                active
                  ? "bg-blue-500 text-white"
                  : "bg-black/[0.06] text-zinc-700 dark:bg-white/10 dark:text-zinc-200"
              }`}
            >
              {a.id}
              <span className={active ? "ml-1.5 text-white/70" : "ml-1.5 text-zinc-400"}>{a.count}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <EmptyState album={album} />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-0.5">
          <div className="grid grid-cols-3 gap-0.5">
            {shown.map((p, i) => (
              <button
                key={p.filename}
                onClick={() => onOpen(i)}
                style={{ animationDelay: `${Math.min(i, 12) * 25}ms` }}
                className="photo-in relative aspect-square overflow-hidden"
              >
                <img
                  src={p.url}
                  alt={titleOf(p)}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =============================== empty state ============================== */
function EmptyState({ album }: { album: string }) {
  return (
    <div className="grid flex-1 place-items-center p-8 text-center">
      <div className="space-y-2">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-black/[0.05] text-zinc-400 dark:bg-white/10">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="8.5" cy="10" r="1.5" />
            <path d="m5 17 5-4 4 3 2-2 3 3" />
          </svg>
        </div>
        <p className="text-sm font-medium">No photos here yet</p>
        <p className="mx-auto max-w-[220px] text-xs text-zinc-500 dark:text-zinc-400">
          {album === "Favorites"
            ? "Tap the heart on a photo to add it to Favorites."
            : "Drop image files in src/photos and they'll show up automatically."}
        </p>
      </div>
    </div>
  );
}

/* ================================ lightbox ================================ */
function Lightbox({
  photo,
  liked,
  onToggleLike,
  onClose,
  onPrev,
  onNext,
}: {
  photo: Photo;
  liked: boolean;
  onToggleLike: () => void;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const desc = photo.meta.description;
  const date = formatDate(photo.meta.date);

  return (
    <div
      onClick={onClose}
      className="fade-in absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/70 p-6 backdrop-blur-xl"
    >
      {/* image — clicking it must NOT close */}
      <img
        src={photo.url}
        alt={titleOf(photo)}
        onClick={(e) => e.stopPropagation()}
        className="lightbox-in max-h-[62%] max-w-full rounded-xl object-contain shadow-2xl"
      />

      {/* nav chevrons */}
      {onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous photo"
          className="glass absolute left-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-white/90 hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>
      )}
      {onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next photo"
          className="glass absolute right-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-white/90 hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      )}

      {/* glass info panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass w-full max-w-md rounded-2xl px-5 py-3 text-white"
      >
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[15px] font-semibold">{titleOf(photo)}</h2>
            {desc && <p className="mt-0.5 text-[13px] leading-snug text-white/70">{desc}</p>}
            {date && <p className="mt-1 text-[11px] text-white/50">{date}</p>}
          </div>
          <HeartButton liked={liked} onToggle={onToggleLike} className="mt-0.5 shrink-0" />
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-white/15 px-4 py-1 text-[13px] font-medium text-white transition hover:bg-white/25"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
