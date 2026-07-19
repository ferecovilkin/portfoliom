import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react"; // Layihənizdəki ikon kitabxanasına uyğun olaraq dəqiqləşdirin

type TermLine = { type: "cmd" | "out" | "err"; text: string };

interface Project {
  title: string;
  tags: string[];
}

interface CoreSkill {
  name: string;
}

interface Tool {
  name: string;
}

// Xarici dəyişənlərin (props və ya global state) mövcudluğunu sığortalamaq üçün default massivlər
declare const projects: Project[];
declare const coreSkills: CoreSkill[];
declare const tools: Tool[];

function InteractiveTerminal({ t, lang }: { t: any; lang: "en" | "az" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [past, setPast] = useState<string[]>([]);
  const [pastIdx, setPastIdx] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    "  help             show this help menu",
    "  about            print bio (alias: cat about.md)",
    "  skills           list core skills & tools (alias: ls ./skills)",
    "  projects         list projects (alias: ls projects)",
    "  whoami           print current user context",
    "  clear            clear the screen terminal buffer",
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
    { type: "out", text: t?.terminal?.welcome || (lang === "en" ? "Welcome to Red Team TTY Shell." : "Red Team TTY Shell-ə xoş gəlmisiniz.") },
  ]);

  // Terminal ekranının avtomatik aşağı sürüşməsi
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isOpen]);

  // Modal açılanda fokuslanma
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ESC düyməsi ilə modalın bağlanması dəstəyi
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const print = (lines: TermLine[]) => setHistory((h) => [...h, ...lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    const prompt: TermLine = { type: "cmd" as const, text: cmd };
    if (!cmd) { print([{ type: "cmd" as const, text: "" }]); return; }
    
    setPast((p) => [...p, cmd]);
    setPastIdx(-1);

    const lower = cmd.toLowerCase();
    const args = cmd.split(" ");
    const baseCmd = args[0].toLowerCase();

    // Standart Komandalar
    if (lower === "clear" || lower === "cls") { setHistory([]); return; }
    if (lower === "help" || lower === "?") { 
      const advancedHelp = lang === "en" ? [
        "  systeminfo                 print system architecture and network specs",
        "  nmap -sV -p- portfolio     run an aggressive port scan on the host",
        "  feroxbuster -u /url        fuzz web directories and hidden endpoints",
        "  hydra -l admin -P pass.txt brute-force custom authentication protocol",
        "  hashcat -m 0 hash.txt      crack captured MD5/SHA-256 administrative hashes",
        "  cat /etc/passwd            dump local user database file",
        "  sudo -l                    list available privileges for active user",
        "  sudo env /bin/sh           exploit SUID misconfiguration to spawn root shell"
      ] : [
        "  systeminfo                 sistem arxitekturası və şəbəkə göstəriciləri",
        "  nmap -sV -p- portfolio     host üzərində aqressiv port skanını başlat",
        "  feroxbuster -u /url        veb qovluqları və gizli keçidləri fuzzer et",
        "  hydra -l admin -P pass.txt autentifikasiya protokoluna brute-force et",
        "  hashcat -m 0 hash.txt      əldə edilmiş administrativ hashləri qır",
        "  cat /etc/passwd            lokal istifadəçi məlumat bazasını çıxar",
        "  sudo -l                    cari istifadəçinin mövcud imtiyazlarını siyahıla",
        "  sudo env /bin/sh           root shell almaq üçün SUID boşluğunu istismar et"
      ];
      print([
        prompt, 
        ...HELP_LINES.map((text) => ({ type: "out" as const, text })), 
        { type: "out" as const, text: "\n[+] Advanced Penetration Testing Arsenal:" }, 
        ...advancedHelp.map((text) => ({ type: "out" as const, text }))
      ]); 
      return; 
    }
    
    if (lower === "about" || lower === "cat about.md") { 
      print([prompt, ...ABOUT_LINES.map((text) => ({ type: "out" as const, text }))]); 
      return; 
    }
    
    if (lower === "projects" || lower === "ls projects" || lower === "ls ./projects") {
      const items = projects || [];
      print([
        prompt, 
        { type: "out" as const, text: `total ${items.length}` }, 
        ...items.map((p) => ({ type: "out" as const, text: `- ${p.title}  [${p.tags.join(", ")}]` }))
      ]);
      return;
    }
    
    if (lower === "skills" || lower === "ls ./skills" || lower === "ls skills") {
      const sItems = coreSkills || [];
      const tItems = tools || [];
      print([
        prompt,
        { type: "out" as const, text: "# methodologies & OS" },
        ...sItems.map((s) => ({ type: "out" as const, text: `- ${s.name}` })),
        { type: "out" as const, text: "" },
        { type: "out" as const, text: "# pentest arsenal" },
        ...tItems.map((tl) => ({ type: "out" as const, text: `- ${tl.name}` })),
      ]);
      return;
    }
    
    if (lower === "whoami") { print([prompt, { type: "out" as const, text: "ilkin.farajov" }]); return; }

    // Advanced Pentesting Logs simulation
    if (lower === "systeminfo") {
      print([
        prompt,
        { type: "out" as const, text: "Host Name:                 LNV-SLIM5-STATION" },
        { type: "out" as const, text: "OS Version:                Kali Linux v2026.2 / WSL2 Core" },
        { type: "out" as const, text: "Architecture:              x64-based PC (AMD Ryzen 7)" },
        { type: "out" as const, text: "Internal Subnet:           192.168.1.0/24" },
        { type: "out" as const, text: "Active DHCP Clients:       Samsung_TV (1.10), iPhone17 (1.12), Xiaomi15T (1.15), Galaxy-A35 (1.18)" },
        { type: "out" as const, text: "Local Password Vault:      KeePass 2 Core Encryption (Master Key size: 30 chars)" },
        { type: "out" as const, text: "Security Infrastructure:   Windows Defender ATP + AppArmor Enabled" }
      ]);
      return;
    }

    if (baseCmd === "nmap") {
      print([
        prompt,
        { type: "out" as const, text: "Starting Nmap 7.94 ( https://nmap.org ) at 2026-07-20 01:05 UTC" },
        { type: "out" as const, text: "Initiating ARP Ping Scan / SYN Stealth Scan..." },
        { type: "out" as const, text: "Scanning portfolio.local (127.0.0.1) [65535 ports]" },
        { type: "out" as const, text: "Discovered open port 22/tcp on 127.0.0.1" },
        { type: "out" as const, text: "Discovered open port 80/tcp on 127.0.0.1" },
        { type: "out" as const, text: "Discovered open port 443/tcp on 127.0.0.1" },
        { type: "out" as const, text: "Discovered open port 3389/tcp on 127.0.0.1" },
        { type: "out" as const, text: "\nPORT     STATE SERVICE      VERSION" },
        { type: "out" as const, text: "22/tcp   open  ssh          OpenSSH 9.2p1 Debian 2+deb12u2 (protocol 2.0)" },
        { type: "out" as const, text: "80/tcp   open  http         nginx 1.22.1 (Vite/React Engine)" },
        { type: "out" as const, text: "443/tcp  open  ssl/http     nginx 1.22.1 (TLSv1.3 secure channel)" },
        { type: "out" as const, text: "3389/tcp open  ms-wbt-server Microsoft Windows Terminal Services (PrivEsc Lab)" },
        { type: "out" as const, text: "\nNmap done: 1 IP address (1 host up) scanned in 2.15 seconds" }
      ]);
      return;
    }

    if (baseCmd === "feroxbuster" || baseCmd === "gobuster") {
      print([
        prompt,
        { type: "out" as const, text: " ___  ___  ___  ___  _  _  ___  ___  ___  ___   ___  ___" },
        { type: "out" as const, text: " |__  |__  |__  |__  |\\/|  |__  |__  |__  |__   |__  |__" },
        { type: "out" as const, text: " W-ing threads... Using default wordlist: common.txt" },
        { type: "out" as const, text: "\n200      GET      156l      452w     8452c http://127.0.0.1/" },
        { type: "out" as const, text: "301      GET        0l        0w        0c http://127.0.0.1/assets => redirect" },
        { type: "out" as const, text: "200      GET       45l      112w     1402c http://127.0.0.1/projects" },
        { type: "out" as const, text: "403      GET        8l       22w      280c http://127.0.0.1/etc/passwd (Forbidden)" },
        { type: "out" as const, text: "200      GET       12l       35w      520c http://127.0.0.1/about" },
        { type: "out" as const, text: "200      GET        2l        5w       90c http://127.0.0.1/secret_backdoor_log.txt" },
        { type: "out" as const, text: "\n[+] Directory bursting completed. 6 endpoints found." }
      ]);
      return;
    }

    if (baseCmd === "hydra") {
      print([
        prompt,
        { type: "out" as const, text: "Hydra v9.5 (c) 2026 by van Hauser/THC - Please do not use in illegal activities!" },
        { type: "out" as const, text: "[DATA] attacking service ssh on port 22" },
        { type: "out" as const, text: "[STATUS] 16384 combinations / 4 threads / 1 target" },
        { type: "out" as const, text: "[22][ssh] host: 127.0.0.1   login: admin   password: password123 - Failed" },
        { type: "out" as const, text: "[22][ssh] host: 127.0.0.1   login: admin   password: qwerty - Failed" },
        { type: "out" as const, text: "[22][ssh] host: 127.0.0.1   login: admin   password: ilkin123 - SUCCESSFUL CRACK" },
        { type: "out" as const, text: "[+] 1 of 1 target successfully completed, 1 valid password found." }
      ]);
      return;
    }

    if (baseCmd === "hashcat") {
      print([
        prompt,
        { type: "out" as const, text: "hashcat (v6.2.6) starting in benchmark & attack mode..." },
        { type: "out" as const, text: "OpenCL API (OpenCL 3.0 CUDA 12.2.1) - Platform #1 [NVIDIA Corporation]" },
        { type: "out" as const, text: "Device #1: NVIDIA GeForce RTX 4060 Laptop GPU, 6045/8024 MB" },
        { type: "out" as const, text: "Hashes: 1 digests; 1 unique salts" },
        { type: "out" as const, text: "\nStatus...........: Cracked" },
        { type: "out" as const, text: "Hash.Mode........: MD5 (Raw MD5)" },
        { type: "out" as const, text: "Hash.Target......: 5ebe2294ecd0e0f08eab7690d2a6ee69" },
        { type: "out" as const, text: "Result...........: 5ebe2294ecd0e0f08eab7690d2a6ee69:secretpassword" }
      ]);
      return;
    }

    if (lower === "cat /etc/passwd") {
      print([
        prompt,
        { type: "out" as const, text: "root:x:0:0:root:/root:/bin/bash" },
        { type: "out" as const, text: "daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin" },
        { type: "out" as const, text: "ilkin.farajov:x:1001:1001:Ilkin Farajov,,,:/home/ilkin.farajov:/bin/bash" },
        { type: "out" as const, text: "www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin" }
      ]);
      return;
    }

    if (lower === "cat flag.txt" || lower === "cat /root/flag.txt") {
      print([
        prompt,
        { type: "err" as const, text: "cat: flag.txt: Permission denied (Access Restricted to root group only)" },
        { type: "out" as const, text: "[!] Triage Note: Inspect user privileges with 'sudo -l' to look for execution vectors." }
      ]);
      return;
    }

    if (lower === "sudo -l") {
      print([
        prompt,
        { type: "out" as const, text: "Matching Defaults entries for ilkin.farajov on LNV-SLIM5-STATION:" },
        { type: "out" as const, text: "    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/bin" },
        { type: "out" as const, text: "\nUser ilkin.farajov may run the following commands on this host:" },
        { type: "out" as const, text: "    (root) NOPASSWD: /usr/bin/env" },
        { type: "out" as const, text: "[+] Vulnerability Found: /usr/bin/env has explicit NOPASSWD allocation. Leverage via shell escape." }
      ]);
      return;
    }

    if (lower === "sudo su" || lower === "sudo -i") {
      print([
        prompt,
        { type: "out" as const, text: "[sudo] password for ilkin.farajov: ******************************" },
        { type: "err" as const, text: "Authentication failure. Password locked securely within KeePass 2 database." },
        { type: "out" as const, text: "[!] Direct credential injection failed. Pivot to configuration exploitation." }
      ]);
      return;
    }

    if (lower === "sudo env /bin/sh" || lower === "sudo env sh" || lower === "env /bin/sh") {
      print([
        prompt,
        { type: "out" as const, text: "[+] Triggering: /usr/bin/env payload injection..." },
        { type: "out" as const, text: "[+] Token check bypassed. Spawning interactive TTY shell..." },
        { type: "out" as const, text: "\n# ID\nuid=0(root) gid=0(root) groups=0(root)" },
        { type: "out" as const, text: "# cat /root/flag.txt" },
        { type: "out" as const, text: "======================================================================" },
        { type: "out" as const, text: "   FLAG{G7F0B1n5_3nv_pr1v_35c4l4710n_5ucc355_4nd_4r53n4l_d3pl0y3d}" },
        { type: "out" as const, text: "======================================================================" },
        { type: "out" as const, text: "[+] Target compromised. Pwnage complete." }
      ]);
      return;
    }

    // Təhlükəsiz translation yoxlaması - t obyekti boş olarsa çökmənin qarşısını alır
    const fallbackMsg = lang === "en" ? "Command not found" : "Komanda tapılmadı";
    const notFoundText = t?.terminal?.notFound || fallbackMsg;

    print([
      prompt, 
      { type: "err" as const, text: `${notFoundText}: ${cmd}. Type 'help' to review pentest arsenal.` }
    ]);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const currentInput = input;
      setInput(""); // Input terminal dövrü kəsilmədən öncə təmizlənir
      run(currentInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!past.length) return;
      const idx = pastIdx === -1 ? past.length - 1 : Math.max(0, pastIdx - 1);
      setPastIdx(idx);
      setInput(past[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (pastIdx === -1) return;
      const idx = pastIdx + 1;
      if (idx >= past.length) {
        setPastIdx(-1);
        setInput("");
      } else {
        setPastIdx(idx);
        setInput(past[idx]);
      }
    }
  };

  return (
    <>
      {/* 1. Floating FAB Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        aria-label="Open Interactive Terminal"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ boxShadow: ["0 0 0px var(--primary-hex)", "0 0 15px var(--primary-hex)", "0 0 0px var(--primary-hex)"] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-primary bg-zinc-950 text-primary shadow-2xl cursor-pointer"
      >
        <Terminal className="h-6 w-6" />
      </motion.button>

      {/* 2. Fullscreen Backdrop & Terminal Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-3xl rounded-xl border border-zinc-800 bg-zinc-950/90 overflow-hidden font-mono text-sm shadow-2xl flex flex-col h-[450px]"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 bg-zinc-900/50 select-none">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <span className="h-3 w-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs text-zinc-400 font-semibold">ilkin.farajov@sec: ~ (Red Team Shell)</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-red-400 transition-colors text-xs font-bold cursor-pointer"
              >
                [ ESC / X ]
              </button>
            </div>

            {/* Body */}
            <div 
              onClick={() => inputRef.current?.focus()} 
              className="flex-1 overflow-y-auto p-4 space-y-2 bg-black/40 custom-scrollbar cursor-text"
              ref={scrollRef}
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

              {/* Input Row */}
              <div className="flex gap-2 items-center pt-1">
                <span className="text-primary shrink-0">ilkin.farajov:~$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Terminal input"
                  className="flex-1 bg-transparent outline-none border-none text-foreground caret-[var(--primary-hex)] focus:ring-0 p-0"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default InteractiveTerminal;
