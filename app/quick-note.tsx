import { useState } from "react";
import { Dialog } from "radix-ui";
import { NotebookPen } from "lucide-react";
import { user } from "../lib/preview-store";
import TextNoteEditor from "./text-note-editor";

export default function QuickNote({
  onSaved,
}: {
  onSaved?: (record: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<any>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (saving) return;
        if (!next && dirty && !confirm("Discard unsaved changes to this note?"))
          return;
        if (next)
          setNote({
            id: crypto.randomUUID(),
            kind: "note",
            title: "",
            notes: "",
            folder: "",
          });
        setDirty(false);
        setOpen(next);
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="icon quick-note-global"
          aria-label="Add quick note"
          title="Add quick note"
          data-help="Write a quick text note and choose a folder or organization to save it in."
          disabled={user().role === "viewer"}
        >
          <NotebookPen size={18} />
        </button>
      </Dialog.Trigger>
      <Dialog.Overlay className="overlay quick-note-overlay">
        <Dialog.Content className="modal folder-notepad quick-note-dialog">
          <Dialog.Title>Quick note</Dialog.Title>
          <Dialog.Description>
            Write a note, then choose where to save it. Open that folder to edit
            it later.
          </Dialog.Description>
          {note && (
            <TextNoteEditor
              key={note.id}
              note={note}
              onDirtyChange={setDirty}
              onBusyChange={setSaving}
              onClose={() => {
                setDirty(false);
                setOpen(false);
              }}
              onSaved={(record: any) => {
                setDirty(false);
                setOpen(false);
                onSaved?.(record);
              }}
            />
          )}
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Root>
  );
}
