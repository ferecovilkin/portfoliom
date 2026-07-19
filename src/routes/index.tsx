import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Terminal, Eye, Search, Key, Shield, Network, Bug, Cpu } from "lucide-react";
import {
  Shield, Terminal, Github, Linkedin, Mail, Key, Search, Eye,
  ExternalLink, ChevronDown, Award, Briefcase, Lock, Network, Bug, FileCode, Cpu
} from "lucide-react";
import {
  SiLinux, SiKalilinux, SiPython, SiPostgresql, SiWireshark,
  SiMetasploit, SiDocker, SiGit, SiVirtualbox,
} from "react-icons/si";
import { FaWindows } from "react-icons/fa";

export const Route = createFileRoute("/")({
  component: Portfolio,
});

/* ---------- TRANSLATIONS OBJECT ---------- */
const translations = {
  en: {
    langKey: "en",
    nav: { home: "Home", about: "About", skills: "Skills", projects: "Projects", terminal: "Terminal", timeline: "Timeline", contact: "Contact" },
    hero: { name: "ILKIN FARAJOV", status: "available for opportunities", subtitle: "Cyber Security · Red Team · Penetration Tester", viewBtn: "View Projects", contactBtn: "Contact Me" },
    about: { kicker: "cat about.md", title: "About", intro: "Hello! I am ILKIN FARAJOV.", p1: "I am currently studying cybersecurity, specifically focusing on Red Teaming and penetration testing. I am continuously developing my knowledge and skills in areas such as Linux, Windows, Active Directory, SQL, Python, and web security.", p2: "My goal is to become a professional penetration tester who identifies real-world security issues and contributes to their resolution.", focusing: "currently_focusing" },
    terminal: { kicker: "./terminal --interactive", title: "Interactive Terminal", welcome: "Welcome to ilkin.farajov terminal. Type 'help' to get started.", notFound: "command not found" },
    skills: { kicker: "ls ./skills", title: "Skills", core: "// methodologies & OS", tooling: "// pentest arsenal" },
    projects: { kicker: "./projects --list", title: "Projects" },
    timeline: { kicker: "git log --oneline", title: "Timeline" },
    certs: { kicker: "./certs", title: "Certifications" },
    exp: { kicker: "./experience", title: "Experience", role: "Cybersecurity Student & Independent Researcher", date: "2026 — Present", desc: "Building a portfolio of offensive-security labs, contributing to CTFs, and documenting methodology across Active Directory, web application security, and Linux/Windows privilege escalation." },
    contact: { kicker: "./contact --reach-out", title: "Contact", text: "Open to internships, collaborations, and CTF teams. Reach out on any of the channels below.", cv: "Download CV" }
  },
  az: {
    langKey: "az",
    nav: { home: "Ana Səhifə", about: "Haqqımda", skills: "Bacarıqlar", projects: "Layihələr", terminal: "Terminal", timeline: "Zaman Oxu", contact: "Əlaqə" },
    hero: { name: "İLKİN FƏRƏCOV", status: "vakansiyalar üçün açıqdır", subtitle: "Kiber Təhlükəsizlik · Red Team · Penetrasiya Testçisi", viewBtn: "Layihələrə Bax", contactBtn: "Əlaqə Saxla" },
    about: { kicker: "cat haqqimda.md", title: "Haqqımda", intro: "Salam! Mən İLKİN FƏRƏCOVAM.", p1: "Hazırda kiber təhlükəsizlik sahəsini, xüsusilə Red Teaming və penetrasiya testlərini öyrənirəm. Linux, Windows, Active Directory, SQL, Python və veb təhlükəsizliyi kimi sahələrdə bilik və bacarıqlarımı davamlı olaraq inkişaf etdirirəm.", p2: "Məqsədim real dünya təhlükəsizlik problemlərini aşkarlayan və niiden həllinə töhfə verən peşəkar penetrasiya testçisi olmaqdır.", focusing: "hazırda_diqqətdə" },
    terminal: { kicker: "./terminal --interaktiv", title: "İnteraktiv Terminal", welcome: "İlkin Farajov terminalına xoş gəldiniz. Başlamaq üçün 'help' yazın.", notFound: "komanda tapılmadı" },
    skills: { kicker: "ls ./bacariqlar", title: "Bacarıqlar", core: "// metodologiya & ƏS", tooling: "// pentest arsenalı" },
    projects: { kicker: "./layiheler --siyahı", title: "Layihələr" },
    timeline: { kicker: "git log --oneline", title: "Zaman Oxu" },
    certs: { kicker: "./sertifikatlar", title: "Sertifikatlar" },
    exp: { kicker: "./təcrübə", title: "Təcrübə", role: "Kiber Təhlükəsizlik Tələbəsi və Müstəqil Tədqiqatçı", date: "2026 — Hazırda", desc: "Active Directory, veb tətbiq təhlükəsizliyi və Linux/Windows imtiyazlarının yüksəldilməsi üzrə ofansiv təhlükəsizlik laboratoriyaları qurmaq, CTF-lərdə iştirak etmək və metodologiyaları sənədləşdirmək." },
    contact: { kicker: "./elaqe --müraciət", title: "Əlaqə", text: "Təcrübə proqramları, əməkdaşlıq və CTF komandaları üçün açığam. Aşağıdakı kanallarla əlaqə saxlaya bilərsiniz.", cv: "CV-ni Yüklə" }
  }
};

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
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
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

