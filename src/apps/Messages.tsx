import { useEffect, useRef, useState } from "react";
import { profile } from "../data/profile";

/* ────────────────────────────────────────────────────────────────────────────
   Messages — a real contact form wearing an iMessage costume.

   Delivery is a single POST to Web3Forms, which emails the message straight to
   Jack. The access key below is PUBLIC BY DESIGN: the only thing it authorises
   is "send Jack a message", which is exactly what this app is for. No backend,
   no Worker, no secret in the bundle that could be abused.
   ──────────────────────────────────────────────────────────────────────────── */

const WEB3FORMS_KEY = "f75261f8-3ace-4128-a409-94213c339ad5";
const ENDPOINT = "https://api.web3forms.com/submit";

interface Bubble {
  id: number;
  from: "jack" | "visitor";
  text: string;
}

/** Jack's side of the thread — seeded so the app never opens empty. */
const GREETING: Bubble[] = [
  { id: 1, from: "jack", text: "Hey — thanks for poking around my desktop 👋" },
  {
    id: 2,
    from: "jack",
    text: "If you want to reach me about a role, a project, or just to say hi, this actually works. It lands in my inbox for real.",
  },
];

const REPLY =
  "Got it — this one's really on its way to my inbox. I'll get back to you soon. Thanks for reaching out 🙏";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "sending" | "sent" | "error";

