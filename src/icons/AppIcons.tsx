import type { ReactNode } from "react";
import notesIcon from "./app-icons/notes.webp";
import terminalIcon from "./app-icons/terminal.webp";
import settingsIcon from "./app-icons/settings.webp";
import photosIcon from "./app-icons/photos.webp";
import safariIcon from "./app-icons/safari.webp";
import trashIcon from "./app-icons/trash.webp";
import stocksIcon from "./app-icons/stocks.webp";
import mapsIcon from "./app-icons/maps.webp";
import githubIcon from "./app-icons/github.webp";
import footmobIcon from "./app-icons/footmob.webp";
import messagesIcon from "./app-icons/messages.webp";

/**
 * App icons: real macOS-style icon images (downscaled WebP, adapted from the
 * MIT-licensed aakashsharma003/macOS-Portfolio repo) plus a few hand-drawn
 * SVG tiles. The PoopLogo system mark is Jack's own — never an Apple asset.
 * Squircle tiles use a superellipse-ish radius with layered glass shine.
 */

/** Renders a bitmap app icon. The source PNGs bake in their own squircle
 *  padding + drop shadow; the SVG Squircle below uses the same ~80% tile
 *  footprint so both families render at identical optical size. */
function AppIconImg({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-contain"
      draggable={false}
    />
  );
}

function Squircle({
  children,
  gradient,
  id,
}: {
  children?: ReactNode;
  gradient: [string, string];
  id: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={gradient[0]} />
          <stop offset="1" stopColor={gradient[1]} />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-ds`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter={`url(#${id}-ds)`}>
        {/* Real macOS icon-grid tile: 80% footprint, corner radius ≈ 22.4% of
            the tile — matches the bitmap icons (Notes/Terminal/Settings/Photos)
            so all app icons share one silhouette. */}
        <rect x="10" y="10" width="80" height="80" rx="18" fill={`url(#${id}-g)`} />
        <rect x="10" y="10" width="80" height="80" rx="18" fill={`url(#${id}-shine)`} />
        <rect
          x="10.5"
          y="10.5"
          width="79"
          height="79"
          rx="17.6"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.22"
          strokeWidth="1"
        />
      </g>
      {/* glyphs were drawn for the old full-bleed tile — shrink to the new tile */}
      <g transform="translate(50 50) scale(0.8) translate(-50 -50)">{children}</g>
    </svg>
  );
}

/** "Jack's Notes" — Apple Notes mark. */
export function NotesIcon() {
  return <AppIconImg src={notesIcon} alt="Notes" />;
}

/** Safari — real macOS compass icon (bitmap, same source repo). */
export function SafariIcon() {
  return <AppIconImg src={safariIcon} alt="Safari" />;
}

export function TerminalIcon() {
  return <AppIconImg src={terminalIcon} alt="Terminal" />;
}

export function SettingsIcon() {
  return <AppIconImg src={settingsIcon} alt="System Settings" />;
}

export function PhotosIcon() {
  return <AppIconImg src={photosIcon} alt="Photos" />;
}

/** YouTube Music — official mark: light squircle tile, red disc with a thin
 *  white ring inside, and a white play triangle nudged optically right. */
export function MusicIcon() {
  return (
    <Squircle id="ytm" gradient={["#ffffff", "#f1f1f2"]}>
      <circle cx="50" cy="50" r="30" fill="#FF0000" />
      <circle cx="50" cy="50" r="20" fill="none" stroke="#fff" strokeWidth="4" />
      <path d="M45 40 L64 50 L45 60 Z" fill="#fff" />
    </Squircle>
  );
}

/** Stocks — real macOS Stocks icon (bitmap, macosicons.com). */
export function StocksIcon() {
  return <AppIconImg src={stocksIcon} alt="Stocks" />;
}

/** Maps — real macOS Tahoe Maps icon (bitmap, macosicons.com). */
export function MapsIcon() {
  return <AppIconImg src={mapsIcon} alt="Maps" />;
}

/** Trash — real macOS-style metallic bin bitmap (aakash icon set). */
export function TrashIcon() {
  return <AppIconImg src={trashIcon} alt="Trash" />;
}

/** FootMob (Lineup) — real FotMob macOS icon (bitmap, macosicons.com). */
export function LineupIcon() {
  return <AppIconImg src={footmobIcon} alt="FootMob" />;
}

/** GitHub — real macOS-style GitHub icon (bitmap, macosicons.com). */
export function GithubIcon() {
  return <AppIconImg src={githubIcon} alt="GitHub" />;
}

export function MessagesIcon() {
  return <AppIconImg src={messagesIcon} alt="Messages" />;
}

export function LinkedinIcon() {
  return (
    <Squircle id="li" gradient={["#0A8BD4", "#0288D1"]}>
      <g transform="translate(50 50) scale(2.0833) translate(-24 -24)">
        <path
          fill="#fff"
          d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"
        />
      </g>
    </Squircle>
  );
}

/**
 * The system logo: Jack's soft-serve mark 💩 — vector-traced from his own
 * poop_512.png (potrace), rendered with currentColor.
 */
export function PoopLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="60 60 392 392" className={className} fill="currentColor" aria-label="jackOS logo">
      <path
        fillRule="evenodd"
        d="M 266.996 92.767 C 261.606 119.901, 252.432 135.972, 234.729 149.295 C 230.753 152.287, 217.150 160.913, 204.500 168.463 C 169.502 189.352, 157.093 199.921, 149.508 215.302 C 134.730 245.269, 152.879 276.656, 191.500 287.928 C 225.115 297.738, 304.160 297.391, 336.500 287.291 C 366.110 278.044, 382.252 259.856, 378.987 239.420 C 375.349 216.644, 362.951 203.383, 336.606 194.092 C 331.714 192.366, 327.619 191.077, 327.505 191.227 C 327.392 191.377, 325.838 194.276, 324.053 197.669 C 311.649 221.246, 287.508 235.828, 257.798 237.689 L 248.096 238.296 244.548 234.748 C 236.001 226.201, 242.550 217.020, 257.218 216.985 C 281.705 216.928, 305.084 199.671, 309.462 178.422 C 317.373 140.025, 302.900 104.880, 272.817 89.438 L 268.135 87.035 266.996 92.767 M 117.716 262.919 C 91.713 278.772, 78.750 294.479, 74.559 315.208 C 70.028 337.611, 74.747 352.766, 91.479 369.549 C 129.141 407.329, 205.883 425.430, 296.500 417.907 C 388.043 410.307, 442.032 376.032, 441.993 325.540 C 441.974 300.973, 430.696 279.435, 411.500 267.310 C 406.500 264.152, 398.144 260.417, 397.660 261.125 C 397.519 261.331, 395.686 265.044, 393.585 269.375 C 382.731 291.763, 356.877 306.353, 316.804 312.708 C 300.394 315.310, 225.710 315.323, 210 312.726 C 168.747 305.908, 144.285 291.325, 131.601 265.987 L 127.177 257.150 117.716 262.919"
      />
    </svg>
  );
}
