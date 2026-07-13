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

Concept inspired by [vivek9patel's Ubuntu portfolio](https://github.com/vivek9patel/vivek9patel.github.io) (MIT). App icons adapted from [aakashsharma003/macOS-Portfolio](https://github.com/aakashsharma003/macOS-Portfolio) (MIT). LinkedIn icon by [Icons8](https://icons8.com). Wallpapers from [vinceliuice/WhiteSur-wallpapers](https://github.com/vinceliuice/WhiteSur-wallpapers). UI is an original homage to macOS Tahoe — no Apple assets are used.

## License

The MIT license in this repository applies only to the source code and to assets adapted from other MIT-licensed projects (app icons from aakashsharma003/macOS-Portfolio, concept from vivek9patel's portfolio). The photos in `src/photos/` are **not** covered and are not free to use: some are Jack's personal assets, some are internet memes, and some are *The Legend of Zelda* in-game screenshots included under fair use.
