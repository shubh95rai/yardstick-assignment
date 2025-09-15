import Container from "@/components/Container.jsx";
import NoteCard from "@/components/NoteCard.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { useNotesStore } from "@/store/useNotesStore.js";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { create } from "zustand";

export default function NotesPage() {
  const notes = useNotesStore((state) => state.notes);
  const isLoading = useNotesStore((state) => state.isLoading);
  const fetchNotes = useNotesStore((state) => state.fetchNotes);
  const createNote = useNotesStore((state) => state.createNote);
  const deleteNote = useNotesStore((state) => state.deleteNote);
  const updateNote = useNotesStore((state) => state.updateNote);
  const isSubmitting = useNotesStore((state) => state.isSubmitting);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function validateForm() {
    if (!title.trim()) return toast.error("Title is required");

    if (!content.trim()) return toast.error("Content is required");

    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm() === true) createNote({ title, content });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Container>
      <div className="space-y-3 rounded-lg bg-white p-6 border shadow-md">
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
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating...
            </>
          ) : (
            "Create"
          )}
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={deleteNote} />
          ))
        ) : (
          <div className="text-center pt-10">
            <p className="font-medium text-muted-foreground">
              No notes found. Create one to get started.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
