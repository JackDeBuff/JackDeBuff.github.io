export interface PhotoMeta {
  title?: string;
  description?: string;
  /** ISO date, e.g. "2025-11-02" — used for sorting and the info panel. */
  date?: string;
  album?: string;
  liked?: boolean;
}

/**
 * Optional metadata for photos, keyed by their exact filename (with extension)
 * as it sits in `src/photos/`. Files without an entry still show up — they just
 * fall back to the filename (minus extension) as their title.
 */
export const photoMeta: Record<string, PhotoMeta> = {
  "sequoia-dusk-evening.webp": {
    title: "Dusk over the Ridge",
    description:
      "The last light bleeding purple behind the peaks. Waited an hour for the moon to peek out — worth it.",
    date: "2025-11-14",
    album: "Landscapes",
    liked: true,
  },
  "lake-tahoe-night.webp": {
    title: "Midnight at the Lake",
    description:
      "A cold clear night by the water. You could see every star, and one very smug moon.",
    date: "2025-10-02",
    album: "Landscapes",
  },
  "tahoe-blue-morning.webp": {
    title: "Blue Morning Hike",
    description: "Clear skies, easy trail, no one else around. The good kind of quiet.",
    date: "2026-03-21",
    album: "Adventures",
    liked: true,
  },
  "mint-hills-daydream.webp": {
    title: "Mint Daydream",
    description: "Not sure this is a real place, but it should be.",
    date: "2026-05-09",
    album: "Adventures",
  },
};
