import { YT_PLAYLIST_ID } from "../data/profile";

/**
 * YouTube Music–styled player. Real YT Music can't be embedded, so this wraps
 * a YouTube playlist embed in a YTM-like dark shell. Swap YT_PLAYLIST_ID in
 * src/data/profile.ts for Jack's real playlist.
 */
export default function YouTubeMusic() {
  return (
    <div className="flex h-full flex-col bg-[#030303] text-zinc-100">
      {/* YTM-style header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 100 100" className="h-6 w-6">
            <circle cx="50" cy="50" r="46" fill="#FF0033" />
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

      {/* Playlist embed */}
      <div className="min-h-0 flex-1">
        <iframe
          className="h-full w-full border-0"
          src={`https://www.youtube-nocookie.com/embed/videoseries?list=${YT_PLAYLIST_ID}&rel=0`}
          title="Jack's playlist"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Player bar */}
      <div className="flex items-center gap-3 border-t border-white/10 px-4 py-2 text-zinc-400">
        <span className="text-lg">⏮</span>
        <span className="text-2xl text-white">▶</span>
        <span className="text-lg">⏭</span>
        <div className="mx-3 h-1 flex-1 rounded-full bg-white/15">
          <div className="h-full w-1/3 rounded-full bg-[#FF0033]" />
        </div>
        <span className="text-xs">Jack's favourites · playlist</span>
      </div>
    </div>
  );
}
