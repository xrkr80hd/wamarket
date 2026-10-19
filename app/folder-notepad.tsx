import { useState } from "react";
import { user } from "../lib/preview-store";
import { useWorkspace } from "./operations";
import TextNoteEditor from "./text-note-editor";

export default function FolderNotepad({ folderId }: { folderId: string }) {
  const state = useWorkspace();
  const folder = state.records.find((r: any) => r.id === folderId);
  const notes = state.records.filter(
    (r: any) => r.kind === "note" && r.folder === folderId && !r.archived,
  );
  const [draft, setDraft] = useState<any>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const readOnly = user().role === "viewer" || !!folder?.archived;
  if (!folder || folder.kind !== "folder") return null;
  function open(note: any) {
    if (dirty && !confirm("Discard unsaved changes to this note?")) return;
    setDraft({ ...note });
    setDirty(false);
  }
  return (
    <section className="card panel folder-notepad" aria-label="Folder notes">
      <div className="sectionhead">
        <h3>Text notes</h3>
        {!readOnly && (
          <button
            type="button"
            disabled={saving}
            onClick={() =>
              open({
                id: crypto.randomUUID(),
                kind: "note",
                folder: folderId,
                title: "",
                notes: "",
              })
            }
          >
            ＋ New text note
          </button>
        )}
      </div>
      <div className="folder-note-list">
        {notes.map((note: any) => (
          <button
            type="button"
            className="folder-note-item"
            key={note.id}
            disabled={saving}
            onClick={() => open(note)}
          >
            <b>{note.title}</b>
            <small>{note.notes?.slice(0, 140) || "Empty note"}</small>
          </button>
        ))}
      </div>
      {!notes.length && !draft && (
        <p>
          Create a text note to keep links, instructions, or ideas in this
          folder.
        </p>
      )}
      {draft && (
        <TextNoteEditor
          key={draft.id}
          note={draft}
          onDirtyChange={setDirty}
          onBusyChange={setSaving}
          onClose={() => {
            setDraft(null);
            setDirty(false);
          }}
          onSaved={() => {
            setDraft(null);
            setDirty(false);
          }}
        />
      )}
    </section>
  );
}