/* ---------- DATA ---------- */
const coreSkills = [
  { name: "Web Application Pentesting", icon: Bug },
  { name: "Active Directory Attacks", icon: Lock },
  { name: "Network Penetration Testing", icon: Network },
  { name: "Privilege Escalation", icon: Shield },
  { name: "Linux Administration", icon: SiLinux },
  { name: "Windows Internals", icon: FaWindows },
  { name: "SQL Exploitation", icon: SiPostgresql },
  { name: "Python Automation", icon: SiPython },
];

const tools = [
  { name: "Burp Suite", icon: Bug },
  { name: "OWASP ZAP", icon: Shield },
  { name: "Nmap", icon: Network },
  { name: "Metasploit", icon: SiMetasploit },
  { name: "Impacket", icon: Terminal },
  { name: "BloodHound", icon: Network },
  { name: "Responder", icon: Eye },
  { name: "ffuf", icon: Search },
  { name: "Gobuster", icon: Search },
  { name: "Feroxbuster", icon: Eye },
  { name: "Hydra", icon: Key },
  { name: "Hashcat", icon: Lock },
  { name: "John the Ripper", icon: Key },
  { name: "Wireshark", icon: SiWireshark },
  { name: "Docker", icon: SiDocker },
  { name: "Git", icon: SiGit },
  { name: "Kali Linux", icon: SiKalilinux },
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
  { year: "2026", titleEn: "Started Red Team Course", titleAz: "Red Team Kursuna Başlanıldı", descEn: "Kicked off structured Red Team training.", descAz: "Strukturlu Red Team təlimlərinə start verildi." },
  { year: "2026", titleEn: "Built Home Lab", titleAz: "Laboratoriya Qurulması", descEn: "Deployed AD + attacker VMs in a private virtualization lab.", descAz: "Şəxsi virtuallaşdırma laboratoriyasında AD və hücumçu VM-lər quruldu." },
  { year: "2026", titleEn: "Started Web Pentesting", titleAz: "Veb Pentestinqə Başlanıldı", descEn: "Working through PortSwigger Academy & OWASP labs.", descAz: "PortSwigger Academy və OWASP laboratoriyaları üzərində iş." },
  { year: "2026", titleEn: "Certification Prep", titleAz: "Sertifikat Hazırlığı", descEn: "Preparing for international offensive-security certification.", descAz: "Beynəlxalq ofansiv təhlükəsizlik sertifikatına hazırlıq." },
];

/* ---------- MAIN ---------- */
export default function Portfolio() {
  const [lang, setLang] = useState<"en" | "az">("en");
  const t = translations[lang];

  return (
    <div className="relative min-h-screen bg-background text-foreground dark">
      <CyberBackground />
      <Nav lang={lang} setLang={setLang} t={t} />
      <Hero t={t} />
      <About t={t} />
      <Skills t={t} />
      <Projects t={t} />
      <InteractiveTerminal t={t} lang={lang} />
      <Timeline t={t} lang={lang} />
      <Certifications t={t} />
      <Experience t={t} />
      <Contact t={t} />
      <Footer />
    </div>
  );
}