export default function Messages() {
  const [bubbles, setBubbles] = useState<Bubble[]>(GREETING);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  // Keep the newest bubble in view, like a real thread.
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [bubbles, typing]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const canSend =
    status !== "sending" && draft.trim().length > 1 && EMAIL_RE.test(email.trim());

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;

    const text = draft.trim();
    const bubbleId = Date.now();
    setBubbles((b) => [...b, { id: bubbleId, from: "visitor", text }]);
    setDraft("");
    setStatus("sending");
    setError("");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Messages.app — ${name.trim() || "a visitor"} says hi`,
          from_name: "jackdebuff.github.io",
          name: name.trim() || "(no name given)",
          email: email.trim(),
          message: text,
          botcheck: "", // Web3Forms honeypot — bots fill it, humans never see it
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Send failed");

      setStatus("sent");
      setTyping(true);
      timers.current.push(
        window.setTimeout(() => {
          setTyping(false);
          setBubbles((b) => [...b, { id: Date.now() + 1, from: "jack", text: REPLY }]);
        }, 1400),
      );
    } catch (err) {
      // Roll the optimistic bubble back and hand the text to the visitor — a
      // bubble left sitting in the thread reads as "sent" when it wasn't, and
      // silently eating what they typed is worse still.
      setBubbles((b) => b.filter((x) => x.id !== bubbleId));
      setDraft(text);
      setStatus("error");
      // Web3Forms' own wording ("Invalid access_key format…") is for me, not for
      // whoever is trying to reach me. Keep the detail in the console.
      console.error("[Messages] send failed:", err);
      setError("Couldn't send that — try again, or email me directly.");
    }
  }

  return (
    <div className="flex h-full bg-white text-zinc-900 dark:bg-[#1c1c1e] dark:text-white">
      {/* Sidebar — conversation list, desktop only (mobile gets the thread alone) */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-black/10 bg-black/[0.02] md:flex dark:border-white/10 dark:bg-white/[0.03]">
        <div className="p-2.5">
          <div className="flex items-center gap-1.5 rounded-lg bg-black/[0.06] px-2 py-1.5 text-[12px] text-zinc-400 dark:bg-white/10">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M7 2a5 5 0 103.1 8.9l3 3a.75.75 0 101.06-1.06l-3-3A5 5 0 007 2zM3.5 7a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z" />
            </svg>
            Search
          </div>
        </div>
        <button className="mx-2 flex items-start gap-2.5 rounded-lg bg-[#0b84ff] p-2 text-left">
          <Avatar />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-[13px] font-semibold text-white">
                {profile.name}
              </span>
              <span className="shrink-0 text-[11px] text-white/70">now</span>
            </div>
            <p className="line-clamp-2 text-[12px] leading-snug text-white/80">
              Hey — thanks for poking around my desktop 👋
            </p>
          </div>
        </button>
        <p className="mt-auto p-3 text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
          This is a real inbox, not a demo. Messages go straight to my email.
        </p>
      </aside>

      {/* Thread */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2.5 border-b border-black/10 px-4 py-2.5 dark:border-white/10">
          <Avatar />
          <div className="min-w-0">
            <div className="truncate text-[14px] font-semibold leading-tight">
              {profile.name}
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Durham, NC · usually replies within a day
            </div>
          </div>
        </header>

        <div ref={threadRef} className="min-h-0 flex-1 space-y-1.5 overflow-y-auto px-4 py-3">
          <div className="pb-1 text-center text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
            Today
          </div>
          {bubbles.map((b, i) => (
            <div
              key={b.id}
              className={`flex ${b.from === "jack" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[78%] rounded-[18px] px-3.5 py-2 text-[14px] leading-snug ${
                  b.from === "jack"
                    ? "bg-black/[0.07] text-zinc-900 dark:bg-white/[0.13] dark:text-white"
                    : "bg-[#0b84ff] text-white"
                } ${i === bubbles.length - 1 ? "msg-pop" : ""}`}
              >
                {b.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-[18px] bg-black/[0.07] px-3.5 py-3 dark:bg-white/[0.13]">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 dark:bg-zinc-500"
                    style={{ animationDelay: `${d * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {status === "sent" && !typing && (
            <div className="pt-0.5 text-right text-[11px] text-zinc-400 dark:text-zinc-500">
              Delivered
            </div>
          )}
          {status === "error" && (
            <div className="pt-0.5 text-right text-[11px] text-red-500">{error}</div>
          )}
        </div>

        {/* Composer */}
        {/* pb-8 on mobile keeps the hint clear of the iOS home indicator */}
        <form
          onSubmit={send}
          className="border-t border-black/10 p-2.5 pb-8 md:pb-2.5 dark:border-white/10"
        >
          {/* Inputs are 16px on mobile: anything smaller makes iOS Safari
              auto-zoom on focus (same trap as Terminal's prompt). */}
          <div className="mb-2 flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className="min-w-0 flex-1 rounded-lg bg-black/[0.05] px-3 py-1.5 text-[16px] outline-none ring-[#0b84ff] placeholder:text-zinc-400 focus:ring-2 md:text-[13px] dark:bg-white/[0.08]"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              type="email"
              autoComplete="email"
              required
              className="min-w-0 flex-1 rounded-lg bg-black/[0.05] px-3 py-1.5 text-[16px] outline-none ring-[#0b84ff] placeholder:text-zinc-400 focus:ring-2 md:text-[13px] dark:bg-white/[0.08]"
            />
          </div>
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(e as unknown as React.FormEvent);
                }
              }}
              rows={1}
              placeholder="iMessage"
              className="max-h-28 min-h-[34px] flex-1 resize-none rounded-[17px] bg-black/[0.05] px-3.5 py-1.5 text-[16px] outline-none ring-[#0b84ff] placeholder:text-zinc-400 focus:ring-2 md:text-[14px] dark:bg-white/[0.08]"
            />
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Send"
              className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-[#0b84ff] text-white transition-opacity disabled:opacity-30"
            >
              {status === "sending" ? (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                  <path d="M8 14a.75.75 0 01-.75-.75V4.56L4.28 7.53a.75.75 0 01-1.06-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 01-1.06 1.06L8.75 4.56v8.69A.75.75 0 018 14z" />
                </svg>
              )}
            </button>
          </div>
          <p className="px-1 pt-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
            Your email is only used so I can reply.
          </p>
        </form>
      </div>
    </div>
  );
}

/** Jack's contact tile — initials on the iMessage-blue circle. */
function Avatar() {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#5ac8fa] to-[#0b84ff] text-[12px] font-semibold text-white">
      JP
    </span>
  );
}
