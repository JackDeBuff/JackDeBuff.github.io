import { useState } from "react";
import { profile } from "../data/profile";

const SECTIONS = ["About", "Education", "Experience", "Publications", "Awards", "Skills", "Resume"] as const;
type Section = (typeof SECTIONS)[number];

const ICONS: Record<Section, string> = {
  About: "👋",
  Education: "🎓",
  Experience: "💼",
  Publications: "📄",
  Awards: "🏆",
  Skills: "🧰",
  Resume: "📎",
};

const card =
  "rounded-2xl bg-black/[0.04] p-4 ring-1 ring-black/10 dark:bg-white/5 dark:ring-white/10";
const chip =
  "rounded-full bg-black/[0.06] px-3 py-1 text-xs font-medium dark:bg-white/10";

export default function AboutJack() {
  const [section, setSection] = useState<Section>("About");

  return (
    <div className="flex h-full bg-zinc-100/95 text-zinc-900 dark:bg-zinc-900/95 dark:text-zinc-100">
      {/* Finder-style glass sidebar */}
      <aside className="glass-thin w-48 shrink-0 space-y-0.5 overflow-y-auto p-2">
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium transition-colors ${
              section === s
                ? "bg-blue-500 text-white"
                : "text-zinc-700 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10"
            }`}
          >
            <span>{ICONS[s]}</span>
            {s}
          </button>
        ))}
      </aside>

      <main className={`min-w-0 flex-1 ${section === "Resume" ? "" : "overflow-y-auto p-6"}`}>
        {section === "About" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gradient-to-b from-sky-400 to-blue-600 text-3xl font-bold text-white">
                J
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{profile.title}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{profile.location}</p>
              </div>
            </div>
            {profile.about.map((p) => (
              <p key={p.slice(0, 24)} className="text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                {p}
              </p>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              {profile.interests.map((i) => (
                <span key={i} className={chip}>
                  {i}
                </span>
              ))}
            </div>
            <p className="text-sm text-zinc-500">{profile.tagline}</p>
          </div>
        )}

        {section === "Education" && (
          <div className="space-y-5">
            {profile.education.map((e) => (
              <div key={e.school} className={card}>
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold">{e.school}</h2>
                  <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">{e.period}</span>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{e.degree}</p>
                <p className="text-xs text-zinc-500">
                  {e.place} · {e.detail}
                </p>
              </div>
            ))}
          </div>
        )}

        {section === "Experience" && (
          <div className="space-y-5">
            {profile.experience.map((e) => (
              <div key={e.period} className={card}>
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold">{e.role}</h2>
                  <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">{e.period}</span>
                </div>
                <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">{e.company}</p>
                <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {e.bullets.map((b) => (
                    <li key={b.slice(0, 24)}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {section === "Publications" && (
          <div className="space-y-5">
            {profile.publications.map((p) => (
              <a
                key={p.doi}
                href={p.doi}
                target="_blank"
                rel="noopener"
                className={`block ${card} transition hover:bg-black/[0.07] dark:hover:bg-white/10`}
              >
                <h2 className="font-semibold leading-snug">{p.title}</h2>
                <p className="mt-1 text-xs font-medium text-sky-600 dark:text-sky-400">{p.venue} ↗</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{p.note}</p>
              </a>
            ))}
          </div>
        )}

        {section === "Awards" && (
          <div className="space-y-3">
            {profile.awards.map((a) => (
              <div key={a.name} className={card}>
                <h2 className="text-sm font-semibold">{a.name}</h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{a.detail}</p>
              </div>
            ))}
          </div>
        )}

        {section === "Skills" && (
          <div className="space-y-4">
            {Object.entries(profile.skills).map(([group, items]) => (
              <div key={group}>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">{group}</h2>
                <div className="flex flex-wrap gap-2">
                  {items.map((i) => (
                    <span key={i} className="rounded-lg bg-black/[0.06] px-3 py-1.5 text-sm font-medium dark:bg-white/10">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {section === "Resume" && (
          <object
            data={`${import.meta.env.BASE_URL}resume.pdf`}
            type="application/pdf"
            className="h-full w-full"
          >
            <div className="grid h-full place-items-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Your browser can't preview PDFs —{" "}
                <a
                  href={`${import.meta.env.BASE_URL}resume.pdf`}
                  target="_blank"
                  rel="noopener"
                  className="text-sky-600 hover:underline dark:text-sky-400"
                >
                  open it here
                </a>
                .
              </p>
            </div>
          </object>
        )}
      </main>
    </div>
  );
}
