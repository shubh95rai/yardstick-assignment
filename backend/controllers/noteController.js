import Note from "../models/Note.js";
import User from "../models/User.js";

// create note
export async function createNote(req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = req.user;

    const note = await Note.create({
      title,
      content,
      userId: user._id,
      tenantId: user.tenantId,
    });

    res.status(201).json({ note });
  } catch (error) {
    console.log("Error in createNote controller:", error.message);

    res.status(500).json({ message: "Server error" });
  }
}

// get all notes for tenant
export async function getNotes(req, res) {
  try {
    const user = req.user;

    const notes = await Note.find({ tenantId: user.tenantId })
      .sort({ createdAt: -1 })
      .populate("userId");

    res.json({ notes });
  } catch (error) {
    console.log("Error in getNotes controller:", error.message);

    res.status(500).json({ message: "Server error" });
  }
}

// get note by id
export async function getNote(req, res) {
  try {
    const note = await Note.find({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ note });
  } catch (error) {
    console.log("Error in getNote controller:", error.message);

    res.status(500).json({ message: "Server error" });
  }
}

// update note by id
export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden - Not your note" });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ note: updatedNote });
  } catch (error) {
    console.log("Error in updateNote controller:", error.message);

    res.status(500).json({ message: "Server error" });
  }
}

// delete note by id
export async function deleteNote(req, res) {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden - Not your note" });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNote controller:", error.message);

    res.status(500).json({ message: "Server error" });
  }
}
