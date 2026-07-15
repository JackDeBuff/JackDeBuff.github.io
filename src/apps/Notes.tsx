import { useEffect, useRef, useState, type ReactNode } from "react";
import { profile } from "../data/profile";
import { useIsMobile } from "../state/useIsMobile";

/* Rotating status one-liner — cycles Jack's taglines with a soft cross-fade.
   Honors prefers-reduced-motion by simply swapping without the fade cadence. */
function RotatingTagline() {
  const lines = profile.taglines;
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (lines.length < 2) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const hold = reduce ? 6000 : 5200;
    const t = setInterval(() => {
      setShown(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % lines.length);
        setShown(true);
      }, reduce ? 0 : 400);
    }, hold);
    return () => clearInterval(t);
  }, [lines.length]);

  return (
    <p
      className="min-h-[2.4em] text-[13px] italic text-zinc-500 transition-opacity duration-[400ms] dark:text-zinc-400"
      style={{ opacity: shown ? 1 : 0 }}
      aria-live="polite"
    >
      {lines[idx]}
    </p>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Jack's Notes — an Apple-Notes-style app whose notes are Jack's portfolio.
   Desktop: two panes (notes list + paper content). Mobile: iOS push nav
   (list → detail slide-in) with a liquid-glass back button and edge-swipe back.
   Notes' signature yellow (#FFD60A) drives selection + accents.
   ──────────────────────────────────────────────────────────────────────────── */

/* Light structural bits, kept airy so the pane reads like paper, not cards. */
const block =
  "rounded-xl bg-black/[0.03] p-3.5 ring-1 ring-black/5 dark:bg-white/[0.05] dark:ring-white/10";
const chip =
  "rounded-full bg-black/[0.06] px-3 py-1 text-[13px] font-medium text-zinc-700 dark:bg-white/10 dark:text-zinc-200";

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
      <span className="inline-block h-3 w-[3px] rounded-full bg-amber-400" />
      {children}
    </h2>
  );
}

/* ── Note bodies (portfolio content ported from AboutJack) ─────────────────── */

