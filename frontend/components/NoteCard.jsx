"use client";
import { useState } from "react";
import { Trash2, Edit3, Share2, Pin, Tag } from "lucide-react";

const COLOR_STYLES = {
  default: "bg-gray-900 border-gray-800",
  red: "bg-red-950/60 border-red-900",
  orange: "bg-orange-950/60 border-orange-900",
  yellow: "bg-yellow-950/60 border-yellow-900",
  green: "bg-green-950/60 border-green-900",
  blue: "bg-blue-950/60 border-blue-900",
  purple: "bg-purple-950/60 border-purple-900",
};

const DOT_COLORS = {
  default: "", red: "bg-red-500", orange: "bg-orange-500",
  yellow: "bg-yellow-500", green: "bg-green-500", blue: "bg-blue-500", purple: "bg-purple-500",
};

export default function NoteCard({ note, currentUser, onEdit, onDelete, onShare }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [showShare, setShowShare] = useState(false);

  const isOwner = note.owner?._id === currentUser?.id || note.owner === currentUser?.id;
  const isShared = !isOwner;
  const colorClass = COLOR_STYLES[note.color] || COLOR_STYLES.default;

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className={`${colorClass} border rounded-2xl p-5 note-card-hover flex flex-col gap-3 relative`}>
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute top-3 right-3">
          <Pin size={14} className="text-amber-500" fill="currentColor" />
        </div>
      )}
      {/* Color dot */}
      {note.color && note.color !== "default" && (
        <div className={`absolute top-3 left-3 w-2 h-2 rounded-full ${DOT_COLORS[note.color]}`} />
      )}

      <div className={note.color !== "default" ? "mt-1" : ""}>
        <h3 className="font-semibold text-white text-base leading-snug pr-4 line-clamp-2">{note.title}</h3>
        <p className="text-gray-400 text-sm mt-1 line-clamp-3 leading-relaxed">{note.content}</p>
      </div>

      {/* Tags */}
      {note.tags?.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Tag size={11} className="text-gray-500" />
          {note.tags.slice(0, 4).map((t) => (
            <span key={t} className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700">
              {t}
            </span>
          ))}
          {note.tags.length > 4 && <span className="text-xs text-gray-500">+{note.tags.length - 4}</span>}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-800">
        <div>
          <p className="text-xs text-gray-500">{formatDate(note.updatedAt)}</p>
          {isShared && (
            <p className="text-xs text-amber-600 mt-0.5">Shared by {note.owner?.email || "someone"}</p>
          )}
          {note.sharedWith?.length > 0 && isOwner && (
            <p className="text-xs text-green-600 mt-0.5">Shared with {note.sharedWith.length} user{note.sharedWith.length > 1 ? "s" : ""}</p>
          )}
        </div>

        <div className="flex items-center gap-1">
          {isOwner && (
            <button
              onClick={() => setShowShare(!showShare)}
              className="p-2 rounded-xl text-gray-500 hover:text-green-400 hover:bg-green-400/10 transition-colors"
              title="Share note"
            >
              <Share2 size={15} />
            </button>
          )}
          <button
            onClick={() => onEdit(note)}
            className="p-2 rounded-xl text-gray-500 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
            title="Edit note"
          >
            <Edit3 size={15} />
          </button>
          {isOwner && (
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Delete note"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Share panel */}
      {showShare && (
        <div className="border-t border-gray-700 pt-3">
          <p className="text-xs text-gray-400 mb-2">Share with user</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
              placeholder="friend@email.com"
            />
            <button
              onClick={() => {
                if (shareEmail) { onShare(note._id, shareEmail); setShareEmail(""); setShowShare(false); }
              }}
              className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Share
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {showConfirm && (
        <div className="border-t border-gray-700 pt-3">
          <p className="text-sm text-gray-300 mb-3">Delete this note permanently?</p>
          <div className="flex gap-2">
            <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 border border-gray-600 text-gray-300 rounded-xl text-sm hover:border-gray-500 transition-colors">
              Cancel
            </button>
            <button onClick={() => { onDelete(note._id); setShowConfirm(false); }} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-colors">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
