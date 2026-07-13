import { useEffect, useRef, useState } from "react";
import { YT_PLAYLIST_ID } from "../data/profile";

/**
 * YouTube Music–styled player with a full tracklist (Spotify-style), built on
 * the YouTube IFrame API: getPlaylist() gives video ids, playVideoAt(i) jumps
 * tracks. Titles come from noembed.com (CORS-friendly oEmbed proxy) with a
 * graceful "Track n" fallback.
 */

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface Track {
  id: string;
  title: string;
}

let apiPromise: Promise<any> | null = null;
function loadYT(): Promise<any> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve(window.YT);
      };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

export default function YouTubeMusic() {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let disposed = false;

    loadYT().then((YT) => {
      if (disposed || !hostRef.current) return;
      playerRef.current = new YT.Player(hostRef.current, {
        width: "100%",
        height: "100%",
        playerVars: { listType: "playlist", list: YT_PLAYLIST_ID, rel: 0 },
        events: {
          onReady: () => {
            const poll = setInterval(() => {
              const ids: string[] | undefined = playerRef.current?.getPlaylist?.();
              if (ids && ids.length) {
                clearInterval(poll);
                if (disposed) return;
                setTracks(ids.map((id, i) => ({ id, title: `Track ${i + 1}` })));
                ids.forEach((id, i) => {
                  fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`)
                    .then((r) => r.json())
                    .then((d) => {
                      if (!disposed && d?.title) {
                        setTracks((t) => t.map((tr, j) => (j === i ? { ...tr, title: d.title } : tr)));
                      }
                    })
                    .catch(() => {});
                });
              }
            }, 400);
          },
          onStateChange: (e: any) => {
            setPlaying(e.data === 1);
            const idx = playerRef.current?.getPlaylistIndex?.();
            if (typeof idx === "number" && idx >= 0) setCurrent(idx);
          },
        },
      });
    });

    return () => {
      disposed = true;
      playerRef.current?.destroy?.();
    };
  }, []);

  const play = (i: number) => playerRef.current?.playVideoAt?.(i);

  return (
    <div className="flex h-full flex-col bg-[#030303] text-zinc-100">
      {/* YTM-style header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 100 100" className="h-6 w-6">
            <circle cx="50" cy="50" r="46" fill="#FF0000" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#fff" strokeWidth="6" />
            <path d="M42 36 L68 50 L42 64 Z" fill="#fff" />
          </svg>
          <span className="text-lg font-semibold tracking-tight">Music</span>
        </div>
        <div className="ml-6 hidden gap-5 text-sm font-medium text-zinc-400 sm:flex">
          <span className="text-white">Home</span>
          <span>Explore</span>
          <span>Library</span>
        </div>
        <div className="ml-auto hidden w-56 rounded-full bg-white/10 px-3 py-1.5 text-xs text-zinc-500 md:block">
          Search songs, albums, artists…
        </div>
      </div>

      {/* Player + tracklist */}
      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
          <div ref={hostRef} className="h-full w-full" />
        </div>
        <aside className="hidden w-72 shrink-0 flex-col border-l border-white/10 sm:flex">
          <div className="border-b border-white/10 px-4 py-2.5">
            <p className="text-sm font-semibold">JackDeBuff</p>
            <p className="text-xs text-zinc-500">{tracks.length ? `${tracks.length} tracks · playlist` : "loading playlist…"}</p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {tracks.map((t, i) => (
              <button
                key={t.id}
                onClick={() => play(i)}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-white/10 ${
                  i === current ? "bg-white/10" : ""
                }`}
              >
                <img
                  src={`https://i.ytimg.com/vi/${t.id}/default.jpg`}
                  alt=""
                  className="h-9 w-12 shrink-0 rounded object-cover"
                  loading="lazy"
                />
                <span className={`line-clamp-2 text-xs leading-snug ${i === current ? "text-[#FF0033]" : "text-zinc-300"}`}>
                  {i === current && playing ? "▶ " : ""}
                  {t.title}
                </span>
              </button>
            ))}
          </div>
        </aside>
      </div>

      {/* Player bar — SVG glyphs (unicode ⏮▶⏭ render as blue emoji on iOS).
          Extra bottom padding on mobile keeps controls clear of the sheet's
          home-indicator tap area. */}
      <div className="flex items-center gap-5 border-t border-white/10 px-4 py-2 text-zinc-300 max-md:pb-7">
        <button
          aria-label="Previous"
          onClick={() => playerRef.current?.previousVideo?.()}
          className="transition-colors hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M6 6h2v12H6zM20 6v12l-10-6z" />
          </svg>
        </button>
        <button
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => (playing ? playerRef.current?.pauseVideo?.() : playerRef.current?.playVideo?.())}
          className="text-white"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
              <path d="M8 5l12 7-12 7z" />
            </svg>
          )}
        </button>
        <button
          aria-label="Next"
          onClick={() => playerRef.current?.nextVideo?.()}
          className="transition-colors hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M16 6h2v12h-2zM4 6v12l10-6z" />
          </svg>
        </button>
        <span className="ml-auto line-clamp-1 text-xs text-zinc-400">
          {tracks[current]?.title ?? "JackDeBuff · playlist"}
        </span>
      </div>
    </div>
  );
}
