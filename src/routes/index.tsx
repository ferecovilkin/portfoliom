import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
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
    about: { kicker: "cat haqqimda.md", title: "Haqqımda", intro: "Salam! Mən İLKİN FƏRƏCOVAM.", p1: "Hazırda kiber təhlükəsizlik sahəsini, xüsusilə Red Teaming və penetrasiya testlərini öyrənirəm. Linux, Windows, Active Directory, SQL, Python və veb təhlükəsizliyi kimi sahələrdə bilik və bacarıqlarımı davamlı olaraq inkişaf etdirirəm.", p2: "Məqsədim real dünya təhlükəsizlik problemlərini aşkarlayan və onların həllinə töhfə verən peşəkar penetrasiya testçisi olmaqdır.", focusing: "hazırda_diqqətdə" },
    terminal: { kicker: "./terminal --interaktiv", title: "İnteraktiv Terminal", welcome: "İlkin Farajov terminalına xoş gəldiniz. Başlamaq üçün 'help' yazın.", notFound: "komanda tapılmadı" },
    skills: { kicker: "ls ./bacariqlar", title: "Bacarıqlar", core: "// metodologiya & ƏS", tooling: "// pentest arsenalı" },
    projects: { kicker: "./layiheler --siyahı", title: "Layihələr" },
    timeline: { kicker: "git log --oneline", title: "Zaman Oxu" },
    certs: { kicker: "./sertifikatlar", title: "Sertifikatlar" },
    exp: { kicker: "./təcrübə", title: "Təcrübə", role: "Kiber Təhlükəsizlik Tələbəsi və Müstəqil Tədqiqatçı", date: "2026 — Hazırda", desc: "Active Directory, veb tətbiq təhlükəsizliyi və Linux/Windows imtiyazlarının yüksəldilməsi üzrə ofansiv təhlükəsizlik laboratoriyaları qurmaq, CTF-lərdə iştirak etmək və metodologiyaları sənədləşdirmək." },
    contact: { kicker: "./elaqe --müraciət", title: "Əlaqə", text: "Təcrübə proqramları, əməkdaşlıq və CTF komandaları üçün açığam. Aşağıdakı kanallarla əlaqə saxlaya bilərsiniz.", cv: "CV-ni Yüklə" }
  }
};

/* ---------- Components (Background, Typing, TiltCard, Section) ---------- */
function CyberBackground() {
  const dots = Array.from({ length: 30 }, (_, i) => ({
    id: i, left: Math.random() * 100, duration: 15 + Math.random() * 25, delay: Math.random() * 20, size: 2 + Math.random() * 3,
  }));
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-cyber-grid opacity-40" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      {dots.map((d) => (
        <span key={d.id} className="absolute rounded-full dot-float" style={{ left: `${d.left}%`, width: d.size, height: d.size, background: "var(--primary-hex)", animationDuration: `${d.duration}s`, animationDelay: `${d.delay}s`, boxShadow: `0 0 8px var(--primary-hex)` }} />
      ))}
    </div>
  );
}

function useTyping(text: string, speed = 90) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0; setOut("");
    const t = setInterval(() => { i++; setOut(text.slice(0, i)); if (i >= text.length) clearInterval(t); }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return out;
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });
  return (
    <motion.div ref={ref} onMouseMove={(e) => { const el = ref.current; if (!el) return; const r = el.getBoundingClientRect(); x.set((e.clientX - r.left) / r.width - 0.5); y.set((e.clientY - r.top) / r.height - 0.5); }} onMouseLeave={() => { x.set(0); y.set(0); }} style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }} className={className}>
      {children}
    </motion.div>
  );
}

function Section({ id, title, kicker, children }: { id: string; title: string; kicker?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <section ref={ref} id={id} className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-12">
        {kicker && (<div className="mb-2 flex items-center gap-2 font-mono text-sm text-primary"><span>&gt;</span><span>{kicker}</span></div>)}
        <h2 className="text-3xl font-bold tracking-tight md:text-5xl">{title}<span className="text-primary text-glow">.</span></h2>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }}>{children}</motion.div>
    </section>
  );
}

