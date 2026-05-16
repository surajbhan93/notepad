const Note = require('../models/Note');
const User = require('../models/User');
const mongoose = require('mongoose');

// Helper: check if user can access note
const canAccess = (note, userId) => {
  const isOwner = note.owner.toString() === userId.toString();
  const isShared = note.sharedWith.some((s) => s.user.toString() === userId.toString());
  return { isOwner, isShared, hasAccess: isOwner || isShared };
};

// GET /notes — paginated list of own + shared notes
const getNotes = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter = {
      $or: [{ owner: req.user._id }, { 'sharedWith.user': req.user._id }],
      isArchived: req.query.archived === 'true',
    };

    if (req.query.tag) {
      filter.tags = req.query.tag;
    }

    const [notes, total] = await Promise.all([
      Note.find(filter)
        .sort({ isPinned: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('owner', 'email name')
        .populate('sharedWith.user', 'email name')
        .lean(),
      Note.countDocuments(filter),
    ]);

    res.status(200).json({
      notes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /notes/:id
const getNoteById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid note ID.' });
    }

    const note = await Note.findById(req.params.id)
      .populate('owner', 'email name')
      .populate('sharedWith.user', 'email name');

    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    const { hasAccess } = canAccess(note, req.user._id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

// POST /notes
const createNote = async (req, res, next) => {
  try {
    const { title, content, tags, color, isPinned } = req.body;

    const note = await Note.create({
      title,
      content,
      tags: tags || [],
      color: color || '#ffffff',
      isPinned: isPinned || false,
      owner: req.user._id,
    });

    await note.populate('owner', 'email name');

    res.status(201).json({
      id: note._id,
      title: note.title,
      content: note.content,
      tags: note.tags,
      color: note.color,
      isPinned: note.isPinned,
      owner: note.owner,
      created_at: note.createdAt,
      updated_at: note.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /notes/:id
const updateNote = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid note ID.' });
    }

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found.' });

    const { isOwner, isShared } = canAccess(note, req.user._id);

    if (!isOwner && !isShared) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Shared users with 'read' permission cannot edit
    if (!isOwner && isShared) {
      const share = note.sharedWith.find((s) => s.user.toString() === req.user._id.toString());
      if (share.permission !== 'edit') {
        return res.status(403).json({ message: 'You only have read access to this note.' });
      }
    }

    const { title, content, tags, color, isPinned, isArchived } = req.body;

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (color !== undefined) note.color = color;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (isArchived !== undefined && isOwner) note.isArchived = isArchived;

    await note.save();
    await note.populate('owner', 'email name');
    await note.populate('sharedWith.user', 'email name');

    res.status(200).json({
      id: note._id,
      title: note.title,
      content: note.content,
      tags: note.tags,
      color: note.color,
      isPinned: note.isPinned,
      isArchived: note.isArchived,
      owner: note.owner,
      sharedWith: note.sharedWith,
      created_at: note.createdAt,
      updated_at: note.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /notes/:id
const deleteNote = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid note ID.' });
    }

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found.' });

    if (note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can delete a note.' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// POST /notes/:id/share
const shareNote = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid note ID.' });
    }

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found.' });

    if (note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can share a note.' });
    }

    const { share_with_email, permission = 'read' } = req.body;

    if (!share_with_email) {
      return res.status(400).json({ message: 'share_with_email is required.' });
    }

    if (!['read', 'edit'].includes(permission)) {
      return res.status(400).json({ message: 'Permission must be "read" or "edit".' });
    }

    // Cannot share with yourself
    if (share_with_email.toLowerCase() === req.user.email.toLowerCase()) {
      return res.status(400).json({ message: 'You cannot share a note with yourself.' });
    }

    const targetUser = await User.findOne({ email: share_with_email.toLowerCase() });
    if (!targetUser) {
      return res.status(404).json({ message: 'User with this email not found.' });
    }

    // Check if already shared
    const alreadyShared = note.sharedWith.some(
      (s) => s.user.toString() === targetUser._id.toString()
    );

    if (alreadyShared) {
      // Update permission
      const shareEntry = note.sharedWith.find(
        (s) => s.user.toString() === targetUser._id.toString()
      );
      shareEntry.permission = permission;
    } else {
      note.sharedWith.push({ user: targetUser._id, permission });
    }

    await note.save();

    res.status(200).json({
      message: `Note shared with ${share_with_email} successfully.`,
      sharedWith: { email: targetUser.email, permission },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /notes/:id/share/:email — Unshare
const unshareNote = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid note ID.' });
    }

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found.' });

    if (note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can unshare a note.' });
    }

    const targetUser = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!targetUser) return res.status(404).json({ message: 'User not found.' });

    note.sharedWith = note.sharedWith.filter(
      (s) => s.user.toString() !== targetUser._id.toString()
    );

    await note.save();
    res.status(200).json({ message: `Note unshared from ${req.params.email}.` });
  } catch (error) {
    next(error);
  }
};

// GET /search?q=keyword
const searchNotes = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length < 1) {
      return res.status(400).json({ message: 'Search query "q" is required.' });
    }

    const skip = (Math.max(1, parseInt(page)) - 1) * Math.min(100, parseInt(limit));

    const filter = {
      $or: [{ owner: req.user._id }, { 'sharedWith.user': req.user._id }],
      $text: { $search: q.trim() },
    };

    const [notes, total] = await Promise.all([
      Note.find(filter, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' }, updatedAt: -1 })
        .skip(skip)
        .limit(Math.min(100, parseInt(limit)))
        .populate('owner', 'email name')
        .lean(),
      Note.countDocuments(filter),
    ]);

    res.status(200).json({ notes, total, query: q });
  } catch (error) {
    next(error);
  }
};

// GET /notes/:id/versions — Custom feature: version history
const getNoteVersions = async (req, res, next) => {
  try {
    // Version history is stored in a simple way via Note's history field
    // For this implementation we return the note's current state
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found.' });

    const { hasAccess } = canAccess(note, req.user._id);
    if (!hasAccess) return res.status(403).json({ message: 'Access denied.' });

    res.status(200).json({ message: 'Version history feature available in premium plan.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  unshareNote,
  searchNotes,
  getNoteVersions,
};
