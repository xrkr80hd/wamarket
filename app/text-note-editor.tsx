import { useId, useState } from "react";
import { user } from "../lib/preview-store";
import { folderPath, saveTextNote } from "../lib/text-notes";
import { useWorkspace } from "./operations";

export default function TextNoteEditor({
  note,
  onClose,
  onSaved,
  onDirtyChange,
  onBusyChange,
}: any) {
  const state = useWorkspace();
  const [draft, setDraft] = useState({ ...note });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const inputId = useId();
  const folders = state.records
    .filter((r: any) => r.kind === "folder" && !r.archived)
    .map((r: any) => ({ ...r, path: folderPath(r, state.records) }))
    .sort((a: any, b: any) => a.path.localeCompare(b.path));
  const current = state.records.find((r: any) => r.id === draft.id);
  const readOnly = user().role === "viewer" || !!current?.archived;
  function change(patch: any) {
    setDraft({ ...draft, ...patch });
    setDirty(true);
    onDirtyChange?.(true);
    setError("");
  }
  return (
    <form
      aria-label="Text note editor"
      onSubmit={async (event) => {
        event.preventDefault();
        if (saving || readOnly) return;
        setSaving(true);
        onBusyChange?.(true);
        setError("");
        try {
          const record = await saveTextNote(draft);
          setDirty(false);
          onDirtyChange?.(false);
          onSaved(record);
        } catch (e: any) {
          setError(e.message || "Could not save your note. Try again.");
        } finally {
          setSaving(false);
          onBusyChange?.(false);
        }
      }}
    >
      <label htmlFor={inputId + "-title"}>Note title</label>
      <input
        id={inputId + "-title"}
        required
        maxLength={150}
        placeholder="e.g. Video footage links"
        value={draft.title}
        readOnly={readOnly}
        disabled={saving}
        onChange={(event) => change({ title: event.target.value })}
      />
      <label htmlFor={inputId}>Note</label>
      <textarea
        id={inputId}
        rows={6}
        placeholder="Type your note or paste a link here…"
        value={draft.notes || ""}
        readOnly={readOnly}
        disabled={saving}
        onChange={(event) => change({ notes: event.target.value })}
      />
      <label htmlFor={inputId + "-folder"}>Save to folder / organization</label>
      <select
        id={inputId + "-folder"}
        required
        value={draft.folder || ""}
        disabled={saving || readOnly}
        onChange={(event) => change({ folder: event.target.value })}
      >
        <option value="">Choose where to save…</option>
        {folders.map((folder: any) => (
          <option key={folder.id} value={folder.id}>
            {folder.path}
          </option>
        ))}
      </select>
      {!folders.length && (
        <p>Create a folder in Assets first, then save your note here.</p>
      )}
      <div className="folder-notepad-footer">
        <small role="status">
          {saving
            ? "Saving…"
            : readOnly
              ? "Read-only"
              : dirty
                ? "Unsaved changes"
                : "Saved notes can be reopened and edited."}
        </small>
        <div className="ops-actions">
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              if (!dirty || confirm("Discard unsaved changes to this note?"))
                onClose();
            }}
          >
            Close
          </button>
          {!readOnly && (
            <button
              type="submit"
              className="primary"
              disabled={saving || !draft.title.trim() || !draft.folder}
            >
              {saving ? "Saving…" : "Save note"}
            </button>
          )}
        </div>
      </div>
      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
