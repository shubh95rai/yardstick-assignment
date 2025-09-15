import Container from "@/components/Container.jsx";
import NoteCard from "@/components/NoteCard.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { useAuthStore } from "@/store/useAuthStore.js";
import { useNotesStore } from "@/store/useNotesStore.js";
import { useUpgradeStore } from "@/store/useUpgradeStore.js";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export default function NotesPage() {
  const notes = useNotesStore((state) => state.notes);
  const isLoading = useNotesStore((state) => state.isLoading);
  const fetchNotes = useNotesStore((state) => state.fetchNotes);
  const createNote = useNotesStore((state) => state.createNote);
  const deleteNote = useNotesStore((state) => state.deleteNote);
  const isSubmitting = useNotesStore((state) => state.isSubmitting);
  const user = useAuthStore((state) => state.user);
  const tenant = useAuthStore((state) => state.tenant);
  const isUpgrading = useUpgradeStore((state) => state.isUpgrading);
  const limitReached = useNotesStore((state) => state.limitReached);
  const upgradePlan = useUpgradeStore((state) => state.upgradePlan);

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

  const handleUpgrade = async () => {
    await upgradePlan(tenant.slug);
  };

  useEffect(() => {
    fetchNotes();

    if (localStorage.getItem("upgradeSuccess")) {
      toast.success("Plan upgraded to Pro");
      localStorage.removeItem("upgradeSuccess");
    }
  }, []);

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notes</h2>
        <div className="text-sm text-muted-foreground">
          Logged in as <strong>{user?.email}</strong> ({user?.role})
        </div>
      </div>

      {tenant?.plan === "free" && user?.role === "admin" && !limitReached && (
        <div className="mb-4 flex gap-2 items-center justify-end">
          <div className="rounded-md p-3 bg-yellow-50 border border-yellow-200 flex items-center justify-between w-full">
            <div className="text-sm">Tenant is on Free plan (max 3 notes).</div>
            <Button onClick={handleUpgrade} disabled={isUpgrading}>
              {isUpgrading ? "Upgrading..." : "Upgrade to Pro"}
            </Button>{" "}
          </div>
        </div>
      )}

      {limitReached && (
        <div className="mb-4">
          <div className="rounded-md p-3 bg-yellow-50 border border-yellow-200 flex items-center justify-between">
            <div>
              <div className="font-medium">Free plan limit reached</div>
              <div className="text-sm text-slate-600">
                Create more notes by upgrading your tenant to Pro.
              </div>
            </div>
            <div>
              {user?.role === "admin" ? (
                <Button onClick={handleUpgrade} disabled={isUpgrading}>
                  {isUpgrading ? "Upgrading..." : "Upgrade now"}
                </Button>
              ) : (
                <div className="text-sm text-slate-500">
                  Ask your admin to upgrade.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
