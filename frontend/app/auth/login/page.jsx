"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { authAPI } from "../../../lib/api";
import Navbar from "../../../components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      Cookies.set("token", res.data.access_token, { expires: 7 });
      Cookies.set("user", JSON.stringify(res.data.user), { expires: 7 });
      toast.success("Welcome back! 👋");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const recentNotes = [
    { icon: "📌", title: "Q4 Product Roadmap", preview: "Launch redesigned dashboard by Nov 15…", time: "2m ago", color: "amber" },
    { icon: "💡", title: "Research: AI in Healthcare", preview: "LLMs showing 94% accuracy in triage…", time: "1h ago", color: "blue" },
    { icon: "🎯", title: "Weekly Goals → Oct 28", preview: "✓ Deploy auth  ✓ Review PRs  • API docs…", time: "3h ago", color: "green" },
    { icon: "📝", title: "Meeting Notes — Design Sync", preview: "Figma handoff by Friday. Check contrast…", time: "5h ago", color: "pink" },
  ];

  const colorMap = {
    amber: "bg-amber-500/15 border-amber-500/20",
    blue:  "bg-blue-500/15 border-blue-500/20",
    green: "bg-green-500/15 border-green-500/20",
    pink:  "bg-pink-500/15 border-pink-500/20",
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#0a0a0f] flex pt-[65px]">

        {/* ── LEFT PANEL ── */}
        <div className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden px-12 py-10 bg-[#0d0d15]">

          {/* Grid bg */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "linear-gradient(rgba(245,158,11,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.05) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }} />

          {/* Glows */}
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.11) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-32 right-0 w-[350px] h-[350px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)" }} />

          {/* Notes preview UI */}
          <div className="relative z-10 flex-1 flex flex-col justify-center gap-6">

            {/* App header mock */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-white/25 text-xs font-mono tracking-widest uppercase mb-1">// your notes</p>
                <h2 className="text-white text-xl font-bold tracking-tight">My Workspace</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Search bar mock */}
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/8 rounded-xl px-4 py-2.5 mb-1">
              <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-white/20 text-sm">Search your notes…</span>
            </div>

            {/* Note cards */}
            <div className="space-y-3">
              {recentNotes.map((note, i) => (
                <div
                  key={note.title}
                  className={`flex items-start gap-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/7 hover:border-amber-500/15 rounded-xl p-3.5 transition-all duration-200 ${i === 0 ? "border-amber-500/20 bg-amber-500/[0.04]" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 border ${colorMap[note.color]}`}>
                    {note.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white/85 mb-0.5 truncate">{note.title}</div>
                    <div className="text-xs text-white/30 truncate">{note.preview}</div>
                  </div>
                  <div className="text-[10px] font-mono text-white/25 flex-shrink-0 mt-0.5">{note.time}</div>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { label: "Total Notes", val: "128" },
                { label: "Shared", val: "24" },
                { label: "This Week", val: "12" },
              ].map((s) => (
                <div key={s.label} className="bg-white/[0.02] border border-white/6 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-amber-400 tracking-tight">{s.val}</div>
                  <div className="text-[10px] text-white/30 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom quote */}
          <div className="relative z-10 mt-6">
            <blockquote className="text-white/40 text-sm font-light leading-relaxed italic border-l-2 border-amber-500/30 pl-4">
              "A mind stretched by a new idea never returns to its original dimensions."
            </blockquote>
            <p className="text-white/20 text-xs font-mono mt-2 pl-4">— Oliver Wendell Holmes</p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <Link href="/" className="lg:hidden flex items-center gap-2 mb-8 justify-center">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.35)]">
                <svg className="w-5 h-5 text-[#0a0a0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white">Notes<span className="text-amber-400">.</span></span>
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <p className="text-xs font-mono tracking-widest text-amber-400 uppercase mb-2">// welcome back</p>
              <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">Sign in to your account</h1>
              <p className="text-white/40 text-sm mt-2 font-light">Your notes are waiting for you.</p>
            </div>

            {/* Form card */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-7 space-y-5">

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none transition-all duration-200"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest">Password</label>
                  <span className="text-xs text-amber-400/70 hover:text-amber-400 cursor-pointer transition-colors">Forgot password?</span>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-white/20 outline-none transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPass ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-900/50 disabled:cursor-not-allowed text-[#0a0a0f] font-bold py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-[0_0_32px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_40px_rgba(245,158,11,0.45)] text-sm mt-1"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-white/25 text-xs font-mono">or</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              {/* Google SSO placeholder */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2.5 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium py-3 rounded-xl transition-all duration-200 text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="text-center text-white/35 text-sm mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                Create one →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}