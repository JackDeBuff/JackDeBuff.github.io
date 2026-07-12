import { useEffect, useRef, useState } from "react";
import { HOME, type FsDir } from "../data/filesystem";
import { profile } from "../data/profile";
import { useWindows } from "../state/windows";

interface Line {
  prompt?: string;
  text: string;
}

function resolve(path: string[], fs: FsDir): FsDir | string | null {
  let cur: FsDir | string = fs;
  for (const part of path) {
    if (typeof cur === "string") return null;
    const next: FsDir | string | undefined = cur[part];
    if (next === undefined) return null;
    cur = next;
  }
  return cur;
}

const NEOFETCH = String.raw`
        .:'         jack@macbook
     _ :'_          ------------
  .'` + "`" + String.raw`_` + "`" + String.raw`-'` + "`" + String.raw`.       OS: jackOS 26 "Tahoe" (web)
 :________.` + "`" + String.raw`:      Host: MacBook Pro (Portfolio Edition)
 :_______:  :      Role: ${"Data Scientist · ML @ Duke"}
  :_______` + "`" + String.raw`-;      Papers: 2 IEEE · Citations: 35+
   ` + "`" + String.raw`._.-._.'       Loves: AI, Finance, Cats, Memes
`;

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { text: `Last login: ${new Date().toDateString()} on ttys000` },
    { text: 'Type "help" to see available commands.' },
  ]);
  const [cwd, setCwd] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { openWindow } = useWindows();

  const promptStr = `jack@macbook ${cwd.length ? "~/" + cwd.join("/") : "~"} %`;

  const COMMANDS = ["ls", "cd", "cat", "pwd", "open", "clear", "help", "whoami", "date", "echo", "neofetch"];
  const APPS = ["about", "chrome", "music", "settings", "terminal", "github", "linkedin"];

  /** Tab-completion: first word → commands; `open` → app names; otherwise → entries in cwd. */
  function complete(raw: string): string | null {
    const parts = raw.split(/\s+/);
    const last = parts[parts.length - 1] ?? "";
    let pool: string[];
    if (parts.length <= 1) pool = COMMANDS;
    else if (parts[0] === "open") pool = APPS;
    else {
      const node = resolve(cwd, HOME);
      if (!node || typeof node === "string") return null;
      pool = Object.keys(node).map((n) => (typeof node[n] === "string" ? n : n + "/"));
    }
    const matches = pool.filter((p) => p.startsWith(last));
    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      return parts.join(" ") + (matches[0].endsWith("/") ? "" : " ");
    }
    if (matches.length > 1) {
      setLines((l) => [...l, { prompt: promptStr, text: raw }, { text: matches.join("   ") }]);
      // extend to the longest common prefix
      let prefix = matches[0];
      for (const m of matches) {
        while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
      }
      if (prefix.length > last.length) {
        parts[parts.length - 1] = prefix;
        return parts.join(" ");
      }
      return raw;
    }
    return null;
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [lines]);

  function run(raw: string) {
    const cmdLine = raw.trim();
    const out: Line[] = [{ prompt: promptStr, text: raw }];
    const [cmd, ...args] = cmdLine.split(/\s+/);

    const print = (text: string) => out.push({ text });

    switch (cmd) {
      case "":
        break;
      case "help":
        print("Available commands:");
        print("  ls            list files          cd <dir>   change directory");
        print("  cat <file>    read a file         pwd        print directory");
        print("  open <app>    open an app         clear      clear screen");
        print("  whoami · date · echo · neofetch");
        print("Apps: about, chrome, music, settings, github, linkedin");
        break;
      case "ls": {
        const node = resolve(cwd, HOME);
        if (node && typeof node !== "string") {
          const names = Object.keys(node).map((n) =>
            typeof node[n] === "string" ? n : `\x1b[34m${n}/\x1b[0m`,
          );
          print(names.map((n) => n.replace(/\x1b\[\d+m/g, "")).join("   "));
        }
        break;
      }
      case "pwd":
        print("/Users/jack" + (cwd.length ? "/" + cwd.join("/") : ""));
        break;
      case "cd": {
        const target = args[0];
        if (!target || target === "~") setCwd([]);
        else if (target === "..") setCwd((c) => c.slice(0, -1));
        else {
          const clean = target.replace(/\/$/, "");
          const node = resolve([...cwd, clean], HOME);
          if (node && typeof node !== "string") setCwd((c) => [...c, clean]);
          else print(`cd: no such directory: ${target}`);
        }
        break;
      }
      case "cat": {
        const file = args[0];
        if (!file) {
          print("usage: cat <file>");
          break;
        }
        const node = resolve([...cwd, file], HOME);
        if (typeof node === "string") node.split("\n").forEach(print);
        else print(`cat: ${file}: No such file`);
        break;
      }
      case "open": {
        const app = (args[0] ?? "").toLowerCase();
        if (app === "github") window.open(profile.github, "_blank", "noopener");
        else if (app === "linkedin") window.open(profile.linkedin, "_blank", "noopener");
        else if (["about", "chrome", "music", "settings", "terminal"].includes(app)) openWindow(app);
        else print(`open: unknown app: ${args[0] ?? ""}`);
        break;
      }
      case "whoami":
        print("jack — " + profile.title);
        break;
      case "date":
        print(new Date().toString());
        break;
      case "echo":
        print(args.join(" "));
        break;
      case "neofetch":
        NEOFETCH.split("\n").forEach(print);
        break;
      case "clear":
        setLines([]);
        setHistory((h) => [cmdLine, ...h]);
        return;
      case "sudo":
        print("jack is not in the sudoers file. This incident will be reported. 🚨");
        break;
      default:
        print(`zsh: command not found: ${cmd}`);
    }

    setLines((l) => [...l, ...out]);
    if (cmdLine) setHistory((h) => [cmdLine, ...h]);
    setHistIdx(-1);
  }

  return (
    <div
      className="h-full cursor-text overflow-y-auto bg-zinc-950/90 p-3 font-mono text-[13px] leading-relaxed text-zinc-100"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap break-words">
          {l.prompt && <span className="font-semibold text-emerald-400">{l.prompt} </span>}
          {l.text}
        </div>
      ))}
      <div className="flex">
        <span className="shrink-0 font-semibold text-emerald-400">{promptStr}&nbsp;</span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              run(input);
              setInput("");
            } else if (e.key === "Tab") {
              e.preventDefault();
              const completed = complete(input);
              if (completed !== null) setInput(completed);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              const idx = Math.min(histIdx + 1, history.length - 1);
              if (history[idx] !== undefined) {
                setHistIdx(idx);
                setInput(history[idx]);
              }
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const idx = histIdx - 1;
              setHistIdx(Math.max(idx, -1));
              setInput(idx >= 0 ? history[idx] : "");
            }
          }}
          className="min-w-0 flex-1 bg-transparent caret-emerald-400 outline-none"
          spellCheck={false}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
