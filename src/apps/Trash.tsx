import { useState } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   Trash — the failures Jack never actually deleted, because each one led
   somewhere. An honest, funny take on the underdog arc (public copy).
   ──────────────────────────────────────────────────────────────────────────── */

interface Fail {
  title: string;
  outcome: string;
  date: string;
}

const FAILS: Fail[] = [
  {
    title: "Admitted to MWIT dead last on the reserve list",
    outcome: "Stayed three years and made it my own.",
    date: "2016",
  },
  {
    title: "Rejected from 6 universities in Japan & Korea",
    outcome:
      "My application essay was the worst ever written by a human — zero experience, no advice. My safe choice, Chulalongkorn (CU), said yes: full-tuition scholarship + a living allowance.",
    date: "2018–2019",
  },
  {
    title: "~2 years of losing almost every competition I entered",
    outcome: "Then the wins finally came — AIHack, ARV, and TMLCC.",
    date: "2019–2021",
  },
  {
    title: "Stuck at 6th place, TMLCC 2021, one day left",
    outcome: "A last-minute idea at 3 a.m. won us my first-ever hackathon.",
    date: "2021",
  },
  {
    title: "Rejected from internships, year after year",
    outcome: "Kept applying. Performed. Landed a KBTG scholarship offer.",
    date: "2020–2023",
  },
  {
    title: "A 3.5 GPA against a field of 3.8–4.0",
    outcome: "Hackathon wins carried the application. Duke said yes.",
    date: "2024",
  },
];

export default function Trash() {
  const [toast, setToast] = useState(false);

  return (
    <div className="relative flex h-full flex-col bg-white text-zinc-900 dark:bg-[#1c1c1e] dark:text-white">
      <header className="flex items-center justify-between border-b border-black/10 px-4 py-3 dark:border-white/10">
        <div>
          <h1 className="text-[17px] font-bold leading-tight">Trash</h1>
          <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
            These were never actually deleted. They built me.
          </p>
        </div>
        <button
          onClick={() => {
            setToast(true);
            window.setTimeout(() => setToast(false), 2600);
          }}
          className="rounded-lg bg-black/[0.06] px-3 py-1.5 text-[12px] font-medium text-zinc-600 transition-colors hover:bg-black/10 dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/[0.16]"
        >
          Empty Trash
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <ul className="space-y-2">
          {FAILS.map((f) => (
            <li
              key={f.title}
              className="flex gap-3 rounded-xl bg-black/[0.03] p-3 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10"
            >
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-black/[0.06] text-[15px] dark:bg-white/10">
                🗑️
              </span>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold leading-snug text-zinc-400 line-through decoration-zinc-400/60 dark:text-zinc-500">
                  {f.title}
                </div>
                <div className="mt-1 flex items-start gap-1.5 text-[14px] leading-snug text-zinc-800 dark:text-zinc-100">
                  <span className="text-emerald-500">↳</span>
                  <span>{f.outcome}</span>
                </div>
                <div className="mt-1 text-[11px] tabular-nums text-zinc-400 dark:text-zinc-500">{f.date}</div>
              </div>
            </li>
          ))}
        </ul>
        <p className="px-1 pt-3 text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
          People only remember the start and the end. This is the messy middle.
        </p>
      </div>

      {toast && (
        <div className="salmon-pop pointer-events-none absolute inset-x-0 bottom-4 mx-auto w-max rounded-full bg-black/80 px-4 py-2 text-[13px] font-medium text-white shadow-lg">
          Nope — I need these. 🙂
        </div>
      )}
    </div>
  );
}
