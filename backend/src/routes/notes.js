const express = require("express");
const { body, query, validationResult } = require("express-validator");
const Note = require("../models/Note");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes require auth
router.use(protect);

// Helper to check note access (owner or sharedWith)
const hasAccess = (note, userId) => {
  return (
    note.owner.toString() === userId.toString() ||
    note.sharedWith.some((id) => id.toString() === userId.toString())
  );
};

const isOwner = (note, userId) =>
  note.owner.toString() === userId.toString();

// GET /notes - Get all notes for user (with pagination & optional search)
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter = {
      $or: [{ owner: req.user._id }, { sharedWith: req.user._id }],
    };

    // Tag filter
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }

    // Color filter
    if (req.query.color) {
      filter.color = req.query.color;
    }

    const [notes, total] = await Promise.all([
      Note.find(filter)
        .sort({ isPinned: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("owner", "email name")
        .populate("sharedWith", "email name"),
      Note.countDocuments(filter),
    ]);

    res.status(200).json({
      notes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ message: "Failed to fetch notes." });
  }
});

// GET /notes/search - Full-text search
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query 'q' is required." });
    }

    const notes = await Note.find({
      $and: [
        { $or: [{ owner: req.user._id }, { sharedWith: req.user._id }] },
        { $text: { $search: q } },
      ],
    })
      .sort({ score: { $meta: "textScore" } })
      .limit(20)
      .populate("owner", "email name");

    res.status(200).json({ notes, query: q, count: notes.length });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed." });
  }
});

// GET /notes/:id - Get specific note
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate("owner", "email name")
      .populate("sharedWith", "email name");

    if (!note) return res.status(404).json({ message: "Note not found." });
    if (!hasAccess(note, req.user._id)) {
      return res.status(403).json({ message: "Access denied. You don't have permission to view this note." });
    }

    res.status(200).json(note);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Note not found. Invalid ID format." });
    }
    res.status(500).json({ message: "Failed to fetch note." });
  }
});

// POST /notes - Create note
router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required").trim(),
    body("content").notEmpty().withMessage("Content is required").trim(),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
    body("color")
      .optional()
      .isIn(["default", "red", "orange", "yellow", "green", "blue", "purple"])
      .withMessage("Invalid color value"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    try {
      const { title, content, tags, color } = req.body;
      const note = await Note.create({
        title,
        content,
        owner: req.user._id,
        tags: tags || [],
        color: color || "default",
      });

      res.status(201).json(note);
    } catch (error) {
      console.error("Create note error:", error);
      res.status(500).json({ message: "Failed to create note." });
    }
  }
);

// PUT /notes/:id - Update note
router.put(
  "/:id",
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty").trim(),
    body("content").optional().notEmpty().withMessage("Content cannot be empty").trim(),
    body("tags").optional().isArray(),
    body("color")
      .optional()
      .isIn(["default", "red", "orange", "yellow", "green", "blue", "purple"]),
    body("isPinned").optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const note = await Note.findById(req.params.id);

      if (!note) return res.status(404).json({ message: "Note not found." });
      if (!isOwner(note, req.user._id)) {
        return res.status(403).json({ message: "Access denied. Only the owner can update this note." });
      }

      const { title, content, tags, color, isPinned } = req.body;
      if (title !== undefined) note.title = title;
      if (content !== undefined) note.content = content;
      if (tags !== undefined) note.tags = tags;
      if (color !== undefined) note.color = color;
      if (isPinned !== undefined) note.isPinned = isPinned;

      await note.save();
      await note.populate("owner", "email name");
      await note.populate("sharedWith", "email name");

      res.status(200).json(note);
    } catch (error) {
      if (error.kind === "ObjectId") {
        return res.status(404).json({ message: "Note not found." });
      }
      res.status(500).json({ message: "Failed to update note." });
    }
  }
);

// DELETE /notes/:id - Delete note
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found." });
    if (!isOwner(note, req.user._id)) {
      return res.status(403).json({ message: "Access denied. Only the owner can delete this note." });
    }

    await note.deleteOne();
    res.status(204).send();
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Note not found." });
    }
    res.status(500).json({ message: "Failed to delete note." });
  }
});

// POST /notes/:id/share - Share note with another user
router.post(
  "/:id/share",
  [body("share_with_email").isEmail().withMessage("Valid email is required").normalizeEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const note = await Note.findById(req.params.id);

      if (!note) return res.status(404).json({ message: "Note not found." });
      if (!isOwner(note, req.user._id)) {
        return res.status(403).json({ message: "Only the owner can share this note." });
      }

      const { share_with_email } = req.body;

      if (share_with_email === req.user.email) {
        return res.status(400).json({ message: "You cannot share a note with yourself." });
      }

      const targetUser = await User.findOne({ email: share_with_email });
      if (!targetUser) {
        return res.status(404).json({ message: `No user found with email: ${share_with_email}` });
      }

      if (note.sharedWith.some((id) => id.toString() === targetUser._id.toString())) {
        return res.status(409).json({ message: "Note is already shared with this user." });
      }

      note.sharedWith.push(targetUser._id);
      await note.save();

      res.status(200).json({ message: `Note successfully shared with ${share_with_email}.` });
    } catch (error) {
      if (error.kind === "ObjectId") {
        return res.status(404).json({ message: "Note not found." });
      }
      res.status(500).json({ message: "Failed to share note." });
    }
  }
);

// DELETE /notes/:id/share - Unshare note (custom feature)
router.delete("/:id/share", async (req, res) => {
  try {
    const { unshare_email } = req.body;
    if (!unshare_email) {
      return res.status(400).json({ message: "unshare_email is required." });
    }

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found." });
    if (!isOwner(note, req.user._id)) {
      return res.status(403).json({ message: "Only the owner can unshare this note." });
    }

    const targetUser = await User.findOne({ email: unshare_email });
    if (!targetUser) return res.status(404).json({ message: "User not found." });

    note.sharedWith = note.sharedWith.filter(
      (id) => id.toString() !== targetUser._id.toString()
    );
    await note.save();

    res.status(200).json({ message: `Note unshared from ${unshare_email}.` });
  } catch (error) {
    res.status(500).json({ message: "Failed to unshare note." });
  }
});

module.exports = router;
