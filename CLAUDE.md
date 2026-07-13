# CLAUDE.md — jackdebuff.github.io

macOS Tahoe desktop simulation as Jack's portfolio. Live at https://jackdebuff.github.io, deployed by GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`.

## Stack & commands

Vite + React 18 + TypeScript + Tailwind (dark mode = `dark` class; `light` class also set) + zustand + react-rnd. Zero other runtime deps — no framer-motion; all animations are CSS (transform/opacity only).

- `npm run dev` — dev server (use `.claude/launch.json` "portfolio", port 5199)
- `npm run build` — tsc + vite build (run before pushing)

## Git / auth

No `gh` CLI. Push works via macOS keychain (`git push origin main`). Token if needed: `security find-internet-password -s github.com -g` (repo+workflow scope). Commit as Supawich Puengdang <supawich@gmail.com>.

## Where things live

- **All personal content**: `src/data/profile.ts` (bio, education, KBTG experience, publications, awards, skills, `YT_PLAYLIST_ID`)
- Terminal fake filesystem: `src/data/filesystem.ts` (derived from profile)
- Resume PDF: `public/resume.pdf` (embedded in Notes → Resume note, full-bleed)
- Photos: drop images into `src/photos/` (auto-discovered via `import.meta.glob`); captions/albums in `src/data/photos.ts` keyed by filename
- Wallpapers: `public/wallpapers/*.svg`, registered in `src/state/settings.ts` (default: `sequoia-dusk`; Jack may drop real images later)
- OS shell: `src/os/` (BootScreen, LockScreen, Desktop, MenuBar, Dock, Window, DesktopIcon, AboutThisMac)
- Mobile iOS shell: `src/mobile/` (MobileShell, MobileStatusBar, MobileHome, MobileDock, MobileAppSheet)
- Apps: `src/apps/` registered in `apps.config.tsx` (id/title/mobileTitle/icon/dock/desktop/external/component). Legacy ids are load-bearing: "Notes" = id `about`, "Safari" = id `chrome` (Terminal `open` + window state depend on them; Terminal also aliases `open safari`). `mobileTitle` shortens home-grid labels (System Settings → "Settings")
- Icons: `src/icons/AppIcons.tsx` — app icons are downscaled WebP bitmaps in `src/icons/app-icons/` (Notes/Safari/Terminal/Settings/Photos, wrapped by `AppIconImg`); `MusicIcon` (official YT Music mark) and the social tiles are hand-drawn SVG on the shared `Squircle`. **Squircle geometry must match the bitmaps**: 80% tile footprint, corner radius ≈ 22.4% of tile (rx=18 on an 80×80 tile) — all icons share one silhouette. `PoopLogo` = system logo, vector-traced from Jack's poop_512.png (replaces the Apple logo — never mention Apple in the UI)

## Design rules (Jack is serious about these)

- **App icons** are sourced from the MIT-licensed [aakashsharma003/macOS-Portfolio](https://github.com/aakashsharma003/macOS-Portfolio) repo (downscaled WebP ≤20KB each in `src/icons/app-icons/`; keep attribution in README + Settings→About). **Wallpapers and fonts are still never Apple's** — hand-drawn/self-hosted only. The poop logo remains the system logo (never the Apple logo; never mention Apple in the UI). Everything should look/feel as close to real macOS Tahoe / iOS as possible.
- Liquid Glass = `.liquid-glass` class in `src/index.css` + SVG `#lg-distortion` filter in `App.tsx` (refraction wobble is Chromium-only; degrades gracefully). Jack **loves** the clear, ultra-transparent dark-glass look — `.liquid-glass-dim` pins that dark recipe even in light mode for surfaces over dark backdrops (lock screen). The specular rim must stay a uniform 1px hairline (Jack flagged a thicker top-left edge as un-Apple; keep `inset 1px 1px …` / `inset -1px -1px …`). Design tokens (`--lg-*`, `--shadow-*`, `--radius-*`, easings) live in `:root`/`.light` in index.css; every new token needs a `.light` override.
- Dock: static icons, blink-dim on click — **no magnification** (Jack explicitly removed it)
- Animations on transform/opacity only, easings in `:root` CSS vars
- Both light and dark mode must look right (check dropdowns/text contrast in both)
- Desktop icons: two-line labels allowed, selection = large plate + blue label pill

## Behavior notes

- **Mobile (<768px) is an iOS shell**, not a shrunken macOS: status bar + app-grid home screen + liquid-glass dock pill; apps open as full-screen slide-up sheets closed via the home indicator. The branch happens at App level (whole tree remounts across the breakpoint — that's what keeps react-rnd from crashing on controlled/uncontrolled prop switches). Sheets have **no title bar** for any app (apps carry their own headers, like real iOS); `BARE_DARK_APPS` in MobileAppSheet (music, terminal) additionally get a black sheet + white status bar. The sheet home indicator uses `mix-blend-difference` **on the button** (a blend on the inner span would be isolated by the button's own stacking context and always render white) — white over dark apps, dark over light apps. Its tap area is a narrow centered strip (`w-48`), NOT full-width — a full-width strip sat on top of the Music player controls and made taps close the app.
- Lock screen: desktop = click/Enter with a `liquid-glass liquid-glass-dim` pill; mobile = iOS swipe-up-to-unlock (Pointer Events, finger-follow, 90px threshold, spring-back; bare shimmer text, no avatar/name on mobile).
- Notes (app id `about`): Apple Notes clone — desktop list pane + paper content pane with amber selection; mobile iOS push nav (liquid-glass ‹ back button + left-edge swipe-back armed only within 24px of the edge). Content derives from profile.ts.
- About This Mac: `src/os/AboutThisMac.tsx` glass panel from the poop menu (desktop only); Settings→About mirrors the same specs. Specs are jokes but never mention Apple.
- Safari app (id `chrome`, file `src/apps/Chrome.tsx`): iframe browser; Google via `webhp?igu=1`; Wikipedia bookmark geo-IPs the visitor's country via `ipwho.is` (no permission prompt), falls back to Thailand; "Gut Genug 🎶" bookmark = Jack's favorite song at t=14s. The "some sites refuse to load" hint is desktop-only; bookmarks bar is a single scrollable row on mobile.
- YouTube Music: IFrame API, full tracklist sidebar, titles via noembed.com. Player-bar controls must be SVG — unicode ⏮▶⏭ render as blue emoji on iOS; extra bottom padding on mobile keeps them clear of the home indicator
- Terminal: ls/cd/cat/open/neofetch + Tab autocomplete (commands, paths, app names). On mobile: no autofocus (tap to summon keyboard) and 16px font — sub-16px inputs trigger iOS Safari's focus auto-zoom; don't reintroduce it.
- Photos: albums sidebar (desktop) / chips + 3-col grid (mobile), lightbox with glass info panel, ←/→ navigation
- Automation quirk: browser-tool coordinate clicks don't fire React onClick here — use element refs/`.click()` when testing (drags DO work for the swipe gestures)

## Related

- Profile README repo: `~/Projects/JackDeBuff` (separate; has its own Actions for snake/metrics)
- Inspiration credit: vivek9patel.github.io (MIT) — keep attribution in README/Settings→About
