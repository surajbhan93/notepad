"use client";
import { useState, useEffect } from "react";
import { X, Pin, Tag, Palette } from "lucide-react";

const COLORS = [
  { name: "default", bg: "bg-gray-800", border: "border-gray-600", label: "Default" },
  { name: "red", bg: "bg-red-950", border: "border-red-700", label: "Red" },
  { name: "orange", bg: "bg-orange-950", border: "border-orange-700", label: "Orange" },
  { name: "yellow", bg: "bg-yellow-950", border: "border-yellow-700", label: "Yellow" },
  { name: "green", bg: "bg-green-950", border: "border-green-700", label: "Green" },
  { name: "blue", bg: "bg-blue-950", border: "border-blue-700", label: "Blue" },
  { name: "purple", bg: "bg-purple-950", border: "border-purple-700", label: "Purple" },
];

const COLOR_DOTS = {
  default: "bg-gray-500", red: "bg-red-500", orange: "bg-orange-500",
  yellow: "bg-yellow-500", green: "bg-green-500", blue: "bg-blue-500", purple: "bg-purple-500",
};

export default function NoteModal({ note, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "", content: "", tags: [], color: "default", isPinned: false,
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [showColors, setShowColors] = useState(false);

  useEffect(() => {
    if (note) {
      setForm({
        title: note.title || "",
        content: note.content || "",
        tags: note.tags || [],
        color: note.color || "default",
        isPinned: note.isPinned || false,
      });
    }
  }, [note]);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag) && form.tags.length < 8) {
      setForm({ ...form, tags: [...form.tags, tag] });
      setTagInput("");
    }
  };

  const removeTag = (t) => setForm({ ...form, tags: form.tags.filter((x) => x !== t) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const colorConfig = COLORS.find((c) => c.name === form.color) || COLORS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-2xl ${colorConfig.bg} border ${colorConfig.border} rounded-3xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white">
              {note?._id ? "Edit Note" : "New Note"}
            </h2>
            <div className="flex items-center gap-2">
              {/* Pin toggle */}
              <button
                type="button"
                onClick={() => setForm({ ...form, isPinned: !form.isPinned })}
                className={`p-2 rounded-xl transition-colors ${form.isPinned ? "text-amber-500 bg-amber-500/20" : "text-gray-400 hover:text-amber-400 hover:bg-gray-700"}`}
                title={form.isPinned ? "Unpin" : "Pin"}
              >
                <Pin size={18} fill={form.isPinned ? "currentColor" : "none"} />
              </button>
              {/* Color picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColors(!showColors)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                  title="Note color"
                >
                  <Palette size={18} />
                </button>
                {showColors && (
                  <div className="absolute right-0 top-10 bg-gray-900 border border-gray-700 rounded-2xl p-3 flex gap-2 z-10 shadow-xl">
                    {COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => { setForm({ ...form, color: c.name }); setShowColors(false); }}
                        className={`w-7 h-7 rounded-full ${COLOR_DOTS[c.name]} transition-transform hover:scale-110 ${form.color === c.name ? "ring-2 ring-white scale-110" : ""}`}
                        title={c.label}
                      />
                    ))}
                  </div>
                )}
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-transparent border-b border-gray-600 focus:border-amber-500 outline-none text-xl font-semibold text-white placeholder-gray-500 pb-2 transition-colors"
              placeholder="Note title..."
              required
            />
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500 resize-none min-h-[200px] leading-relaxed"
              placeholder="Write your note here..."
              required
            />

            {/* Tags */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Tag size={14} className="text-gray-400" />
                {form.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 bg-gray-700 text-gray-200 text-xs px-3 py-1 rounded-full">
                    {t}
                    <button type="button" onClick={() => removeTag(t)} className="text-gray-400 hover:text-white">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  className="flex-1 bg-gray-700/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Add tag (press Enter)"
                />
                <button type="button" onClick={addTag} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm transition-colors">
                  Add
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-600 hover:border-gray-500 text-gray-300 font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !form.title.trim() || !form.content.trim()}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800 disabled:cursor-not-allowed text-gray-950 font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30"
              >
                {saving ? "Saving..." : (note?._id ? "Update Note" : "Create Note")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
