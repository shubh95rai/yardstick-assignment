import { useState } from "react";
import { Button } from "./ui/button.jsx";
import { useNotesStore } from "@/store/useNotesStore.js";
import { Input } from "./ui/input.jsx";
import { Textarea } from "./ui/textarea.jsx";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore.js";

export default function NoteCard({ note, onDelete }) {
  const updateNote = useNotesStore((state) => state.updateNote);
  const isUpdating = useNotesStore((state) => state.isUpdating);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const user = useAuthStore((state) => state.user);

  function validateForm() {
    if (!title.trim()) return toast.error("Title is required");

    if (!content.trim()) return toast.error("Content is required");

    return true;
  }

  async function handleSave() {
    if (validateForm() === true) {
      const res = await updateNote(note._id, { title, content });

      if (res === true) {
        setIsEditing(false);
      }
    }
  }

  return (
    <div className="border p-3 rounded-xl">
      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold">
                {note.title || <em className="text-slate-500">Untitled</em>}
              </div>
              <div className="text-sm text-slate-600">
                {new Date(note.createdAt).toLocaleString()}
              </div>
            </div>

            {user._id === note.userId._id && (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(note._id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
          <div className="mt-2 text-sm whitespace-pre-wrap">{note.content}</div>
        </>
      )}
    </div>
  );
}
