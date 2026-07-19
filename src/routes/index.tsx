import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Shield, Terminal, Github, Linkedin, Mail, Instagram, Download,
  ExternalLink, ChevronDown, Award, Briefcase, Code2, Cpu, Lock,
  Network, Bug, FileCode, Container, Box, GitBranch,
} from "lucide-react";
import {
  SiLinux, SiKalilinux, SiPython, SiPostgresql, SiWireshark,
  SiMetasploit, SiDocker, SiGit, SiVirtualbox,
} from "react-icons/si";
import { FaWindows } from "react-icons/fa";


export const Route = createFileRoute("/")({
  component: Portfolio,
});

/* ---------- Background: animated grid + floating dots ---------- */
function CyberBackground() {
  const dots = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    duration: 15 + Math.random() * 25,
    delay: Math.random() * 20,
    size: 2 + Math.random() * 3,
  }));
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-cyber-grid opacity-40" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full dot-float"
          style={{
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            background: "var(--primary-hex)",
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            boxShadow: `0 0 8px var(--primary-hex)`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Typing effect ---------- */
function useTyping(text: string, speed = 90) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    setOut("");
    const t = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return out;
}

/* ---------- Tilt card wrapper ---------- */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });
  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Section wrapper with fade-up ---------- */
function Section({ id, title, kicker, children }: { id: string; title: string; kicker?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <section ref={ref} id={id} className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        {kicker && (
          <div className="mb-2 flex items-center gap-2 font-mono text-sm text-primary">
            <span>&gt;</span>
            <span>{kicker}</span>
          </div>
        )}
        <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
          {title}
          <span className="text-primary text-glow">.</span>
        </h2>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {children}
      </motion.div>
    </section>
  );
}

