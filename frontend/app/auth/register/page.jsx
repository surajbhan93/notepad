"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authAPI } from "../../../lib/api";
import Navbar from "../../../components/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await authAPI.register({ name: form.name, email: form.email, password: form.password });
      toast.success("Account created! Please sign in.");
      router.push("/auth/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* pt-[65px] = Navbar height compensate */}
      <div className="min-h-screen bg-[#0a0a0f] flex pt-[65px]">

        {/* ── LEFT PANEL ── */}
        <div className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden px-12 py-10 bg-[#0d0d15]">

          {/* grid bg */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(245,158,11,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.05) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          {/* amber glow top-left */}
          <div
            className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.13) 0%, transparent 70%)" }}
          />
          {/* amber glow bottom-right */}
          <div
            className="absolute -bottom-32 -right-24 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)" }}
          />

          {/* ── Notebook illustration (center) ── */}
          <div className="relative z-10 flex-1 flex items-center justify-center">
            <div className="relative">

              {/* Notebook base */}
              <div
                className="relative w-72 h-80 rounded-2xl shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #1e1a0e 0%, #2a2310 100%)",
                  border: "1px solid rgba(245,158,11,0.2)",
                }}
              >
                {/* Spine */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-8 rounded-l-2xl flex flex-col items-center justify-center gap-2"
                  style={{ background: "linear-gradient(180deg, #f59e0b 0%, #d97706 100%)" }}
                >
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-3 h-0.5 bg-amber-900/40 rounded" />
                  ))}
                </div>

                {/* Rings */}
                {[60, 120, 180, 240].map((top) => (
                  <div
                    key={top}
                    className="absolute -left-2 w-4 h-4 rounded-full border-2 border-amber-500/60 bg-[#0a0a0f]"
                    style={{ top }}
                  />
                ))}

                {/* Page lines */}
                <div className="absolute left-12 right-4 top-6 bottom-4 space-y-4 overflow-hidden">
                  <div className="h-px bg-amber-500/20 mt-4" />
                  {[
                    { w: "w-4/5", opacity: "opacity-60" },
                    { w: "w-3/5", opacity: "opacity-40" },
                    { w: "w-full", opacity: "opacity-50" },
                    { w: "w-2/3", opacity: "opacity-30" },
                    { w: "w-4/5", opacity: "opacity-50" },
                    { w: "w-1/2", opacity: "opacity-40" },
                    { w: "w-full", opacity: "opacity-30" },
                    { w: "w-3/4", opacity: "opacity-50" },
                  ].map((l, i) => (
                    <div
                      key={i}
                      className={`h-0.5 ${l.w} ${l.opacity} rounded`}
                      style={{ background: "rgba(245,158,11,0.35)" }}
                    />
                  ))}

                  {/* Pencil cursor */}
                  <div className="relative flex items-center gap-1 mt-2">
                    <div className="h-0.5 w-2/3 rounded" style={{ background: "rgba(245,158,11,0.35)" }} />
                    <svg
                      width="18" height="18" viewBox="0 0 24 24"
                      fill="none" stroke="#f59e0b" strokeWidth={2}
                      strokeLinecap="round" strokeLinejoin="round"
                      className="animate-pulse"
                    >
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>

                  {[
                    { w: "w-full", opacity: "opacity-20" },
                    { w: "w-4/5", opacity: "opacity-15" },
                    { w: "w-3/5", opacity: "opacity-10" },
                  ].map((l, i) => (
                    <div
                      key={i}
                      className={`h-0.5 ${l.w} ${l.opacity} rounded`}
                      style={{ background: "rgba(245,158,11,0.2)" }}
                    />
                  ))}
                </div>
              </div>

              {/* Floating sticky — top right */}
              <div
                className="absolute -top-6 -right-10 w-28 h-24 rounded-lg p-3 rotate-6 shadow-xl"
                style={{ background: "#1f2937", border: "1px solid rgba(245,158,11,0.15)" }}
              >
                <div className="h-1 w-8 bg-amber-400/60 rounded mb-2" />
                <div className="h-1 w-full bg-white/10 rounded mb-1.5" />
                <div className="h-1 w-3/4 bg-white/10 rounded mb-1.5" />
                <div className="h-1 w-full bg-white/10 rounded" />
              </div>

              {/* Floating sticky — bottom right */}
              <div
                className="absolute -bottom-4 -right-8 w-24 h-20 rounded-lg p-3 -rotate-3 shadow-xl"
                style={{ background: "#1a1f16", border: "1px solid rgba(74,222,128,0.2)" }}
              >
                <div className="h-1 w-6 bg-green-400/60 rounded mb-2" />
                <div className="h-1 w-full bg-white/10 rounded mb-1.5" />
                <div className="h-1 w-2/3 bg-white/10 rounded" />
              </div>

              {/* Floating sticky — bottom left */}
              <div
                className="absolute -bottom-8 -left-10 w-28 h-20 rounded-lg p-3 rotate-2 shadow-xl"
                style={{ background: "#1a1015", border: "1px solid rgba(244,114,182,0.2)" }}
              >
                <div className="h-1 w-8 bg-pink-400/50 rounded mb-2" />
                <div className="h-1 w-full bg-white/10 rounded mb-1.5" />
                <div className="h-1 w-4/5 bg-white/10 rounded" />
              </div>

              {/* Writing badge */}
              <div className="absolute -top-4 left-6 flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-400 text-xs font-mono font-medium">Writing now...</span>
              </div>
            </div>
          </div>

          {/* Bottom quote */}
          <div className="relative z-10">
            <blockquote className="text-white/50 text-sm font-light leading-relaxed italic border-l-2 border-amber-500/40 pl-4">
              "The palest ink is better than the best memory."
            </blockquote>
            <p className="text-white/25 text-xs font-mono mt-2 pl-4">— Chinese Proverb</p>
          </div>
        </div>

        {/* ── RIGHT PANEL (Form) ── */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">

            {/* Mobile logo — only shown when no Navbar logo visible on small screens */}
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
              <p className="text-xs font-mono tracking-widest text-amber-400 uppercase mb-2">// get started</p>
              <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">Create your account</h1>
              <p className="text-white/40 text-sm mt-2 font-light">Start organizing your thoughts beautifully.</p>
            </div>

            {/* Form card */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-7 space-y-5">

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                  Name <span className="text-white/25 normal-case tracking-normal font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none transition-all duration-200"
                  placeholder="Your name"
                />
              </div>

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
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-white/20 outline-none transition-all duration-200"
                    placeholder="Min. 6 characters"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-white/20 outline-none transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showConfirm ? (
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-white/35 text-sm mt-6">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}