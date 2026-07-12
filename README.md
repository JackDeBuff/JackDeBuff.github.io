# jackdebuff.github.io

A macOS-style interactive portfolio — boot it, log in, and explore Jack's work through a desktop OS in the browser.

**Live:** https://jackdebuff.github.io

## Stack

Vite · React 18 · TypeScript · Tailwind CSS · zustand · react-rnd. Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Customizing

- **Wallpapers** — drop images into `public/wallpapers/` and register them in `src/state/settings.ts`.
- **Playlist** — set `YT_PLAYLIST_ID` in `src/data/profile.ts`.
- **Content** — everything about Jack lives in `src/data/profile.ts`.

## Credits

Concept inspired by [vivek9patel's Ubuntu portfolio](https://github.com/vivek9patel/vivek9patel.github.io) (MIT). App icons adapted from [aakashsharma003/macOS-Portfolio](https://github.com/aakashsharma003/macOS-Portfolio) (MIT). UI is an original homage to macOS Tahoe — no Apple assets are used.
