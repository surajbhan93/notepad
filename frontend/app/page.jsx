"use client";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: "🔐",
    title: "Bank-Grade Security",
    desc: "JWT tokens, bcrypt encryption, and zero-knowledge architecture keep your thoughts private.",
  },
  {
    icon: "🤝",
    title: "Real-time Sharing",
    desc: "Share notes with teammates instantly. Set permissions, add collaborators, work together.",
  },
  {
    icon: "🔍",
    title: "Instant Search",
    desc: "Full-text search across thousands of notes. Find anything in under 100ms.",
  },
  {
    icon: "📱",
    title: "Works Everywhere",
    desc: "Responsive design for desktop, tablet, and mobile. Your notes, always in reach.",
  },
  {
    icon: "🎨",
    title: "Rich Formatting",
    desc: "Markdown support, code blocks, images, and more. Express ideas the way you mean them.",
  },
  {
    icon: "⚡",
    title: "Lightning Fast",
    desc: "Built on modern infrastructure. Notes load instantly, even with thousands of entries.",
  },
];

const stats = [
  { num: "50K+", label: "Active Users", icon: "👥" },
  { num: "2M+", label: "Notes Created", icon: "📝" },
  { num: "99.9%", label: "Uptime", icon: "⚡" },
  { num: "4.9★", label: "User Rating", icon: "⭐" },
];

const trustedBadges = [
  { label: "Creators", icon: "🎨" },
  { label: "Students", icon: "🎓" },
  { label: "Teams", icon: "🤝" },
  { label: "Developers", icon: "💻" },
];

const mockDashboardNotes = [
  { icon: "📌", title: "Q4 Product Roadmap", tag: "Work", time: "2m ago", color: "#f59e0b" },
  { icon: "💡", title: "Research: AI in Healthcare", tag: "Research", time: "1h ago", color: "#818cf8" },
  { icon: "🎯", title: "Weekly Goals → Oct 28", tag: "Personal", time: "3h ago", color: "#34d399" },
  { icon: "📖", title: "Book Notes: Atomic Habits", tag: "Learning", time: "5h ago", color: "#f472b6" },
];

