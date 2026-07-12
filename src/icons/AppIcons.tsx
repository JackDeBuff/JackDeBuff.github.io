import type { ReactNode } from "react";

/**
 * Hand-drawn macOS-Tahoe-style squircle icons (no Apple assets).
 * Every icon = gradient base + glass top highlight + hairline inner border.
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
    <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={gradient[0]} />
          <stop offset="1" stopColor={gradient[1]} />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.36" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="96" height="96" rx="22" fill={`url(#${id}-g)`} />
      <rect x="2" y="2" width="96" height="96" rx="22" fill={`url(#${id}-shine)`} />
      <rect
        x="2.5"
        y="2.5"
        width="95"
        height="95"
        rx="21.5"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      {children}
    </svg>
  );
}

export function AboutIcon() {
  return (
    <Squircle id="about" gradient={["#5AC8FA", "#0A84FF"]}>
      {/* original "contact card" face — inspired by, not copied from, Finder */}
      <circle cx="50" cy="41" r="14" fill="#fff" />
      <path d="M24 82 C24 62 40 58 50 58 C60 58 76 62 76 82 Z" fill="#fff" />
    </Squircle>
  );
}

export function ChromeIcon() {
  return (
    <Squircle id="chrome" gradient={["#f4f4f5", "#d4d4d8"]}>
      <g transform="translate(50 50)">
        <circle r="34" fill="#fff" />
        <path d="M0 -34 A34 34 0 0 1 29.4 17 L12.1 7 A14 14 0 0 0 0 -14 Z" fill="#EA4335" transform="rotate(0)" />
        <path d="M0 -34 A34 34 0 0 1 29.4 17 L12.1 7 A14 14 0 0 0 0 -14 Z" fill="#4285F4" transform="rotate(120)" />
        <path d="M0 -34 A34 34 0 0 1 29.4 17 L12.1 7 A14 14 0 0 0 0 -14 Z" fill="#FBBC05" transform="rotate(240)" />
        <circle r="14" fill="#fff" />
        <circle r="11" fill="#4285F4" />
      </g>
    </Squircle>
  );
}

export function TerminalIcon() {
  return (
    <Squircle id="term" gradient={["#3f3f46", "#111114"]}>
      <text x="22" y="52" fontFamily="ui-monospace, Menlo, monospace" fontSize="30" fontWeight="700" fill="#34d399">
        &gt;
      </text>
      <rect x="44" y="46" width="24" height="6" rx="2" fill="#e4e4e7" />
    </Squircle>
  );
}

export function SettingsIcon() {
  return (
    <Squircle id="cfg" gradient={["#e5e7eb", "#9ca3af"]}>
      <g transform="translate(50 50)" fill="#52525b">
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="-5" y="-33" width="10" height="14" rx="3" transform={`rotate(${i * 45})`} />
        ))}
        <circle r="22" fill="#52525b" />
        <circle r="10" fill="#d4d4d8" />
      </g>
    </Squircle>
  );
}

export function MusicIcon() {
  return (
    <Squircle id="ytm" gradient={["#2b2b2e", "#0f0f10"]}>
      <circle cx="50" cy="50" r="30" fill="none" stroke="#FF0033" strokeWidth="7" />
      <path d="M42 36 L68 50 L42 64 Z" fill="#FF0033" />
    </Squircle>
  );
}

export function GithubIcon() {
  return (
    <Squircle id="gh" gradient={["#3d4450", "#171B22"]}>
      <path
        transform="translate(26 26) scale(2)"
        fill="#fff"
        d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3Z"
      />
    </Squircle>
  );
}

export function LinkedinIcon() {
  return (
    <Squircle id="li" gradient={["#0A8BD4", "#0A66C2"]}>
      <text x="50" y="66" textAnchor="middle" fontFamily="-apple-system, Helvetica, Arial" fontSize="46" fontWeight="800" fill="#fff">
        in
      </text>
    </Squircle>
  );
}

/** Simple original apple-ish silhouette for menu bar / boot (drawn from primitives). */
export function AppleLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" aria-label="apple logo">
      <path d="M63 26c-6 0-9 3.5-13 3.5S43.5 26 37.5 26C28 26 19 34 19 49c0 16 11 33 18.5 33 4 0 5.5-2.5 11.5-2.5S66 82 70 82c7.5 0 17-16 18.5-24-9-3.5-12.5-10-12.5-16.5 0-6 3-11 7.5-13.5C80 30 73 26 63 26Z" />
      <path d="M62 8c1 6-3 14-10 15-1.5-7 4-14 10-15Z" />
    </svg>
  );
}