/* ---------- Nav ---------- */
function Nav({ lang, setLang, t }: { lang: "en" | "az"; setLang: (l: "en" | "az") => void; t: any }) {
  const links = [
    ["home", t.nav.home], ["about", t.nav.about], ["skills", t.nav.skills],
    ["projects", t.nav.projects], ["terminal", t.nav.terminal], ["timeline", t.nav.timeline],
    ["certs", t.certs.title], ["experience", t.exp.title], ["contact", t.nav.contact],
  ];
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ background: "color-mix(in oklab, var(--background) 70%, transparent)", borderBottom: "1px solid var(--color-border)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#home" className="flex items-center gap-2 font-mono font-bold">
          <Terminal className="h-5 w-5 text-primary" />
          <span>ilkin.farajov<span className="text-primary">:~$</span></span>
        </a>
        <nav className="flex gap-4 md:gap-6 items-center overflow-x-auto max-w-full md:max-w-none no-scrollbar py-1">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="font-mono text-xs md:text-sm text-muted-foreground transition-colors hover:text-primary whitespace-nowrap">
              {label}
            </a>
          ))}
          
          {/* Language Switcher */}
          <div className="ml-2 font-mono text-xs border border-zinc-800 px-2 py-1 bg-zinc-900/50 rounded select-none flex items-center shrink-0">
            <button 
              onClick={() => setLang("en")} 
              aria-label="Switch language to English"
              className={`px-1 transition-colors ${lang === "en" ? "text-primary font-bold" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              EN
            </button>
            <span className="text-zinc-700 mx-1">|</span>
            <button 
              onClick={() => setLang("az")} 
              aria-label="Switch language to Azerbaijani"
              className={`px-1 transition-colors ${lang === "az" ? "text-primary font-bold" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              AZ
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero({ t }: { t: any }) {
  const name = useTyping(t.hero.name, 100);
  return (
    <section id="home" className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-20">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs"
          style={{ borderColor: "var(--primary-hex)", color: "var(--primary-hex)" }}>
          <span className="h-2 w-2 rounded-full bg-primary" />
          {t.hero.status}
        </motion.div>

        <h1 className="mb-4 font-mono text-4xl font-bold tracking-tight md:text-7xl">
          {name}<span className="text-primary cursor-blink">_</span>
        </h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="mb-3 text-lg font-medium text-primary text-glow md:text-2xl">
          {t.hero.subtitle}
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
            [ {t.hero.viewBtn} ]
          </a>
          <a href="#contact"
             className="btn-glow inline-flex items-center gap-2 rounded-md border px-6 py-3 font-mono text-sm font-semibold text-primary"
             style={{ borderColor: "var(--primary-hex)" }}>
            [ {t.hero.contactBtn} ]
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
function About({ t }: { t: any }) {
  const focus = ["Active Directory", "Web Security", "Network Security", "Windows", "Linux", "Python"];
  return (
    <Section id="about" kicker={t.about.kicker} title={t.about.title}>
      <div className="grid gap-10 md:grid-cols-3">
        <TiltCard className="md:col-span-2 rounded-xl border bg-card p-8">
          <p className="mb-4 text-lg">
            {t.about.intro}
          </p>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            {t.about.p1}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t.about.p2}
          </p>
        </TiltCard>

        <div className="rounded-xl border bg-card p-8">
          <div className="mb-4 flex items-center gap-2 font-mono text-sm text-primary">
            <Cpu className="h-4 w-4" /> {t.about.focusing}
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

function InteractiveTerminal({ t, lang }: { t: any; lang: "en" | "az" }) {
  const ABOUT_LINES = lang === "en" ? [
    "Hello! I am ILKIN FARAJOV.",
    "Cybersecurity student — focus: Red Teaming & penetration testing.",
    "Continuously learning: Linux, Windows, Active Directory, SQL, Python, web security.",
    "Goal: become a professional penetration tester who ships real-world impact.",
  ] : [
    "Salam! Mən İLKİN FƏRƏCOVAM.",
    "Kiber təhlükəsizlik tələbəsi — istiqamət: Red Teaming və penetrasiya testləri.",
    "Davamlı öyrənilir: Linux, Windows, Active Directory, SQL, Python, veb təhlükəsizliyi.",
    "Məqsəd: real təsir yaradan peşəkar penetrasiya testçisi olmaq.",
  ];

  const HELP_LINES = lang === "en" ? [
    "Available commands:",
    "  help             show this help",
    "  about            print bio (alias: cat about.md)",
    "  skills           list core skills & tools (alias: ls ./skills)",
    "  projects         list projects (alias: ls projects)",
    "  whoami           print current user",
    "  clear            clear the screen",
  ] : [
    "Mövcud komandalar:",
    "  help                 kömək menyusunu göstər",
    "  about                bio məlumatı çıxar (alias: cat about.md)",
    "  skills               bacarıq və alətləri siyahıla (alias: ls ./skills)",
    "  projects             layihələri siyahıla (alias: ls projects)",
    "  whoami               cari istifadəçini göstər",
    "  clear                ekranı təmizlə",
  ];

  const [history, setHistory] = useState<TermLine[]>([
    { type: "out", text: t.terminal.welcome },
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
    const prompt: TermLine = { type: "cmd" as const, text: cmd };
    if (!cmd) { print([{ type: "cmd" as const, text: "" }]); return; }
    setPast((p) => [...p, cmd]);
    setPastIdx(-1);

    const lower = cmd.toLowerCase();
    if (lower === "clear" || lower === "cls") { setHistory([]); return; }
    if (lower === "help" || lower === "?") { print([prompt, ...HELP_LINES.map((text) => ({ type: "out" as const, text }))]); return; }
    if (lower === "about" || lower === "cat about.md") { print([prompt, ...ABOUT_LINES.map((text) => ({ type: "out" as const, text }))]); return; }
    if (lower === "projects" || lower === "ls projects" || lower === "ls ./projects") {
      print([prompt, { type: "out" as const, text: `total ${projects.length}` }, ...projects.map((p) => ({ type: "out" as const, text: `- ${p.title}  [${p.tags.join(", ")}]` }))]);
      return;
    }
    if (lower === "skills" || lower === "ls ./skills" || lower === "ls skills") {
      print([
        prompt,
        { type: "out" as const, text: "# methodologies & OS" },
        ...coreSkills.map((s) => ({ type: "out" as const, text: `- ${s.name}` })),
        { type: "out" as const, text: "" },
        { type: "out" as const, text: "# pentest arsenal" },
        ...tools.map((tl) => ({ type: "out" as const, text: `- ${tl.name}` })),
      ]);
      return;
    }
    if (lower === "whoami") { print([prompt, { type: "out" as const, text: "ilkin.farajov" }]); return; }
    print([prompt, { type: "err" as const, text: `${t.terminal.notFound}: ${cmd}. Type 'help'.` }]);
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
    <Section id="terminal" kicker={t.terminal.kicker} title={t.terminal.title}>
      <div onClick={() => inputRef.current?.focus()} className="rounded-xl border bg-card overflow-hidden font-mono text-sm shadow-lg">
        <div className="flex items-center gap-2 border-b px-4 py-2 bg-black/40">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-green-500/70" />
          <span className="ml-3 text-xs text-muted-foreground">ilkin.farajov@sec: ~</span>
        </div>
        <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-1 bg-black/60">
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
              className="flex-1 bg-transparent outline-none border-none text-foreground caret-[var(--primary-hex)]"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Skills ---------- */
function Skills({ t }: { t: any }) {
  return (
    <Section id="skills" kicker={t.skills.kicker} title={t.skills.title}>
      <div className="grid gap-12 lg:grid-cols-2">

        <div className="rounded-2xl border bg-card p-10">
          <h3 className="mb-8 font-mono text-lg text-primary">
            {t.skills.core}
          </h3>

          <div className="grid gap-5">
            {coreSkills.map((skill) => (
              <motion.div
                key={skill.name}
                whileHover={{ scale: 1.03, y: -3 }}
                className="flex items-center gap-5 rounded-xl border bg-background/50 px-6 py-6 transition-all hover:border-primary hover:shadow-[0_0_20px_rgba(0,255,170,.2)]"
              >
                <skill.icon className="h-8 w-8 text-primary shrink-0" />

                <span className="font-mono text-lg font-semibold">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-10">
          <h3 className="mb-8 font-mono text-lg text-primary">
            Offensive Security Toolkit
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {tools.map((tool) => (
              <motion.div
                key={tool.name}
                whileHover={{ scale: 1.03, y: -3 }}
                className="flex items-center gap-3 rounded-xl border bg-background/50 px-5 py-5 transition-all hover:border-primary hover:shadow-[0_0_20px_rgba(0,255,170,.2)]"
              >
                <tool.icon className="h-6 w-6 text-primary shrink-0" />

                <span className="font-mono text-base">
                  {tool.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </Section>
  );
}

/* ---------- Projects ---------- */
function Projects({ t }: { t: any }) {
  return (
    <Section id="projects" kicker={t.projects.kicker} title={t.projects.title}>
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
                  {t.langKey === "az" ? "Daxil ol" : "Read More"} <ExternalLink className="h-3 w-3" />
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
function Timeline({ t, lang }: { t: any; lang: "en" | "az" }) {
  return (
    <Section id="timeline" kicker={t.timeline.kicker} title={t.timeline.title}>
      <div className="relative mx-auto max-w-3xl">
        <div className="absolute left-4 top-0 bottom-0 w-px md:left-1/2" style={{ background: "color-mix(in oklab, var(--primary) 40%, transparent)" }} />
        {timeline.map((tm, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className={`relative mb-10 flex ${i % 2 === 0 ? "md:justify-start" : "md:justify-end"}`}>
            <div className={`ml-12 md:ml-0 md:w-[45%] ${i % 2 === 0 ? "md:mr-auto md:pr-8 md:text-right" : "md:ml-auto md:pl-8"}`}>
              <div className="rounded-xl border bg-card p-6">
                <div className="mb-1 font-mono text-xs text-primary">{tm.year}</div>
                <h3 className="mb-1 font-semibold">{lang === "en" ? tm.titleEn : tm.titleAz}</h3>
                <p className="text-sm text-muted-foreground">{lang === "en" ? tm.descEn : tm.descAz}</p>
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

const getStatusLabel = (status: string, langKey: string) => {
  if (status === "Target") {
    return langKey === "az" ? "Hədəf" : "Target";
  }
  return status;
};

function Certifications({ t }: { t: any }) {
  return (
    <Section id="certs" kicker={t.certs.kicker} title={t.certs.title}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {targetCerts.map((cert) => (
          <TiltCard key={cert.name} className="rounded-xl border bg-card p-8 text-center transition-colors hover:border-primary">
            <Award className="mx-auto mb-4 h-12 w-12 text-primary opacity-80" />
            <div className="mb-3 inline-flex rounded-lg px-3 py-1 font-mono text-xs text-primary" style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)" }}>
              {getStatusLabel(cert.status, t.langKey)}
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
function Experience({ t }: { t: any }) {
  return (
    <Section id="experience" kicker={t.exp.kicker} title={t.exp.title}>
      <div className="rounded-xl border bg-card p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-lg p-3" style={{ background: "color-mix(in oklab, var(--primary) 15%, transparent)" }}>
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-mono text-lg font-semibold">{t.exp.role}</h3>
            <p className="mb-3 font-mono text-sm text-primary">{t.exp.date}</p>
            <p className="text-muted-foreground">
              {t.exp.desc}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Contact ---------- */
function Contact({ t }: { t: any }) {
  const links = [
    { icon: Github, label: "GitHub", href: "https://github.com/ferecovilkin" },
    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/ferecovilkin/" },
    { icon: Mail, label: "Email", href: "mailto:ilkinferajov@sec.az" }
  ];

  return (
    <Section id="contact" kicker={t.contact.kicker} title={t.contact.title}>
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-8 text-muted-foreground">{t.contact.text}</p>
        <div className="mb-10 flex flex-wrap justify-center gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border bg-card px-5 py-3 font-mono text-sm transition-colors hover:border-primary hover:text-primary"
            >
              <link.icon className="h-4 w-4 text-primary" />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="relative z-10 border-t border-zinc-900 bg-black/40 py-8 font-mono text-xs text-center text-muted-foreground">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          &copy; {new Date().getFullYear()} ilkin.farajov. All rights reserved.
        </div>
        <div className="flex items-center gap-2 text-zinc-600">
          <span>STATUS: SECURE</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
    </footer>
  );
}
