"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Plus, Search, LogOut, X, Pin, SlidersHorizontal, BookOpen, Sparkles } from "lucide-react";
import { notesAPI } from "../../lib/api";
import NoteCard from "../../components/NoteCard";
import NoteModal from "../../components/NoteModal";

const COLORS = ["red", "orange", "yellow", "green", "blue", "purple"];
const COLOR_DOTS = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
};

const GREETINGS = ["Good morning", "Good afternoon", "Good evening"];
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return GREETINGS[0];
  if (h < 17) return GREETINGS[1];
  return GREETINGS[2];
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [filterColor, setFilterColor] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = Cookies.get("user");
    if (!stored) { router.push("/auth/login"); return; }
    try { setUser(JSON.parse(stored)); } catch { router.push("/auth/login"); }
  }, [router]);

  const fetchNotes = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (filterColor) params.color = filterColor;
      if (filterTag) params.tag = filterTag;
      const res = await notesAPI.getAll(params);
      setNotes(res.data.notes || []);
      setPagination(res.data.pagination || {});
    } catch {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [filterColor, filterTag]);

  useEffect(() => { if (user) fetchNotes(); }, [user, fetchNotes]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) { setSearchResults(null); return; }
    setSearching(true);
    try {
      const res = await notesAPI.search(search);
      setSearchResults(res.data.notes || []);
    } catch {
      toast.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => { setSearch(""); setSearchResults(null); };

  const handleSave = async (form) => {
    try {
      if (editNote?._id) {
        await notesAPI.update(editNote._id, form);
        toast.success("Note updated!");
      } else {
        await notesAPI.create(form);
        toast.success("Note created!");
      }
      setShowModal(false);
      setEditNote(null);
      fetchNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save note");
    }
  };

  const handleDelete = async (id) => {
    try {
      await notesAPI.delete(id);
      toast.success("Note deleted");
      fetchNotes();
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleShare = async (id, email) => {
    try {
      await notesAPI.share(id, email);
      toast.success(`Note shared with ${email}`);
      fetchNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to share note");
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/");
    toast.success("Logged out");
  };

  const displayNotes = searchResults !== null ? searchResults : notes;
  const pinnedNotes = displayNotes.filter((n) => n.isPinned);
  const unpinnedNotes = displayNotes.filter((n) => !n.isPinned);
  const allTags = [...new Set(notes.flatMap((n) => n.tags || []))];
  const userName = user?.name || user?.email?.split("@")[0] || "there";

  return (
    <div
      className="relative min-h-screen text-white font-sans"
      style={{ background: "#0a0a0f" }}
    >
      {/* Noise texture */}
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
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,158,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top glow */}
      <div
        className="fixed -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)" }}
      />

      {/* ── NAVBAR ── */}
      <nav
        className="sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between border-b border-white/6"
        style={{
          background: "rgba(10,10,15,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "#f59e0b", boxShadow: "0 0 16px rgba(245,158,11,0.4)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#0a0a0f" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">
            Notes<span style={{ color: "#f59e0b" }}>.</span>
          </span>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-sm mx-6">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl pl-9 pr-9 py-2 text-sm text-white placeholder-white/25 focus:outline-none transition-all"
              placeholder="Search notes…"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={(e) => { e.target.style.border = "1px solid rgba(245,158,11,0.4)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
              onBlur={(e) => { e.target.style.border = "1px solid rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border border-amber-500 border-t-transparent rounded-full animate-spin" />
            )}
            {search && !searching && (
              <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                <X size={13} />
              </button>
            )}
          </div>
        </form>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#f59e0b", color: "#0a0a0f" }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-white/60 font-medium">{userName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl transition-all border border-transparent hover:border-red-500/20"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(248,113,113,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; e.currentTarget.style.background = "transparent"; }}
            title="Logout"
          >
            <LogOut size={17} />
          </button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Greeting + stats bar */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: "rgba(245,158,11,0.6)" }}>
              // dashboard
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {getGreeting()},{" "}
              <span style={{ color: "#f59e0b" }}>{userName}</span> 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              {searchResults !== null
                ? `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${search}"`
                : `${pagination.total || 0} notes · ${pinnedNotes.length} pinned`}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
              style={{
                background: showFilters || filterColor || filterTag ? "rgba(245,158,11,0.10)" : "rgba(255,255,255,0.04)",
                border: showFilters || filterColor || filterTag ? "1px solid rgba(245,158,11,0.35)" : "1px solid rgba(255,255,255,0.08)",
                color: showFilters || filterColor || filterTag ? "#f59e0b" : "rgba(255,255,255,0.55)",
              }}
            >
              <SlidersHorizontal size={14} />
              Filters
              {(filterColor || filterTag) && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </button>
            <button
              onClick={() => { setEditNote(null); setShowModal(true); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: "#f59e0b",
                color: "#0a0a0f",
                boxShadow: "0 0 24px rgba(245,158,11,0.30)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fbbf24"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#f59e0b"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <Plus size={16} />
              New Note
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div
            className="rounded-2xl p-5 mb-6 border border-white/7"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="flex flex-wrap gap-6 items-start">
              {/* Color filter */}
              <div>
                <p className="text-xs text-white/35 mb-2.5 font-mono tracking-widest uppercase">Color</p>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setFilterColor("")}
                    className="w-7 h-7 rounded-full border-2 transition-all"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      borderColor: !filterColor ? "#f59e0b" : "transparent",
                      transform: !filterColor ? "scale(1.15)" : "scale(1)",
                    }}
                    title="All"
                  />
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setFilterColor(filterColor === c ? "" : c)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${COLOR_DOTS[c]}`}
                      style={{
                        borderColor: filterColor === c ? "#fff" : "transparent",
                        transform: filterColor === c ? "scale(1.15)" : "scale(1)",
                      }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* Tag filter */}
              {allTags.length > 0 && (
                <div>
                  <p className="text-xs text-white/35 mb-2.5 font-mono tracking-widest uppercase">Tag</p>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((t) => (
                      <button
                        key={t}
                        onClick={() => setFilterTag(filterTag === t ? "" : t)}
                        className="text-xs px-3 py-1.5 rounded-full border transition-all font-medium"
                        style={{
                          background: filterTag === t ? "#f59e0b" : "rgba(255,255,255,0.04)",
                          borderColor: filterTag === t ? "#f59e0b" : "rgba(255,255,255,0.10)",
                          color: filterTag === t ? "#0a0a0f" : "rgba(255,255,255,0.55)",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(filterColor || filterTag) && (
                <button
                  onClick={() => { setFilterColor(""); setFilterTag(""); }}
                  className="self-end text-xs font-medium transition-colors"
                  style={{ color: "rgba(248,113,113,0.7)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#f87171"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(248,113,113,0.7)"}
                >
                  ✕ Clear filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── CONTENT ── */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "rgba(245,158,11,0.3)", borderTopColor: "#f59e0b" }}
              />
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Loading notes…</p>
            </div>
          </div>
        ) : displayNotes.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.12)" }}
            >
              <BookOpen size={32} style={{ color: "rgba(245,158,11,0.5)" }} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {searchResults !== null ? "No results found" : "No notes yet"}
            </h3>
            <p className="text-sm mb-8 max-w-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              {searchResults !== null
                ? "Try a different search term or clear filters"
                : "Capture your first thought, idea, or plan"}
            </p>
            {searchResults === null && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all"
                style={{ background: "#f59e0b", color: "#0a0a0f", boxShadow: "0 0 24px rgba(245,158,11,0.3)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#fbbf24"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f59e0b"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <Sparkles size={15} />
                Create first note
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Pinned section */}
            {pinnedNotes.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Pin size={13} fill="#f59e0b" style={{ color: "#f59e0b" }} />
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#f59e0b" }}>
                    Pinned
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-mono"
                    style={{ background: "rgba(245,158,11,0.12)", color: "rgba(245,158,11,0.7)" }}
                  >
                    {pinnedNotes.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {pinnedNotes.map((n) => (
                    <NoteCard
                      key={n._id}
                      note={n}
                      currentUser={user}
                      onEdit={(n) => { setEditNote(n); setShowModal(true); }}
                      onDelete={handleDelete}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other notes */}
            {unpinnedNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
                      Other Notes
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-mono"
                      style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)" }}
                    >
                      {unpinnedNotes.length}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {unpinnedNotes.map((n) => (
                    <NoteCard
                      key={n._id}
                      note={n}
                      currentUser={user}
                      onEdit={(n) => { setEditNote(n); setShowModal(true); }}
                      onDelete={handleDelete}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {searchResults === null && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => fetchNotes(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all border disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => fetchNotes(p)}
                      className="w-9 h-9 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: pagination.page === p ? "#f59e0b" : "rgba(255,255,255,0.04)",
                        color: pagination.page === p ? "#0a0a0f" : "rgba(255,255,255,0.4)",
                        fontWeight: pagination.page === p ? "700" : "400",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => fetchNotes(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all border disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Note Modal */}
      {showModal && (
        <NoteModal
          note={editNote}
          onClose={() => { setShowModal(false); setEditNote(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}