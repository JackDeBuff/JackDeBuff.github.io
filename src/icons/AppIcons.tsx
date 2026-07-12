import type { ReactNode } from "react";

/**
 * Hand-drawn macOS-style icons (no Apple assets).
 * Squircle tiles use a superellipse-ish radius with layered glass shine.
 */

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
        {/* macOS-style continuous corner: pseudo-superellipse via high-radius rounded rect */}
        <path
          d="M50 4 C 77 4 96 4 96 50 C 96 96 77 96 50 96 C 23 96 4 96 4 50 C 4 4 23 4 50 4 Z"
          fill={`url(#${id}-g)`}
        />
        <path
          d="M50 4 C 77 4 96 4 96 50 C 96 96 77 96 50 96 C 23 96 4 96 4 50 C 4 4 23 4 50 4 Z"
          fill={`url(#${id}-shine)`}
        />
        <path
          d="M50 4.5 C 76.7 4.5 95.5 4.5 95.5 50 C 95.5 95.5 76.7 95.5 50 95.5 C 23.3 95.5 4.5 95.5 4.5 50 C 4.5 4.5 23.3 4.5 50 4.5 Z"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.22"
          strokeWidth="1"
        />
      </g>
      {children}
    </svg>
  );
}

/** Modern macOS-style folder for "About Jack" (standalone folder glyph, like a real Finder folder). */
export function AboutIcon() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <defs>
        <linearGradient id="fold-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3E9BF4" />
          <stop offset="1" stopColor="#1D6FDB" />
        </linearGradient>
        <linearGradient id="fold-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7CC2FB" />
          <stop offset="1" stopColor="#3D8FEF" />
        </linearGradient>
        <filter id="fold-ds" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#fold-ds)">
        {/* back panel with tab */}
        <path
          d="M8 34 q0 -8 8 -8 h20 q4 0 6.5 3 l4.5 5.5 h37 q8 0 8 8 v3 H8 Z"
          fill="url(#fold-back)"
        />
        {/* front body */}
        <rect x="8" y="40" width="84" height="42" rx="9" fill="url(#fold-front)" />
        <rect x="8" y="40" width="84" height="10" rx="5" fill="#fff" opacity="0.18" />
        {/* face — a friendly hint that it's about a person */}
        <circle cx="50" cy="57" r="6.5" fill="#fff" opacity="0.95" />
        <path d="M38 76 c0-8 7-11 12-11 s12 3 12 11 Z" fill="#fff" opacity="0.95" />
      </g>
    </svg>
  );
}

export function ChromeIcon() {
  return (
    <Squircle id="chrome" gradient={["#f4f4f5", "#d4d4d8"]}>
      <g transform="translate(50 50)">
        <circle r="32" fill="#fff" />
        <path d="M0 -32 A32 32 0 0 1 27.7 16 L11.4 6.6 A13.2 13.2 0 0 0 0 -13.2 Z" fill="#EA4335" />
        <path d="M0 -32 A32 32 0 0 1 27.7 16 L11.4 6.6 A13.2 13.2 0 0 0 0 -13.2 Z" fill="#4285F4" transform="rotate(120)" />
        <path d="M0 -32 A32 32 0 0 1 27.7 16 L11.4 6.6 A13.2 13.2 0 0 0 0 -13.2 Z" fill="#FBBC05" transform="rotate(240)" />
        <circle r="13.2" fill="#fff" />
        <circle r="10.4" fill="#4285F4" />
      </g>
    </Squircle>
  );
}

export function TerminalIcon() {
  return (
    <Squircle id="term" gradient={["#3f3f46", "#101013"]}>
      <text x="22" y="52" fontFamily="ui-monospace, Menlo, monospace" fontSize="28" fontWeight="700" fill="#34d399">
        &gt;
      </text>
      <rect x="42" y="46" width="22" height="6" rx="2" fill="#e4e4e7" />
    </Squircle>
  );
}

export function SettingsIcon() {
  return (
    <Squircle id="cfg" gradient={["#e5e7eb", "#9ca3af"]}>
      <g transform="translate(50 50)" fill="#52525b">
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="-5" y="-31" width="10" height="13" rx="3" transform={`rotate(${i * 45})`} />
        ))}
        <circle r="21" fill="#52525b" />
        <circle r="9.5" fill="#d4d4d8" />
      </g>
    </Squircle>
  );
}

export function MusicIcon() {
  return (
    <Squircle id="ytm" gradient={["#2b2b2e", "#0f0f10"]}>
      <circle cx="50" cy="50" r="28" fill="none" stroke="#FF0033" strokeWidth="6.5" />
      <path d="M43 37 L67 50 L43 63 Z" fill="#FF0033" />
    </Squircle>
  );
}

export function GithubIcon() {
  return (
    <Squircle id="gh" gradient={["#3d4450", "#15181e"]}>
      <path
        transform="translate(27 27) scale(1.92)"
        fill="#fff"
        d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3Z"
      />
    </Squircle>
  );
}

export function LinkedinIcon() {
  return (
    <Squircle id="li" gradient={["#0A8BD4", "#0A66C2"]}>
      <text x="50" y="64" textAnchor="middle" fontFamily="-apple-system, Helvetica, Arial" fontSize="42" fontWeight="800" fill="#fff">
        in
      </text>
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
