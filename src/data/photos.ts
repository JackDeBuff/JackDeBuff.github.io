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
  // Travel
  "mt-fuji-fujiq-2026.webp": {
    title: "Mt. Fuji from Fuji-Q",
    description: "Clear-day Fuji framed by the coasters at Fuji-Q Highland. Worth freezing for.",
    date: "2026-01-10",
    album: "Travel",
    liked: true,
  },
  "the-vessel-nyc-2025.webp": {
    title: "The Vessel, NYC",
    description: "Christmas night at Hudson Yards — the honeycomb all lit up against the cold.",
    date: "2025-12-25",
    album: "Travel",
  },
  "sunflower-field-chainat-2015.webp": {
    title: "Sunflower Fields, Chainat",
    description: "Endless sunflowers in Chainat, Thailand. Golden hour, golden everything.",
    date: "2015-12-05",
    album: "Travel",
  },
  // Duke
  "duke-gardens-winter-2025.webp": {
    title: "Duke Gardens in Winter",
    description: "Sarah P. Duke Gardens, stripped back and quiet in the cold.",
    date: "2025-01-18",
    album: "Duke",
  },
  "duke-university-spring-2026.webp": {
    title: "Duke in Spring",
    description: "Gothic stone and fresh green — campus at its best.",
    date: "2026-04-02",
    album: "Duke",
  },
  // Memes
  "drool-cat-meme.webp": {
    title: "Drool Cat",
    description: "No thoughts. Just drool.",
    album: "Memes",
  },
  "uia-cat-meme.webp": {
    title: "Uia Cat",
    description: "uia.",
    album: "Memes",
  },
  "rigby-cat.webp": {
    title: "Rigby",
    description: "Certified little menace.",
    album: "Memes",
  },
  "larry-lick-your-toes.gif": {
    title: "Larry",
    description: "Let's just say Larry will lick your toes tonight.",
    album: "Memes",
  },
  "salmon-wanted-to-fight-2023.webp": {
    title: "Salmon Wanted to Fight",
    description: "2023. Salmon picked a fight. Salmon lost.",
    date: "2023-06-01",
    album: "Memes",
  },
  // Games
  "zelda-botw.webp": {
    title: "Breath of the Wild",
    description: "All-time best game. Mipha best girl.",
    album: "Games",
    liked: true,
  },
};