/* ---------- Progress bar ---------- */
function SkillBar({ name, value, icon: Icon }: { name: string; value: number; icon: React.ElementType }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="font-mono text-sm">{name}</span>
        </div>
        <span className="font-mono text-sm text-primary">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, var(--primary-hex), color-mix(in oklab, var(--primary) 60%, white))`,
            boxShadow: `0 0 10px var(--primary-hex)`,
          }}
        />
      </div>
    </div>
  );
}

/* ---------- DATA ---------- */
const skillsBars = [
  { name: "Linux", value: 90, icon: SiLinux },
  { name: "Windows", value: 80, icon: FaWindows },
  { name: "SQL", value: 80, icon: SiPostgresql },
  { name: "Python", value: 70, icon: SiPython },
];
const tools = [
  { name: "Burp Suite", icon: Bug },
  { name: "Nmap", icon: Network },
  { name: "Wireshark", icon: SiWireshark },
  { name: "Metasploit", icon: SiMetasploit },
  { name: "Kali Linux", icon: SiKalilinux },
  { name: "Git", icon: SiGit },
  { name: "Docker", icon: SiDocker },
  { name: "VirtualBox", icon: SiVirtualbox },
];

const projects = [
  { title: "SQL Injection Lab", desc: "Hands-on SQLi exploitation lab covering error-based, blind, and UNION attacks.", tags: ["Web", "SQLi"], icon: FileCode },
  { title: "Active Directory Lab", desc: "Home lab simulating AD attacks: Kerberoasting, AS-REP roasting, DCSync.", tags: ["AD", "Red Team"], icon: Network },
  { title: "Incident Response", desc: "Notes and playbooks for triage, containment, and forensics on Windows hosts.", tags: ["Blue Team", "DFIR"], icon: Shield },
  { title: "Linux PrivEsc", desc: "Enumeration cheatsheet & scripted checks for local privilege escalation.", tags: ["Linux", "PrivEsc"], icon: SiLinux },
  { title: "Windows PrivEsc", desc: "Windows privilege escalation techniques with lab walkthroughs.", tags: ["Windows", "PrivEsc"], icon: FaWindows },
  { title: "OWASP Top 10 Notes", desc: "Deep-dive notes and PoCs for each OWASP Top 10 category.", tags: ["Web", "Notes"], icon: Lock },
  { title: "Password Manager Research", desc: "Security analysis of open-source password manager designs.", tags: ["Research"], icon: Lock },
  { title: "Malware Analysis Notes", desc: "Static + dynamic analysis notes on beginner malware samples.", tags: ["Malware"], icon: Bug },
];

const timeline = [
  { year: "2026", title: "Started Red Team Course", desc: "Kicked off structured Red Team training." },
  { year: "2026", title: "Built Home Lab", desc: "Deployed AD + attacker VMs in a private virtualization lab." },
  { year: "2026", title: "Started Web Pentesting", desc: "Working through PortSwigger Academy & OWASP labs." },
  { year: "2026", title: "Certification Prep", desc: "Preparing for international offensive-security certification." },
];

/* ---------- MAIN ---------- */
function Portfolio() {
  return (
    <div className="relative min-h-screen bg-background text-foreground dark">
      <CyberBackground />
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <InteractiveTerminal />
      <Timeline />
      <Certifications />
      <Experience />
      <Contact />
      <Footer />
    </div>
  );
}

/* ---------- Nav ---------- */
function Nav() {
  const links = [
    ["home", "Home"], ["about", "About"], ["skills", "Skills"],
    ["projects", "Projects"], ["terminal", "Terminal"], ["timeline", "Timeline"], ["contact", "Contact"],
  ];
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ background: "color-mix(in oklab, var(--background) 70%, transparent)", borderBottom: "1px solid var(--color-border)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#home" className="flex items-center gap-2 font-mono font-bold">
          <Terminal className="h-5 w-5 text-primary" />
          <span>ilkin.farajov<span className="text-primary">:~$</span></span>
        </a>
        <nav className="hidden gap-6 md:flex">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="font-mono text-sm text-muted-foreground transition-colors hover:text-primary">
              ./{label.toLowerCase()}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  const name = useTyping("ILKIN FARAJOV", 100);
  return (
    <section id="home" className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-20">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs"
          style={{ borderColor: "var(--primary-hex)", color: "var(--primary-hex)" }}>
          <span className="h-2 w-2 rounded-full bg-primary cursor-blink" />
          available for opportunities
        </motion.div>

        <h1 className="mb-4 font-mono text-4xl font-bold tracking-tight md:text-7xl">
          {name}<span className="text-primary cursor-blink">_</span>
        </h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="mb-3 text-lg font-medium text-primary text-glow md:text-2xl">
          Cyber Security · Red Team · Penetration Tester
        </motion.p>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
          className="mb-10 font-mono text-sm text-muted-foreground md:text-base">
          Linux <span className="text-primary">|</span> Windows <span className="text-primary">|</span> Active Directory <span className="text-primary">|</span> Web Security
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}
          className="flex flex-wrap items-center justify-center gap-4">
          <a href="#projects"
             className="btn-glow inline-flex items-center gap-2 rounded-md px-6 py-3 font-mono text-sm font-semibold"
             style={{ background: "var(--primary-hex)", color: "var(--primary-foreground)" }}>
            [ View Projects ]
          </a>
          <a href="#contact"
             className="btn-glow inline-flex items-center gap-2 rounded-md border px-6 py-3 font-mono text-sm font-semibold text-primary"
             style={{ borderColor: "var(--primary-hex)" }}>
            [ Contact Me ]
          </a>
        </motion.div>

        <motion.a href="#about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
}

/* ---------- About ---------- */
function About() {
  const focus = ["Active Directory", "Web Security", "Network Security", "Windows", "Linux", "Python"];
  return (
    <Section id="about" kicker="cat about.md" title="About">
      <div className="grid gap-10 md:grid-cols-3">
        <TiltCard className="md:col-span-2 rounded-xl border bg-card p-8">
          <p className="mb-4 text-lg">
            Hello! I am <span className="font-semibold text-primary">ILKIN FARAJOV</span>.
          </p>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            I am currently studying cybersecurity, specifically focusing on Red Teaming and penetration testing.
            I am continuously developing my knowledge and skills in areas such as Linux, Windows, Active Directory,
            SQL, Python, and web security.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            My goal is to become a professional penetration tester who identifies real-world security issues
            and contributes to their resolution.
          </p>
        </TiltCard>

        <div className="rounded-xl border bg-card p-8">
          <div className="mb-4 flex items-center gap-2 font-mono text-sm text-primary">
            <Cpu className="h-4 w-4" /> currently_focusing
          </div>
          <ul className="space-y-2">
            {focus.map((f) => (
              <li key={f} className="flex items-center gap-2 font-mono text-sm">
                <span className="text-primary">✔</span> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Interactive Terminal ---------- */
type TermLine = { type: "cmd" | "out" | "err"; text: string };

const ABOUT_LINES = [
  "Hello! I am ILKIN FARAJOV.",
  "Cybersecurity student — focus: Red Teaming & penetration testing.",
  "Continuously learning: Linux, Windows, Active Directory, SQL, Python, web security.",
  "Goal: become a professional penetration tester who ships real-world impact.",
];

const HELP_LINES = [
  "Available commands:",
  "  help              show this help",
  "  about             print bio (alias: cat about.md)",
  "  skills            list core skills & tools (alias: ls ./skills)",
  "  projects          list projects (alias: ls projects)",
  "  whoami            print current user",
  "  clear             clear the screen",
];

function InteractiveTerminal() {
  const [history, setHistory] = useState<TermLine[]>([
    { type: "out", text: "Welcome to ilkin.farajov terminal. Type 'help' to get started." },
  ]);
  const [input, setInput] = useState("");
  const [past, setPast] = useState<string[]>([]);
  const [pastIdx, setPastIdx] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const print = (lines: TermLine[]) => setHistory((h) => [...h, ...lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    const prompt: TermLine = { type: "cmd", text: cmd };
    if (!cmd) { print([{ type: "cmd", text: "" }]); return; }
    setPast((p) => [...p, cmd]);
    setPastIdx(-1);

    const lower = cmd.toLowerCase();
    if (lower === "clear" || lower === "cls") { setHistory([]); return; }
    if (lower === "help" || lower === "?") { print([prompt, ...HELP_LINES.map((t) => ({ type: "out" as const, text: t }))]); return; }
    if (lower === "about" || lower === "cat about.md") { print([prompt, ...ABOUT_LINES.map((t) => ({ type: "out" as const, text: t }))]); return; }
    if (lower === "projects" || lower === "ls projects" || lower === "ls ./projects") {
      print([prompt, { type: "out", text: `total ${projects.length}` }, ...projects.map((p) => ({ type: "out" as const, text: `- ${p.title}  [${p.tags.join(", ")}]` }))]);
      return;
    }
    if (lower === "skills" || lower === "ls ./skills" || lower === "ls skills") {
      print([
        prompt,
        { type: "out", text: "# core" },
        ...skillsBars.map((s) => ({ type: "out" as const, text: `- ${s.name} :: ${s.value}%` })),
        { type: "out", text: "" },
        { type: "out", text: "# tooling" },
        ...tools.map((t) => ({ type: "out" as const, text: `- ${t.name}` })),
      ]);
      return;
    }
    if (lower === "whoami") { print([prompt, { type: "out", text: "ilkin.farajov" }]); return; }
    print([prompt, { type: "err", text: `command not found: ${cmd}. Type 'help'.` }]);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { run(input); setInput(""); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!past.length) return;
      const idx = pastIdx === -1 ? past.length - 1 : Math.max(0, pastIdx - 1);
      setPastIdx(idx); setInput(past[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (pastIdx === -1) return;
      const idx = pastIdx + 1;
      if (idx >= past.length) { setPastIdx(-1); setInput(""); } else { setPastIdx(idx); setInput(past[idx]); }
    }
  };

  return (
    <Section id="terminal" kicker="./terminal --interactive" title="Interactive Terminal">
      <div
        onClick={() => inputRef.current?.focus()}
        className="rounded-xl border bg-card overflow-hidden font-mono text-sm shadow-lg"
      >
        <div className="flex items-center gap-2 border-b px-4 py-2 bg-black/40">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-green-500/70" />
          <span className="ml-3 text-xs text-muted-foreground">ilkin.farajov@sec: ~</span>
        </div>
        <div
          ref={scrollRef}
          className="h-80 overflow-y-auto p-4 space-y-1 bg-black/60"
        >
          {history.map((l, i) => {
            if (l.type === "cmd") {
              return (
                <div key={i} className="flex gap-2">
                  <span className="text-primary shrink-0">ilkin.farajov:~$</span>
                  <span className="text-foreground break-all">{l.text}</span>
                </div>
              );
            }
            return (
              <div key={i} className={l.type === "err" ? "text-red-400 whitespace-pre-wrap" : "text-muted-foreground whitespace-pre-wrap"}>
                {l.text}
              </div>
            );
          })}
          <div className="flex gap-2 items-center">
            <span className="text-primary shrink-0">ilkin.farajov:~$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal input"
              className="flex-1 bg-transparent outline-none border-none text-foreground caret-transparent"
            />
            <span className="term-cursor" />
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Skills ---------- */
function Skills() {
  return (
    <Section id="skills" kicker="ls ./skills" title="Skills">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6 rounded-xl border bg-card p-8">
          <h3 className="font-mono text-sm text-primary">// core</h3>
          {skillsBars.map((s) => <SkillBar key={s.name} {...s} />)}
        </div>
        <div className="rounded-xl border bg-card p-8">
          <h3 className="mb-6 font-mono text-sm text-primary">// tooling</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {tools.map((t) => (
              <motion.div key={t.name} whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 rounded-lg border bg-background/50 px-3 py-3 font-mono text-sm transition-colors hover:border-primary hover:text-primary">
                <t.icon className="h-4 w-4" />
                {t.name}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Projects ---------- */
function Projects() {
  return (
    <Section id="projects" kicker="./projects --list" title="Projects">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <motion.div key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.05, duration: 0.5 }}>
            <TiltCard className="group h-full rounded-xl border bg-card p-6 transition-colors hover:border-primary">
              <div className="mb-4 flex h-32 items-center justify-center rounded-lg border" style={{ background: "color-mix(in oklab, var(--primary) 8%, transparent)" }}>
                <p.icon className="h-12 w-12 text-primary transition-transform group-hover:scale-110" />
              </div>
              <div className="mb-2 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full border border-primary/40 px-2 py-0.5 font-mono text-[10px] text-primary">{t}</span>
                ))}
              </div>
              <h3 className="mb-2 font-mono text-lg font-semibold">{p.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{p.desc}</p>
              <div className="flex items-center justify-between font-mono text-xs">
                <a href="#" className="flex items-center gap-1 text-primary hover:text-glow">
                  <Github className="h-4 w-4" /> GitHub
                </a>
                <a href="#" className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                  Read More <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Timeline ---------- */
function Timeline() {
  return (
    <Section id="timeline" kicker="git log --oneline" title="Timeline">
      <div className="relative mx-auto max-w-3xl">
        <div className="absolute left-4 top-0 bottom-0 w-px md:left-1/2" style={{ background: "color-mix(in oklab, var(--primary) 40%, transparent)" }} />
        {timeline.map((t, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className={`relative mb-10 flex md:justify-${i % 2 === 0 ? "start" : "end"}`}>
            <div className={`ml-12 md:ml-0 md:w-[45%] ${i % 2 === 0 ? "md:mr-auto md:pr-8 md:text-right" : "md:ml-auto md:pl-8"}`}>
              <div className="rounded-xl border bg-card p-6">
                <div className="mb-1 font-mono text-xs text-primary">{t.year}</div>
                <h3 className="mb-1 font-semibold">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
              </div>
            </div>
            <span className="absolute left-4 top-6 h-3 w-3 -translate-x-1/2 rounded-full md:left-1/2"
              style={{ background: "var(--primary-hex)", boxShadow: "0 0 12px var(--primary-hex)" }} />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Certifications ---------- */
const targetCerts = [
  { name: "eJPT", full: "Junior Penetration Tester", org: "INE / eLearnSecurity", status: "Target" },
  { name: "eCCPT", full: "Certified Cybersecurity Professional", org: "INE / eLearnSecurity", status: "Target" },
  { name: "OSCP", full: "Offensive Security Certified Professional", org: "Offensive Security", status: "Target" },
];

function Certifications() {
  return (
    <Section id="certifications" kicker="./certs" title="Certifications">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {targetCerts.map((cert) => (
          <TiltCard key={cert.name} className="rounded-xl border bg-card p-8 text-center transition-colors hover:border-primary">
            <Award className="mx-auto mb-4 h-12 w-12 text-primary opacity-80" />
            <div className="mb-3 inline-flex rounded-lg px-3 py-1 font-mono text-xs text-primary" style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)" }}>
              {cert.status}
            </div>
            <h3 className="mb-1 font-mono text-xl font-bold">{cert.name}</h3>
            <p className="mb-2 text-sm font-medium text-primary">{cert.full}</p>
            <p className="text-xs text-muted-foreground">{cert.org}</p>
          </TiltCard>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Experience ---------- */
function Experience() {
  return (
    <Section id="experience" kicker="./experience" title="Experience">
      <div className="rounded-xl border bg-card p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-lg p-3" style={{ background: "color-mix(in oklab, var(--primary) 15%, transparent)" }}>
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-mono text-lg font-semibold">Cybersecurity Student & Independent Researcher</h3>
            <p className="mb-3 font-mono text-sm text-primary">2026 — Present</p>
            <p className="text-muted-foreground">
              Building a portfolio of offensive-security labs, contributing to CTFs, and documenting
              methodology across Active Directory, web application security, and Linux/Windows privilege escalation.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
/* ---------- Contact ---------- */
function Contact() {
  const links = [
    { icon: Github, label: "GitHub", href: "https://github.com/ferecovilkin" },
    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/ferecovilkin/" },
    { icon: Mail, label: "Email", href: "mailto:ferecovilkin77@gmail.com" },
    { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/_ferecovilkin_/" },
  ];
  return (
    <Section id="contact" kicker="./contact --reach-out" title="Contact">
      <div className="rounded-2xl border bg-card p-10 text-center">
        <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
          Open to internships, collaborations, and CTF teams. Reach out on any of the channels below.
        </p>
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {links.map((l) => (
            <motion.a key={l.label} href={l.href} target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.05, y: -3 }}
              className="btn-glow flex flex-col items-center gap-2 rounded-xl border bg-background/50 p-5 font-mono text-sm hover:border-primary hover:text-primary">
              <l.icon className="h-6 w-6" />
              {l.label}
            </motion.a>
          ))}
        </div>
        <a href="/CV.pdf" download="Ilkin_Farajov_CV.pdf" className="btn-glow inline-flex items-center gap-2 rounded-md px-6 py-3 font-mono text-sm font-semibold"
          style={{ background: "var(--primary-hex)", color: "var(--primary-foreground)" }}>
          <Download className="h-4 w-4" /> Download CV
        </a>
      </div>
    </Section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="relative z-10 border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 font-mono text-sm text-muted-foreground md:flex-row">
        <p>© 2026 ILKIN FARAJOV</p>
        <p>Built with <span className="text-primary">React</span> & <span className="text-primary">Tailwind</span></p>
      </div>
    </footer>
  );
}