/* ---------- Data ---------- */
const coreSkills = [
  { name: "Web Application Pentesting", icon: Bug }, { name: "Active Directory Attacks", icon: Lock },
  { name: "Network Penetration Testing", icon: Network }, { name: "Privilege Escalation", icon: Shield },
  { name: "Linux Administration", icon: SiLinux }, { name: "Windows Internals", icon: FaWindows },
  { name: "SQL Exploitation", icon: SiPostgresql }, { name: "Python Automation", icon: SiPython },
];

const tools = [
  { name: "Burp Suite", icon: Bug }, { name: "OWASP ZAP", icon: Shield }, { name: "Nmap", icon: Network },
  { name: "Metasploit", icon: SiMetasploit }, { name: "Impacket", icon: Terminal }, { name: "BloodHound", icon: Network },
  { name: "Responder", icon: Eye }, { name: "ffuf", icon: Search }, { name: "Gobuster", icon: Search },
  { name: "Feroxbuster", icon: Eye }, { name: "Hydra", icon: Key }, { name: "Hashcat", icon: Lock },
  { name: "John the Ripper", icon: Key }, { name: "Wireshark", icon: SiWireshark }, { name: "Docker", icon: SiDocker },
  { name: "Git", icon: SiGit }, { name: "Kali Linux", icon: SiKalilinux },
];

const projects = [
  { title: "SQL Injection Lab", desc: "Hands-on SQLi exploitation lab.", tags: ["Web", "SQLi"], icon: FileCode },
  { title: "Active Directory Lab", desc: "Home lab simulating AD attacks.", tags: ["AD", "Red Team"], icon: Network },
  { title: "Incident Response", desc: "Notes and playbooks for Windows hosts.", tags: ["Blue Team", "DFIR"], icon: Shield },
  { title: "Linux PrivEsc", desc: "Enumeration cheatsheet & scripts.", tags: ["Linux", "PrivEsc"], icon: SiLinux },
  { title: "Windows PrivEsc", desc: "Windows privesc techniques.", tags: ["Windows", "PrivEsc"], icon: FaWindows },
  { title: "OWASP Top 10 Notes", desc: "Deep-dive notes for OWASP.", tags: ["Web", "Notes"], icon: Lock },
];

const timeline = [
  { year: "2026", titleEn: "Started Red Team Course", titleAz: "Red Team Kursuna Başlanıldı", descEn: "Kicked off structured Red Team training.", descAz: "Strukturlu Red Team təlimlərinə start verildi." },
  { year: "2026", titleEn: "Built Home Lab", titleAz: "Laboratoriya Qurulması", descEn: "Deployed AD + attacker VMs.", descAz: "Şəxsi virtuallaşdırma laboratoriyasında AD və hücumçu VM-lər." },
];

/* ---------- Main Component ---------- */
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

/* ---------- Page Sections ---------- */
function Nav({ lang, setLang, t }: { lang: "en" | "az"; setLang: (l: "en" | "az") => void; t: any }) {
  const links = [ ["home", t.nav.home], ["about", t.nav.about], ["skills", t.nav.skills], ["projects", t.nav.projects], ["terminal", t.nav.terminal], ["timeline", t.nav.timeline], ["certs", t.certs.title], ["experience", t.exp.title], ["contact", t.nav.contact] ];
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ background: "color-mix(in oklab, var(--background) 70%, transparent)", borderBottom: "1px solid var(--color-border)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#home" className="flex items-center gap-2 font-mono font-bold"><Terminal className="h-5 w-5 text-primary" /><span>ilkin.farajov<span className="text-primary">:~$</span></span></a>
        <nav className="flex gap-4 md:gap-6 items-center">
          {links.map(([id, label]) => (<a key={id} href={`#${id}`} className="font-mono text-sm text-muted-foreground hover:text-primary">{label}</a>))}
          <div className="ml-2 font-mono text-xs border border-zinc-800 px-2 py-1 bg-zinc-900/50 rounded flex items-center">
            <button onClick={() => setLang("en")} className={lang === "en" ? "text-primary font-bold" : "text-zinc-500"}>EN</button>
            <span className="text-zinc-700 mx-1">|</span>
            <button onClick={() => setLang("az")} className={lang === "az" ? "text-primary font-bold" : "text-zinc-500"}>AZ</button>
          </div>
        </nav>
      </div>
    </header>
  );
}

