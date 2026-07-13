import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Appearance = "dark" | "light";

export interface WallpaperDef {
  id: string;
  name: string;
  /** Path under BASE_URL, e.g. wallpapers/tahoe-night.svg — drop real .jpg files in public/wallpapers and add them here. */
  file: string;
  /** Suggested appearance pairing, used only for the thumbnail label. */
  tone: Appearance;
}

export const WALLPAPERS: WallpaperDef[] = [
  { id: "tahoe-night", name: "Tahoe Night", file: "wallpapers/tahoe-night.svg", tone: "dark" },
  { id: "tahoe-day", name: "Tahoe Day", file: "wallpapers/tahoe-day.svg", tone: "light" },
  { id: "sequoia-dusk", name: "Sequoia Dusk", file: "wallpapers/sequoia-dusk.svg", tone: "dark" },
  { id: "graphite", name: "Graphite", file: "wallpapers/graphite.svg", tone: "dark" },
  { id: "lavender", name: "Lavender", file: "wallpapers/lavender.svg", tone: "light" },
  { id: "mint", name: "Mint", file: "wallpapers/mint.svg", tone: "light" },
  { id: "whitesur", name: "WhiteSur", file: "wallpapers/WhiteSur.jpg", tone: "dark" },
  { id: "whitesur-light", name: "WhiteSur Light", file: "wallpapers/WhiteSur-light.jpg", tone: "light" },
  { id: "monterey", name: "Monterey", file: "wallpapers/Monterey.jpg", tone: "dark" },
  { id: "monterey-light", name: "Monterey Light", file: "wallpapers/Monterey-light.jpg", tone: "light" },
];

export function wallpaperUrl(id: string): string {
  const wp = WALLPAPERS.find((w) => w.id === id) ?? WALLPAPERS[0];
  return `${import.meta.env.BASE_URL}${wp.file}`;
}

interface SettingsState {
  wallpaper: string;
  appearance: Appearance;
  setWallpaper: (id: string) => void;
  setAppearance: (a: Appearance) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      wallpaper: "sequoia-dusk",
      appearance: "dark",
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setAppearance: (appearance) => set({ appearance }),
    }),
    { name: "jackos-settings" },
  ),
);
