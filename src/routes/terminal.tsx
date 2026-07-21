import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/terminal")({
  head: () => ({
    meta: [
      { title: "Secure Terminal — Ilkin Farajov CTF" },
      { name: "description", content: "Hidden interactive CTF terminal — privilege escalation challenge simulation." },
      { property: "og:title", content: "Secure Terminal — Ilkin Farajov CTF" },
      { property: "og:description", content: "Hidden interactive CTF terminal — privilege escalation challenge simulation." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TerminalPage,
});

type Line = { kind: "out" | "err" | "cmd" | "sys" | "ok"; text: string };
type Role = "guest" | "operator" | "root";

const BOOT = [
  "Initializing secure node...",
  "Loading modules... [OK]",
  "Checking permissions...",
  "Establishing SSH tunnel to 10.10.14.7...",
  "Access Level: Guest",
  "",
  "Type 'help' to list available commands.",
];

/* ---------- Matrix Rain ---------- */
function MatrixRain({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const chars = "アカサタナハマヤラワ0123456789ABCDEF{}<>#$%".split("");
    const fontSize = 14;
    let cols = Math.floor(canvas.width / fontSize);
    let drops = new Array(cols).fill(1);
    let raf = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(5,8,22,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00FF88";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active]);
  if (!active) return null;
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0 opacity-70" />;
}

/* ---------- Achievement popup ---------- */
function Achievement({ show, onClose }: { show: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [show, onClose]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="fixed right-6 top-6 z-50 rounded-lg border border-primary/60 bg-black/90 p-4 font-mono text-sm shadow-[0_0_30px_rgba(0,255,136,0.5)]"
        >
          <div className="text-primary text-glow font-bold">🏆 ACHIEVEMENT UNLOCKED</div>
          <div className="text-foreground mt-1">root access obtained</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TerminalPage() {
  const [booted, setBooted] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [role, setRole] = useState<Role>("guest");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState<number>(-1);
  const [matrix, setMatrix] = useState(false);
  const [flagWon, setFlagWon] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [readBackup, setReadBackup] = useState(false);
  const [debugShell, setDebugShell] = useState(false);
  const [startTs] = useState<number>(() => Date.now());
  const [now, setNow] = useState<number>(() => Date.now());
  const [statusBlink, setStatusBlink] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* boot sequence */
  useEffect(() => {
    let i = 0;
    const step = () => {
      setLines((l) => [...l, { kind: "sys", text: BOOT[i] }]);
      i++;
      if (i < BOOT.length) {
        setTimeout(step, 220 + Math.random() * 260);
      } else {
        setBooted(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };
    setTimeout(step, 300);
  }, []);

  /* auto scroll */
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  /* session timer + blinking status */
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    const b = setInterval(() => setStatusBlink((s) => !s), 900);
    return () => { clearInterval(t); clearInterval(b); };
  }, []);

  const sessionTime = useMemo(() => {
    const s = Math.floor((now - startTs) / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }, [now, startTs]);

  const cwd = "/home/" + role;
  const prompt = `${role}@sec-node:${cwd}$`;

  const push = useCallback((...ls: Line[]) => setLines((cur) => [...cur, ...ls]), []);

  const typeOut = useCallback(async (text: string, kind: Line["kind"] = "out") => {
    // add as a single line but with a small delay to feel "typed"
    await new Promise((r) => setTimeout(r, 60));
    push({ kind, text });
  }, [push]);

  /* Fake filesystem */
  const fs: Record<string, string[] | string> = useMemo(() => ({
    "/": ["bin", "etc", "home", "opt", "root", "usr", "var"],
    "/home": ["guest", "operator"],
    "/home/guest": [".bash_history", "notes.txt"],
    "/home/guest/notes.txt": "TODO: check sudo -l ... maybe there is a misconfig.",
    "/home/operator": [".ssh", "todo.md"],
    "/home/operator/todo.md": "- rotate creds\n- audit /usr/bin/system-check (SUID?)",
    "/opt": ["backup"],
    "/opt/backup": ["credentials.bak", "readme.txt"],
    "/opt/backup/readme.txt": "Internal backups. DO NOT SHARE.",
    "/opt/backup/credentials.bak": "operator:shadow-access-2026",
    "/root": ["root_flag.txt", ".bash_history"],
    "/root/root_flag.txt": "flag{portfolio_privesc_completed}",
    "/etc": ["passwd", "shadow"],
    "/etc/passwd": "root:x:0:0:root:/root:/bin/bash\noperator:x:1000:1000::/home/operator:/bin/bash\nguest:x:1001:1001::/home/guest:/bin/bash",
    "/etc/shadow": "Permission denied.",
    "/usr": ["bin"],
    "/usr/bin": ["system-check", "cat", "ls", "find"],
  }), []);

  const canRead = (path: string): boolean => {
    if (path === "/etc/shadow") return role === "root";
    if (path.startsWith("/root")) return role === "root" || debugShell;
    if (path.startsWith("/opt/backup") && role === "guest") {
      // Only allowed via sudo cat
      return false;
    }
    return true;
  };

  /* Hacktheplanet animation */
  const runHackAnim = async () => {
    const frames = [
      "[*] Connecting to mainframe...",
      "[*] Bypassing firewall.......... OK",
      "[*] Injecting payload........... OK",
      "[*] Decrypting AES-256.......... OK",
      "[*] Enumerating targets......... OK",
      "[+] HACK THE PLANET!",
    ];
    for (const f of frames) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 350));
      push({ kind: "ok", text: f });
    }
  };

  /* command runner */
  const run = async (raw: string) => {
    const cmd = raw.trim();
    push({ kind: "cmd", text: `${prompt} ${cmd}` });
    if (!cmd) return;
    setHistory((h) => [...h, cmd]);
    setHIdx(-1);

    const [c0, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ");
    const low = c0.toLowerCase();

    switch (low) {
      case "help": {
        setHintLevel((h) => Math.min(h + 1, 4));
        const base = [
          "Available commands:",
          "  help, whoami, id, pwd, ls [-la] [path], cat <file>,",
          "  history, sudo -l, sudo <cmd>, find <path> -perm -4000,",
          "  login <user> <password>, system-check [--debug],",
          "  matrix, hacktheplanet, clear, exit",
        ];
        push(...base.map((x) => ({ kind: "out" as const, text: x })));
        const hints = [
          "",
          "[hint] Start with: whoami, id, sudo -l",
          "[hint] Guest may run something as root — inspect what it can read.",
          "[hint] After you find credentials, use: login <user> <password>",
          "[hint] Look for SUID binaries: find / -perm -4000",
        ];
        const level = Math.min(hintLevel + 1, hints.length - 1);
        for (let i = 0; i <= level; i++) if (hints[i]) push({ kind: "sys", text: hints[i] });
        return;
      }

      case "whoami":
        push({ kind: "out", text: role });
        return;

      case "id": {
        const map: Record<Role, string> = {
          guest: "uid=1001(guest) gid=1001(guest) groups=1001(guest)",
          operator: "uid=1000(operator) gid=1000(operator) groups=1000(operator)",
          root: "uid=0(root) gid=0(root) groups=0(root)",
        };
        push({ kind: "out", text: map[role] });
        return;
      }

      case "pwd":
        push({ kind: "out", text: cwd });
        return;

      case "ls": {
        const parts = rest.filter((r) => !r.startsWith("-"));
        const path = parts[0] || cwd;
        const entry = fs[path];
        if (!entry) {
          push({ kind: "err", text: `ls: cannot access '${path}': No such file or directory` });
          return;
        }
        if (typeof entry === "string") {
          push({ kind: "out", text: path });
          return;
        }
        if (rest.includes("-la") || rest.includes("-l") || rest.includes("-al")) {
          push({ kind: "out", text: `total ${entry.length}` });
          entry.forEach((e) => {
            const isDir = Array.isArray(fs[`${path === "/" ? "" : path}/${e}`]);
            push({ kind: "out", text: `${isDir ? "drwxr-xr-x" : "-rw-r--r--"} 1 ${role} ${role}  4096 Jan 01 00:00 ${e}` });
          });
        } else {
          push({ kind: "out", text: entry.join("  ") });
        }
        return;
      }

      case "cat": {
        if (!arg) { push({ kind: "err", text: "cat: missing operand" }); return; }
        const target = arg;
        const content = fs[target];
        if (content === undefined) {
          push({ kind: "err", text: `cat: ${target}: No such file or directory` });
          return;
        }
        if (Array.isArray(content)) {
          push({ kind: "err", text: `cat: ${target}: Is a directory` });
          return;
        }
        if (!canRead(target)) {
          push({ kind: "err", text: `cat: ${target}: Permission denied` });
          return;
        }
        content.split("\n").forEach((l) => push({ kind: "out", text: l }));
        if (target === "/root/root_flag.txt") {
          setTimeout(() => setFlagWon(true), 500);
        }
        return;
      }

      case "history": {
        history.forEach((h, i) => push({ kind: "out", text: `  ${i + 1}  ${h}` }));
        return;
      }

      case "sudo": {
        if (arg === "-l") {
          if (role === "guest") {
            push({ kind: "out", text: "Matching Defaults entries for guest on sec-node:" });
            push({ kind: "out", text: "    env_reset, secure_path=/usr/local/sbin:/usr/local/bin" });
            push({ kind: "out", text: "" });
            push({ kind: "out", text: "User guest may run the following commands on sec-node:" });
            push({ kind: "out", text: "    (root) NOPASSWD: /usr/bin/cat /opt/backup/*" });
          } else {
            push({ kind: "out", text: `User ${role} may run any command.` });
          }
          return;
        }
        if (arg.startsWith("cat /opt/backup/")) {
          const p = arg.replace(/^cat\s+/, "").trim();
          const c = fs[p];
          if (typeof c !== "string") { push({ kind: "err", text: `cat: ${p}: No such file` }); return; }
          setReadBackup(true);
          c.split("\n").forEach((l) => push({ kind: "out", text: l }));
          push({ kind: "sys", text: "[hint] Credentials captured. Try: login <user> <password>" });
          return;
        }
        if (arg === "pentester") {
          push({ kind: "err", text: "Permission denied." });
          push({ kind: "sys", text: "Keep learning." });
          return;
        }
        push({ kind: "err", text: `Sorry, user ${role} is not allowed to execute '${arg}' as root.` });
        return;
      }

      case "find": {
        if (arg.includes("-perm -4000")) {
          push({ kind: "out", text: "/usr/bin/system-check" });
          push({ kind: "out", text: "/usr/bin/passwd" });
          push({ kind: "out", text: "/usr/bin/sudo" });
          return;
        }
        push({ kind: "out", text: "" });
        return;
      }

      case "login": {
        const [user, pass] = rest;
        if (!user || !pass) { push({ kind: "err", text: "usage: login <user> <password>" }); return; }
        if (user === "operator" && pass === "shadow-access-2026") {
          setRole("operator");
          push({ kind: "ok", text: "Authentication successful." });
          push({ kind: "ok", text: "Privilege level upgraded." });
          push({ kind: "sys", text: "[hint] SUID binaries can be your ticket. Try: find / -perm -4000" });
          return;
        }
        push({ kind: "err", text: "Authentication failed." });
        return;
      }

      case "system-check": {
        if (role !== "operator") {
          push({ kind: "err", text: "system-check: must be run as operator." });
          return;
        }
        if (rest.includes("--debug")) {
          setDebugShell(true);
          setRole("root");
          push({ kind: "ok", text: "Debug shell enabled." });
          push({ kind: "ok", text: "Privilege level upgraded." });
          setShowAchievement(true);
          push({ kind: "sys", text: "[hint] Grab the flag: cat /root/root_flag.txt" });
          return;
        }
        push({ kind: "out", text: "system-check: usage: system-check [--debug]" });
        return;
      }

      case "matrix":
        setMatrix((m) => !m);
        push({ kind: "sys", text: matrix ? "matrix: disabled" : "matrix: enabled (run 'matrix' again to disable)" });
        return;

      case "hacktheplanet":
        await runHackAnim();
        return;

      case "clear":
      case "cls":
        setLines([]);
        return;

      case "exit":
        push({ kind: "sys", text: "logout. redirecting to portfolio..." });
        setTimeout(() => { window.location.href = "/"; }, 700);
        return;

      case "submit": {
        if (arg.trim() === "flag{portfolio_privesc_completed}") {
          setFlagWon(true);
          return;
        }
        push({ kind: "err", text: "submit: incorrect flag." });
        return;
      }

      case "banner":
        push({ kind: "ok", text: " ___ _ _   _         ___ _____ _____ " });
        push({ kind: "ok", text: "|_ _| | |_(_)_ _    / __|_   _|  ___|" });
        push({ kind: "ok", text: " | || |  _| | ' \\  | (__  | | | |_   " });
        push({ kind: "ok", text: "|___|_|\\__|_|_||_|  \\___| |_| |_|   " });
        return;

      default:
        push({ kind: "err", text: `${c0}: command not found. Type 'help'.` });
    }
    // reference to prevent unused warning in some paths
    void typeOut;
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { const v = input; setInput(""); run(v); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = hIdx === -1 ? history.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(idx); setInput(history[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIdx === -1) return;
      const idx = hIdx + 1;
      if (idx >= history.length) { setHIdx(-1); setInput(""); } else { setHIdx(idx); setInput(history[idx]); }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050816] text-foreground overflow-hidden font-mono">
      <MatrixRain active={matrix} />

      {/* CRT scanlines */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.15] mix-blend-screen"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,255,136,0.35) 0px, rgba(0,255,136,0.35) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-10 opacity-30"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)" }}
      />

      <Achievement show={showAchievement} onClose={() => setShowAchievement(false)} />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 mx-auto max-w-5xl px-4 py-6 md:py-10"
      >
        {/* Top bar */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-t-lg border border-primary/30 bg-black/70 px-4 py-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${statusBlink ? "bg-red-500" : "bg-red-500/40"}`} />
              <span className="text-muted-foreground">REC</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${!statusBlink ? "bg-primary" : "bg-primary/40"} shadow-[0_0_6px_#00FF88]`} />
              <span className="text-muted-foreground">LINK</span>
            </span>
            <span className="text-muted-foreground hidden sm:inline">
              ssh {role}@10.10.14.7
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-primary">role: {role}</span>
            <span className="text-muted-foreground">uptime {sessionTime}</span>
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">[ exit ]</Link>
          </div>
        </div>

        {/* Terminal window */}
        <div className="rounded-b-lg border border-t-0 border-primary/30 bg-black/80 shadow-[0_0_60px_rgba(0,255,136,0.15)]">
          <div
            ref={scrollRef}
            onClick={() => {
              const sel = window.getSelection();
              if (sel && sel.toString().length > 0) return; // allow text selection/copy
              inputRef.current?.focus();
            }}
            onPaste={(e) => {
              if (document.activeElement !== inputRef.current) {
                e.preventDefault();
                const text = e.clipboardData.getData("text");
                setInput((v) => v + text);
                inputRef.current?.focus();
              }
            }}
            className="h-[70vh] md:h-[75vh] overflow-y-auto p-4 text-sm leading-relaxed"
          >
            {lines.map((l, i) => (
              <div
                key={i}
                className={
                  l.kind === "cmd"
                    ? "text-foreground"
                    : l.kind === "err"
                    ? "text-red-400"
                    : l.kind === "sys"
                    ? "text-cyan-300/80"
                    : l.kind === "ok"
                    ? "text-primary text-glow"
                    : "text-muted-foreground"
                }
              >
                <span className="whitespace-pre-wrap break-words">{l.text}</span>
              </div>
            ))}
            {booted && !flagWon && (
              <div className="flex items-center gap-2">
                <span className="text-primary shrink-0">{prompt}</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  autoComplete="off"
                  spellCheck={false}
                  autoFocus
                  aria-label="terminal input"
                  className="flex-1 bg-transparent outline-none border-none text-foreground caret-primary"
                />
                <span className="term-cursor" />
              </div>
            )}
          </div>
        </div>

        {/* Flag Overlay */}
        <AnimatePresence>
          {flagWon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 backdrop-blur-sm px-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="max-w-lg w-full rounded-xl border border-primary bg-black p-8 text-center shadow-[0_0_60px_rgba(0,255,136,0.5)]"
              >
                <div className="mb-2 text-3xl font-bold tracking-widest text-primary text-glow">ACCESS GRANTED</div>
                <div className="mb-4 text-lg text-primary">🏆 Portfolio CTF Completed</div>
                <p className="mb-6 text-sm text-muted-foreground">
                  Congratulations. You successfully completed the privilege escalation challenge.
                </p>
                <div className="mb-6 rounded border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-xs text-primary break-all">
                  flag{"{portfolio_privesc_completed}"}
                </div>
                <Link
                  to="/"
                  className="btn-glow inline-block rounded-md px-6 py-3 font-mono text-sm font-bold"
                  style={{ background: "var(--primary-hex)", color: "var(--primary-foreground)" }}
                >
                  [ Return To Portfolio ]
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