function AboutBody() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-b from-sky-400 to-blue-600 text-2xl font-bold text-white shadow-sm">
          J
        </div>
        <div>
          <div className="text-xl font-bold leading-tight">{profile.name}</div>
          <div className="text-[13px] text-zinc-500 dark:text-zinc-400">{profile.title}</div>
          <div className="text-[13px] text-zinc-500 dark:text-zinc-400">{profile.location}</div>
        </div>
      </div>
      {profile.about.map((p) => (
        <p key={p.slice(0, 24)} className="text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-200">
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
      <RotatingTagline />
    </div>
  );
}

function EducationBody() {
  return (
    <div className="space-y-4">
      <SectionHeading>Education</SectionHeading>
      {profile.education.map((e) => (
        <div key={e.school} className={block}>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-[15px] font-semibold">{e.school}</h3>
            <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">{e.period}</span>
          </div>
          <p className="text-[13px] text-zinc-700 dark:text-zinc-300">{e.degree}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {e.place} · {e.detail}
          </p>
        </div>
      ))}
    </div>
  );
}

function ExperienceBody() {
  return (
    <div className="space-y-4">
      <SectionHeading>Experience</SectionHeading>
      {profile.experience.map((e) => (
        <div key={e.period} className={block}>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-[15px] font-semibold">{e.role}</h3>
            <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">{e.period}</span>
          </div>
          <p className="mb-2 text-[13px] text-zinc-500 dark:text-zinc-400">{e.company}</p>
          <ul className="list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300">
            {e.bullets.map((b) => (
              <li key={b.slice(0, 24)}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function PublicationsBody() {
  return (
    <div className="space-y-4">
      <SectionHeading>Publications</SectionHeading>
      {profile.publications.map((p) => (
        <a
          key={p.doi}
          href={p.doi}
          target="_blank"
          rel="noopener"
          className={`block ${block} transition hover:bg-black/[0.06] dark:hover:bg-white/10`}
        >
          <h3 className="text-[15px] font-semibold leading-snug">{p.title}</h3>
          <p className="mt-1 text-xs font-medium text-sky-600 dark:text-sky-400">{p.venue} ↗</p>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300">{p.note}</p>
        </a>
      ))}
    </div>
  );
}

function AwardsBody() {
  return (
    <div className="space-y-3">
      <SectionHeading>Awards</SectionHeading>
      {profile.awards.map((a) => (
        <div key={a.name} className={block}>
          <h3 className="text-[14px] font-semibold">{a.name}</h3>
          <p className="mt-1 text-[13px] text-zinc-600 dark:text-zinc-400">{a.detail}</p>
        </div>
      ))}
    </div>
  );
}

function SkillsBody() {
  return (
    <div className="space-y-4">
      <SectionHeading>Skills</SectionHeading>
      {Object.entries(profile.skills).map(([group, items]) => (
        <div key={group}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {group}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(items as readonly string[]).map((i) => (
              <span
                key={i}
                className="rounded-lg bg-black/[0.06] px-3 py-1.5 text-[13px] font-medium dark:bg-white/10"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ResumeBody() {
  return (
    <object data={`${import.meta.env.BASE_URL}resume.pdf`} type="application/pdf" className="h-full w-full">
      <div className="grid h-full place-items-center p-6">
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
  );
}

interface NoteDef {
  id: string;
  title: string;
  emoji: string;
  date: string;
  snippet: string;
  body: ReactNode;
  fullBleed?: boolean;
}

const NOTES: NoteDef[] = [
  {
    id: "about",
    title: "About Jack",
    emoji: "👋",
    date: "July 13, 2026",
    snippet: "Hi, my name is Jack — I ❤️ AI and Memes.",
    body: <AboutBody />,
  },
  {
    id: "education",
    title: "Education",
    emoji: "🎓",
    date: "August 25, 2025",
    snippet: "Duke University · Chulalongkorn University",
    body: <EducationBody />,
  },
  {
    id: "experience",
    title: "Experience",
    emoji: "💼",
    date: "June 12, 2023",
    snippet: "Data Scientist @ KASIKORN Labs (KBTG)",
    body: <ExperienceBody />,
  },
  {
    id: "publications",
    title: "Publications",
    emoji: "📄",
    date: "November 3, 2023",
    snippet: "IEEE TENCON 2023 · IEEE KST 2019",
    body: <PublicationsBody />,
  },
  {
    id: "awards",
    title: "Awards",
    emoji: "🏆",
    date: "March 20, 2021",
    snippet: "AIHack, ARV, TMLCC, Intel ISEF finalist",
    body: <AwardsBody />,
  },
  {
    id: "skills",
    title: "Skills",
    emoji: "🧰",
    date: "Updated recently",
    snippet: "PyTorch, TensorFlow, GeoPandas, Docker…",
    body: <SkillsBody />,
  },
  {
    id: "resume",
    title: "Resume",
    emoji: "📎",
    date: "PDF · full CV",
    snippet: "The embedded résumé, full-bleed.",
    body: <ResumeBody />,
    fullBleed: true,
  },
];

/* ── Small decorative Notes-toolbar glyphs (non-functional) ─────────────────── */

function ToolGlyph({ children, title }: { children: ReactNode; title: string }) {
  return (
    <button
      title={title}
      tabIndex={-1}
      className="grid h-7 w-7 place-items-center rounded-md text-zinc-500 opacity-70 transition hover:bg-black/5 hover:opacity-100 dark:text-zinc-400 dark:hover:bg-white/10"
    >
      {children}
    </button>
  );
}

function NotesToolbar() {
  const s = "h-[17px] w-[17px]";
  return (
    <div className="flex items-center gap-1 border-b border-black/10 bg-black/[0.015] px-2.5 py-1.5 dark:border-white/10 dark:bg-white/[0.02]">
      <ToolGlyph title="Compose">
        <svg viewBox="0 0 24 24" className={s} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </ToolGlyph>
      <ToolGlyph title="Checklist">
        <svg viewBox="0 0 24 24" className={s} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6h11M9 12h11M9 18h11" />
          <path d="M3.5 5.5 4.7 6.7 6.9 4.3" />
          <circle cx="4.5" cy="12" r="1.2" />
          <circle cx="4.5" cy="18" r="1.2" />
        </svg>
      </ToolGlyph>
      <ToolGlyph title="Table">
        <svg viewBox="0 0 24 24" className={s} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="5" width="17" height="14" rx="2" />
          <path d="M3.5 10h17M3.5 15h17M9.5 5v14" />
        </svg>
      </ToolGlyph>
      <ToolGlyph title="Media">
        <svg viewBox="0 0 24 24" className={s} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
          <circle cx="8.5" cy="10" r="1.4" />
          <path d="m4 17 5-4 4 3 3-2.5 4 3.5" />
        </svg>
      </ToolGlyph>
      <div className="flex-1" />
      <ToolGlyph title="Share">
        <svg viewBox="0 0 24 24" className={s} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15V3.5" />
          <path d="m8 7 4-3.5L16 7" />
          <path d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" />
        </svg>
      </ToolGlyph>
    </div>
  );
}

/* ── Shared note-detail (paper) content ─────────────────────────────────────── */

function NoteDetail({ note }: { note: NoteDef }) {
  if (note.fullBleed) {
    return <div className="h-full w-full bg-white dark:bg-[#1e1e1e]">{note.body}</div>;
  }
  return (
    <div className="h-full overflow-y-auto bg-white text-zinc-900 dark:bg-[#1e1e1e] dark:text-zinc-100">
      <div className="mx-auto max-w-2xl px-6 py-5 md:px-10">
        <div className="mb-4 text-center text-[11px] font-medium text-zinc-400 dark:text-zinc-500">{note.date}</div>
        <h1 className="fade-in mb-4 text-[26px] font-bold leading-tight tracking-tight">
          <span className="mr-2">{note.emoji}</span>
          {note.title}
        </h1>
        {note.body}
        <div className="h-8" />
      </div>
    </div>
  );
}

/* ── Notes list row ─────────────────────────────────────────────────────────── */

function NoteRow({
  note,
  selected,
  onSelect,
  chevron = false,
}: {
  note: NoteDef;
  selected: boolean;
  onSelect: () => void;
  chevron?: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors ${
        selected
          ? "bg-amber-400/25 dark:bg-amber-400/15"
          : "hover:bg-black/[0.045] dark:hover:bg-white/[0.06]"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-semibold text-zinc-900 dark:text-zinc-100">
          <span className="mr-1.5">{note.emoji}</span>
          {note.title}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px]">
          <span className="shrink-0 text-zinc-500 dark:text-zinc-400">{note.date}</span>
          <span className="truncate text-zinc-400 dark:text-zinc-500">{note.snippet}</span>
        </div>
      </div>
      {chevron && (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 6 6 6-6 6" />
        </svg>
      )}
    </button>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */

export default function Notes() {
  const isMobile = useIsMobile();
  const [selectedId, setSelectedId] = useState(NOTES[0].id);
  const [search, setSearch] = useState("");

  const q = search.trim().toLowerCase();
  const list = q
    ? NOTES.filter((n) => n.title.toLowerCase().includes(q) || n.snippet.toLowerCase().includes(q))
    : NOTES;
  const active = NOTES.find((n) => n.id === selectedId) ?? NOTES[0];

  /* ── Mobile: iOS push navigation with edge-swipe back ── */
  const [detailOpen, setDetailOpen] = useState(false);
  const [dragX, setDragX] = useState<number | null>(null);
  const swipe = useRef<{ tracking: boolean; startX: number }>({ tracking: false, startX: 0 });

  const openDetail = (id: string) => {
    setSelectedId(id);
    setDetailOpen(true);
  };
  const closeDetail = () => {
    setDetailOpen(false);
    setDragX(null);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.clientX <= 24) {
      swipe.current = { tracking: true, startX: e.clientX };
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!swipe.current.tracking) return;
    const dx = e.clientX - swipe.current.startX;
    if (dx > 0) setDragX(dx);
  };
  const onPointerEnd = () => {
    if (!swipe.current.tracking) return;
    const shouldClose = (dragX ?? 0) > 70;
    swipe.current.tracking = false;
    if (shouldClose) closeDetail();
    else setDragX(null);
  };

  if (isMobile) {
    return (
      <div className="relative h-full overflow-hidden bg-[#f7f6f2] dark:bg-[#1c1c1e]">
        {/* List view (large-title iOS Notes) */}
        <div className="h-full overflow-y-auto">
          <div className="px-4 pb-2 pt-3">
            <h1 className="text-[30px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Notes</h1>
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-black/[0.06] px-3 py-2 dark:bg-white/10">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.2-3.2" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-[15px] text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
              />
            </div>
          </div>
          <div className="px-2 pb-1 pt-1 text-[12px] font-medium text-zinc-400 dark:text-zinc-500">
            <span className="px-2">{list.length} Notes</span>
          </div>
          <div className="divide-y divide-black/5 px-2 dark:divide-white/10">
            {list.map((n) => (
              <NoteRow key={n.id} note={n} selected={false} onSelect={() => openDetail(n.id)} chevron />
            ))}
          </div>
        </div>

        {/* Detail view — slides in from the right (iOS push) */}
        <div
          className="absolute inset-0 bg-white shadow-[-8px_0_24px_rgba(0,0,0,0.18)] dark:bg-[#1e1e1e]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          style={{
            transform: `translateX(${detailOpen ? (dragX ?? 0) : window.innerWidth}px)`,
            transition: dragX === null ? "transform 0.3s var(--ease-out-quint)" : "none",
            willChange: "transform",
          }}
        >
          <NoteDetail note={active} />
          {/* Liquid-glass circular back button */}
          <button
            onClick={closeDetail}
            aria-label="Back to Notes"
            className="liquid-glass absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full text-amber-500"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 6-6 6 6 6" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  /* ── Desktop: two-pane Notes ── */
  return (
    <div className="flex h-full bg-[#faf9f5] text-zinc-900 dark:bg-[#1c1c1e] dark:text-zinc-100">
      {/* Notes list pane */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-black/10 bg-[#f4f2ec]/90 dark:border-white/10 dark:bg-[#232323]/90">
        <div className="flex items-center gap-2 px-3 pb-2 pt-2.5">
          <div className="flex flex-1 items-center gap-1.5 rounded-lg bg-black/[0.06] px-2.5 py-1.5 dark:bg-white/10">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.2-3.2" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-[12.5px] text-zinc-700 outline-none placeholder:text-zinc-400 dark:text-zinc-200"
            />
          </div>
          <button
            title="New Note"
            tabIndex={-1}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-400/30 text-amber-600 transition hover:bg-amber-400/45 dark:text-amber-400"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        <div className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Jack
        </div>
        <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-1.5 pb-2">
          {list.map((n) => (
            <NoteRow key={n.id} note={n} selected={n.id === selectedId} onSelect={() => setSelectedId(n.id)} />
          ))}
          {list.length === 0 && (
            <div className="px-3 py-6 text-center text-[12px] text-zinc-400">No notes found</div>
          )}
        </div>
      </aside>

      {/* Content pane */}
      <main className="flex min-w-0 flex-1 flex-col">
        <NotesToolbar />
        <div className="min-h-0 flex-1">
          <NoteDetail note={active} />
        </div>
      </main>
    </div>
  );
}