// ─── Spotlight Feature Card ───────────────────────────────────────────────────
function SpotlightCard({ f }) {
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl p-6 overflow-hidden border border-white/7 transition-all duration-300 hover:-translate-y-1"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      {/* Spotlight */}
      {hovered && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(200px circle at ${pos.x}px ${pos.y}px, rgba(245,158,11,0.10), transparent 70%)`,
          }}
        />
      )}
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="w-11 h-11 rounded-xl bg-amber-500/12 border border-amber-500/20 flex items-center justify-center text-xl mb-4">
        {f.icon}
      </div>
      <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
      <p className="text-xs text-white/40 leading-relaxed font-light">{f.desc}</p>
    </div>
  );
}

// ─── Animated Typing Headline ─────────────────────────────────────────────────
const words = ["beautifully", "effortlessly", "instantly", "privately"];

function TypingWord() {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx]);

  return (
    <span className="text-amber-400 relative inline-block">
      {displayed}
      <span className="animate-pulse text-amber-400">|</span>
      <span className="absolute bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 to-transparent rounded-full" />
    </span>
  );
}

// ─── Mock Dashboard ───────────────────────────────────────────────────────────
function MockDashboard() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % mockDashboardNotes.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-white/8"
      style={{
        background: "rgba(255,255,255,0.03)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
      }}
    >
      {/* Browser bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/6" style={{ background: "rgba(255,255,255,0.04)" }}>
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <div className="flex-1 mx-3 bg-white/5 border border-white/8 rounded-md px-3 py-1 text-[10px] font-mono text-white/30">
          app.notes.io/dashboard
        </div>
      </div>

      {/* Sidebar + notes */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-28 border-r border-white/6 p-3 flex flex-col gap-1" style={{ background: "rgba(0,0,0,0.2)" }}>
          {["All Notes", "Starred", "Recent", "Shared", "Trash"].map((item, i) => (
            <div
              key={item}
              className="text-[10px] px-2 py-1.5 rounded-lg transition-all"
              style={{
                color: i === 0 ? "#f59e0b" : "rgba(255,255,255,0.35)",
                background: i === 0 ? "rgba(245,158,11,0.10)" : "transparent",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Notes list */}
        <div className="flex-1 p-3 space-y-2">
          {mockDashboardNotes.map((note, i) => (
            <div
              key={note.title}
              className="flex items-center gap-3 rounded-xl p-2.5 transition-all duration-500 border"
              style={{
                background: active === i ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.02)",
                borderColor: active === i ? "rgba(245,158,11,0.18)" : "rgba(255,255,255,0.05)",
                transform: active === i ? "translateX(3px)" : "translateX(0)",
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                style={{ background: `${note.color}18` }}
              >
                {note.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-white/80 truncate">{note.title}</div>
                <div
                  className="text-[9px] font-mono mt-0.5 px-1.5 py-0.5 rounded inline-block"
                  style={{ color: note.color, background: `${note.color}18` }}
                >
                  {note.tag}
                </div>
              </div>
              <div className="text-[9px] font-mono text-white/25 flex-shrink-0">{note.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div
      className="relative min-h-screen bg-[#0a0a0f] text-white overflow-hidden font-sans"
    >
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,158,11,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow top */}
      <div
        className="absolute -top-48 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)" }}
      />

      {/* Glow bottom-right */}
      <div
        className="absolute bottom-0 -right-24 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)" }}
      />

      {/* Navbar */}
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col lg:flex-row items-center gap-16 px-6 pt-20 pb-12 w-full max-w-7xl mx-auto">

        {/* LEFT */}
        <div className="flex-1 flex flex-col items-start text-left gap-5">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-mono tracking-widest uppercase border border-amber-500/20 bg-amber-500/8 px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Your Second Brain
          </div>

          {/* Animated Heading */}
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tighter">
            Think clearly.<br />
            Write <TypingWord />.<br />
            Share instantly.
          </h1>

          {/* Description */}
          <p className="text-lg text-white/50 font-light leading-relaxed max-w-lg">
            A notes experience designed for how your mind actually works. Capture ideas, collaborate with your team, and find anything in seconds.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth/register"
              className="flex items-center gap-2 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0a0a0f] font-bold rounded-2xl text-base transition-all duration-200 hover:-translate-y-0.5 shadow-[0_0_40px_rgba(245,158,11,0.35)] hover:shadow-[0_8px_48px_rgba(245,158,11,0.5)]"
            >
              Start for free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/auth/login"
              className="px-7 py-3.5 bg-white/5 hover:bg-white/9 text-white/80 hover:text-white border border-white/12 hover:border-white/20 font-semibold rounded-2xl text-base transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm"
            >
              Sign In
            </Link>
            <a
              href="https://notepad-api-pugt.onrender.com/docs/"
              target="_blank"
              className="flex items-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/9 text-white/70 hover:text-white border border-white/12 hover:border-white/20 font-semibold rounded-2xl text-base transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View API Docs
            </a>
            <a
              href="https://github.com/surajbhan93/notepad"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/9 text-white/70 hover:text-white border border-white/12 hover:border-white/20 font-semibold rounded-2xl text-base transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>

          {/* Stats — glass cards */}
          <div className="flex flex-wrap gap-3 pt-2">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center px-4 py-3 rounded-2xl border border-white/8 backdrop-blur-sm"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                  minWidth: "80px",
                }}
              >
                <span className="text-lg mb-0.5">{s.icon}</span>
                <div className="text-xl font-extrabold text-amber-400 tracking-tight leading-none">{s.num}</div>
                <div className="text-[10px] text-white/35 font-light mt-1 text-center">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Trusted Badge Row */}
          <div className="flex flex-col gap-2 pt-1">
            <p className="text-[11px] text-white/30 font-mono tracking-widest uppercase">
              Used by
            </p>
            <div className="flex flex-wrap gap-2">
              {trustedBadges.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/55 border border-white/10 bg-white/4 px-3 py-1.5 rounded-full"
                >
                  <span>{b.icon}</span>
                  {b.label}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT — Images collage */}
        <div className="flex-none w-full max-w-[360px] flex flex-col gap-3 relative">

          {/* Floating Live tag */}
          <div
            className="absolute -top-3 -right-3 z-10 text-[#0a0a0f] text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest"
            style={{
              background: "#f59e0b",
              boxShadow: "0 0 16px rgba(245,158,11,0.5)",
            }}
          >
            ✨ Live
          </div>

          {/* Main big image */}
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/12 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <img
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80&fit=crop"
              alt="Person writing notes"
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 bg-black/75 border border-amber-500/20 rounded-xl px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-white/80">Writing a note…</span>
            </div>
          </div>

          {/* Two small images */}
          <div className="flex gap-3">
            <div className="relative flex-1 rounded-2xl overflow-hidden border border-amber-500/12 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <img
                src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&q=80&fit=crop"
                alt="Study desk"
                className="w-full h-28 object-cover"
              />
              <span className="absolute top-2 right-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">FOCUS</span>
            </div>
            <div className="relative flex-1 rounded-2xl overflow-hidden border border-amber-500/12 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <img
                src="https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=400&q=80&fit=crop"
                alt="Open notebook"
                className="w-full h-28 object-cover"
              />
              <span className="absolute top-2 right-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">IDEAS</span>
            </div>
          </div>

          {/* Bottom strip image */}
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/12 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <img
              src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80&fit=crop"
              alt="Planning notes"
              className="w-full h-20 object-cover"
            />
            <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5 bg-black/75 border border-amber-500/20 rounded-xl px-3 py-1">
              <span className="text-[11px] font-semibold text-white/80">📌 Plan your day</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── MOCK DASHBOARD ANIMATION ── */}
      <section className="relative z-10 px-6 pb-16 max-w-3xl mx-auto">
        <p className="text-center text-xs font-mono tracking-widest uppercase text-amber-400 mb-3">
          // dashboard preview
        </p>
        <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-white mb-8">
          Your notes, organized & alive
        </h2>
        <MockDashboard />
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 px-6 pb-20 max-w-7xl mx-auto">
        <p className="text-center text-xs font-mono tracking-widest uppercase text-amber-400 mb-3">
          // features
        </p>
        <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight text-white mb-12">
          Everything you need, nothing you don't
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <SpotlightCard key={f.title} f={f} />
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 text-center py-8 border-t border-white/6 text-xs font-mono text-white/20">
        Built with ♥ · Notes© 2026 · Secure · Private · Yours
      </footer>
    </div>
  );
}
