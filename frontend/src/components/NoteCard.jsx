import { Button } from "./ui/button.jsx";

export default function NoteCard({ note, onDelete }) {
  return (
    <div className="border p-3 rounded-xl">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">
            {note.title || <em className="text-slate-500">Untitled</em>}
          </div>
          <div className="text-sm text-slate-600">
            {new Date(note.createdAt).toLocaleString()}
          </div>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(note._id)}
        >
          Delete
        </Button>
      </div>
      <div className="mt-2 text-sm whitespace-pre-wrap">{note.content}</div>
    </div>
  );
}
