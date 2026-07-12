# CLAUDE.md — jackdebuff.github.io

macOS Tahoe desktop simulation as Jack's portfolio. Live at https://jackdebuff.github.io, deployed by GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`.

## Stack & commands

Vite + React 18 + TypeScript + Tailwind (dark mode = `dark` class; `light` class also set) + zustand + react-rnd.

- `npm run dev` — dev server (use `.claude/launch.json` "portfolio", port 5199)
- `npm run build` — tsc + vite build (run before pushing)

## Git / auth

No `gh` CLI. Push works via macOS keychain (`git push origin main`). Token if needed: `security find-internet-password -s github.com -g` (repo+workflow scope). Commit as Supawich Puengdang <supawich@gmail.com>.

## Where things live

- **All personal content**: `src/data/profile.ts` (bio, education, KBTG experience, publications, awards, skills, `YT_PLAYLIST_ID`)
- Terminal fake filesystem: `src/data/filesystem.ts` (derived from profile)
- Resume PDF: `public/resume.pdf` (embedded in About Jack → Resume, full-bleed)
- Wallpapers: `public/wallpapers/*.svg`, registered in `src/state/settings.ts` (Jack may drop real images later)
- OS shell: `src/os/` (BootScreen, LockScreen, Desktop, MenuBar, Dock, Window, DesktopIcon)
- Apps: `src/apps/` registered in `apps.config.tsx` (id/title/icon/dock/desktop/external/component)
- Icons: `src/icons/AppIcons.tsx` — app icons are downscaled WebP bitmaps in `src/icons/app-icons/` (Finder/Terminal/Settings/Photos, wrapped by `AppIconImg`); `MusicIcon` and the social tiles stay hand-drawn SVG. `PoopLogo` = system logo, vector-traced from `~/Downloads/poop_512.png` (Jack's design, replaces the Apple logo — never mention Apple in the UI)

## Design rules (Jack is serious about these)

- **App icons** are sourced from the MIT-licensed [aakashsharma003/macOS-Portfolio](https://github.com/aakashsharma003/macOS-Portfolio) repo (downscaled WebP in `src/icons/app-icons/`). **Wallpapers and fonts are still never Apple's** — hand-drawn/self-hosted only. The poop logo remains the system logo (never the Apple logo; never mention Apple in the UI). Everything should look/feel as close to real macOS Tahoe as possible.
- Liquid Glass = `.liquid-glass` class in `src/index.css` + SVG `#lg-distortion` filter in `App.tsx` (refraction wobble is Chromium-only; degrades gracefully)
- Dock: static icons, blink-dim on click — **no magnification** (Jack explicitly removed it)
- Animations on transform/opacity only, easings in `:root` CSS vars
- Both light and dark mode must look right (check dropdowns/text contrast in both)
- Desktop icons: two-line labels allowed, selection = large plate + blue label pill

## Behavior notes

- Mobile (<768px): real OS with vertical left dock; windows open maximized; dock hides while a window is open. Window `key` includes mobile flag (react-rnd crashes if controlled/uncontrolled props switch without remount)
- Chrome app: iframe browser; Google via `webhp?igu=1`; Wikipedia bookmark geo-IPs the visitor's country via `ipwho.is` (no permission prompt), falls back to Thailand; "Gut Genug 🎶" bookmark = Jack's favorite song at t=14s
- YouTube Music: IFrame API, full tracklist sidebar, titles via noembed.com
- Terminal: ls/cd/cat/open/neofetch + Tab autocomplete (commands, paths, app names)
- Automation quirk: browser-tool coordinate clicks don't fire React onClick here — use element refs/`.click()` when testing

## Related

- Profile README repo: `~/Projects/JackDeBuff` (separate; has its own Actions for snake/metrics)
- Inspiration credit: vivek9patel.github.io (MIT) — keep attribution in README/Settings→About