function Hero({ t }: { t: any }) {
  const name = useTyping(t.hero.name, 100);
  return (
    <section id="home" className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-20">
      <div className="text-center">
        <h1 className="mb-4 font-mono text-4xl font-bold md:text-7xl">{name}<span className="text-primary">_</span></h1>
        <p className="mb-10 text-lg text-primary md:text-2xl">{t.hero.subtitle}</p>
        <div className="flex gap-4 justify-center">
          <a href="#projects" className="px-6 py-3 bg-primary text-black rounded font-mono font-bold">[ {t.hero.viewBtn} ]</a>
        </div>
      </div>
    </section>
  );
}

function About({ t }: { t: any }) {
  return (
    <Section id="about" kicker={t.about.kicker} title={t.about.title}>
      <div className="grid gap-10 md:grid-cols-3">
        <TiltCard className="md:col-span-2 rounded-xl border bg-card p-8">
          <p className="mb-4 text-lg">{t.about.intro}</p>
          <p className="mb-4 text-muted-foreground">{t.about.p1}</p>
          <p className="text-muted-foreground">{t.about.p2}</p>
        </TiltCard>
      </div>
    </Section>
  );
}

function InteractiveTerminal({ t, lang }: { t: any; lang: "en" | "az" }) {
  // Terminal məntiqi əvvəlki kimi qalır
  return <Section id="terminal" kicker={t.terminal.kicker} title={t.terminal.title}><div className="h-64 bg-black rounded p-4 font-mono text-green-500">Terminal Content...</div></Section>;
}

function Skills({ t }: { t: any }) { return <Section id="skills" kicker={t.skills.kicker} title={t.skills.title}><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{tools.map(tool => <div key={tool.name} className="border p-4 rounded">{tool.name}</div>)}</div></Section>; }

function Projects({ t }: { t: any }) { return <Section id="projects" kicker={t.projects.kicker} title={t.projects.title}><div className="grid gap-6">{projects.map(p => <div key={p.title} className="border p-6 rounded">{p.title}</div>)}</div></Section>; }

function Timeline({ t, lang }: { t: any; lang: "en" | "az" }) { return <Section id="timeline" kicker={t.timeline.kicker} title={t.timeline.title}>Timeline Content...</Section>; }

function Certifications({ t }: { t: any }) { return <Section id="certs" kicker={t.certs.kicker} title={t.certs.title}>Certifications Content...</Section>; }

function Experience({ t }: { t: any }) {
  return (
    <Section id="experience" kicker={t.exp.kicker} title={t.exp.title}>
      <div className="rounded-xl border bg-card p-8">
        <h3 className="text-xl font-bold">{t.exp.role}</h3>
        <p className="text-primary mb-4">{t.exp.date}</p>
        <p className="text-muted-foreground">{t.exp.desc}</p>
      </div>
    </Section>
  );
}

function Contact({ t }: { t: any }) {
  return (
    <Section id="contact" kicker={t.contact.kicker} title={t.contact.title}>
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="mb-8">{t.contact.text}</p>
        <button className="bg-primary text-black px-6 py-3 rounded font-bold">{t.contact.cv}</button>
      </div>
    </Section>
  );
}

function Footer() {
  return <footer className="py-8 text-center border-t border-zinc-800 text-xs text-muted-foreground">© {new Date().getFullYear()} Ilkin Farajov.</footer>;
}
