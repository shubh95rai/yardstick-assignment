import express from "express";
import protect from "../middleware/authMiddleware.js";
import enforceNoteLimit from "../middleware/noteLimitMiddleware.js";
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";

const noteRouter = express.Router();

noteRouter.post("/create", protect, enforceNoteLimit, createNote);
noteRouter.get("/all", protect, getNotes);
noteRouter.get("/:id", protect, getNote);
noteRouter.put("/:id", protect, updateNote);
noteRouter.delete("/:id", protect, deleteNote);

export default noteRouter;
