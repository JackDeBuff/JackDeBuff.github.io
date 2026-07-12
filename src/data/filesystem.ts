import { profile } from "./profile";

export interface FsDir {
  [name: string]: FsDir | string;
}

const edu = profile.education
  .map((e) => `${e.school} (${e.place})\n${e.degree}\n${e.period} · ${e.detail}`)
  .join("\n\n");

const exp = profile.experience
  .map((e) => `${e.role} — ${e.company}\n${e.period}\n${e.bullets.map((b) => `  • ${b}`).join("\n")}`)
  .join("\n\n");

const pubs = profile.publications
  .map((p) => `${p.title}\n${p.venue} — ${p.doi}\n${p.note}`)
  .join("\n\n");

const awards = profile.awards.map((a) => `• ${a.name}\n  ${a.detail}`).join("\n");

export const HOME: FsDir = {
  "about.txt": `${profile.about.join("\n\n")}\n\nInterests: ${profile.interests.join(" · ")}`,
  "contact.txt": `email:    ${profile.email}\ngithub:   ${profile.github}\nlinkedin: ${profile.linkedin}`,
  education: {
    "duke.txt": `${edu.split("\n\n")[0]}`,
    "chula.txt": `${edu.split("\n\n")[1]}`,
  },
  experience: {
    "kbtg.txt": exp,
  },
  publications: {
    "tencon-2023.txt": pubs.split("\n\n")[0],
    "kst-2019.txt": pubs.split("\n\n")[1],
  },
  "awards.txt": awards,
  memes: {
    "du-bist-gut-genug.txt": "🎶 Du bist gut genuuuug~ 🕺",
  },
};
