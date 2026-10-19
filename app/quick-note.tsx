import { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { NotebookPen } from "lucide-react";
import { getState, user } from "../lib/preview-store";
import { flushCloudWorkspace } from "../lib/cloud-workspace";
import TextNoteEditor from "./text-note-editor";
import WorkspacePortal from "./workspace-portal";

export default function QuickNote({
  onSaved,
}: {
  onSaved?: (record: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<any>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const request = useRef(0);
  const current = useRef({ dirty, saving });
  current.current = { dirty, saving };
  function close() {
    request.current++;
    setDirty(false);
    setLoading(false);
    setOpen(false);
  }
  useEffect(() => {
    const show = async (event: Event) => {
      const id = (event as CustomEvent).detail?.id;
      if (!id || current.current.saving) return;
      if (
        current.current.dirty &&
        !confirm("Discard unsaved changes to this note?")
      )
        return;
      const token = ++request.current;
      setDirty(false);
      setNote(null);
      setError("");
      setEditing(true);
      setLoading(true);
      setOpen(true);
      try {
        let saved = getState().records.find(
          (r: any) => r.id === id && r.kind === "note" && !r.archived,
        );
        if (!saved) {
          await flushCloudWorkspace();
          saved = getState().records.find(
            (r: any) => r.id === id && r.kind === "note" && !r.archived,
          );
        }
        if (!saved) throw Error("This note is no longer available.");
        if (token === request.current) setNote(saved);
      } catch (e: any) {
        if (token === request.current) setError(e.message);
      } finally {
        if (token === request.current) setLoading(false);
      }
    };
    window.addEventListener("wam-open-text-note", show);
    return () => {
      request.current++;
      window.removeEventListener("wam-open-text-note", show);
    };
  }, []);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (saving) return;
        if (!next && dirty && !confirm("Discard unsaved changes to this note?"))
          return;
        if (next) {
          request.current++;
          setEditing(false);
          setLoading(false);
          setError("");
          setNote({
            id: crypto.randomUUID(),
            kind: "note",
            title: "",
            notes: "",
            folder: "",
          });
          setDirty(false);
          setOpen(true);
        } else close();
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
      {open && (
        <WorkspacePortal>
          <Dialog.Overlay className="quick-note-overlay" />
          <Dialog.Content className="modal folder-notepad quick-note-dialog">
            <Dialog.Title>{editing ? "Edit note" : "Quick note"}</Dialog.Title>
            <Dialog.Description>
              Write your note here, then choose the organization or folder where
              it will be saved.
            </Dialog.Description>
            {loading && <p role="status">Opening note…</p>}
            {error && (
              <>
                <p role="alert">{error}</p>
                <button type="button" onClick={close}>
                  Close
                </button>
              </>
            )}
            {note && (
              <TextNoteEditor
                key={note.id}
                note={note}
                onDirtyChange={setDirty}
                onBusyChange={setSaving}
                onClose={close}
                onSaved={(record: any) => {
                  close();
                  onSaved?.(record);
                }}
              />
            )}
          </Dialog.Content>
        </WorkspacePortal>
      )}
    </Dialog.Root>
  );
}
