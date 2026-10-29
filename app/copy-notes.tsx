import { useState } from "react";
import { Copy, Check, Plus, Pencil, Trash2, X } from "lucide-react";
import { useWorkspace } from "./operations";
import { saveRecord, user } from "../lib/preview-store";

/** Copy-ready notes: email templates, instructions, anything the team pastes
 * often. Shared with everyone; one tap copies the text. */
export default function CopyNotes() {
  const s = useWorkspace(),
    [edit, E] = useState<any>(null),
    [copied, C] = useState(""),
    [q, Q] = useState(""),
    [open, O] = useState(true);
  const notes = s.records
    .filter((r: any) => r.kind === "snippet" && !r.archived)
    .filter(
      (r: any) =>
        !q ||
        (r.title + " " + r.body + " " + (r.dealership || ""))
          .toLowerCase()
          .includes(q.toLowerCase()),
    )
    .sort((a: any, b: any) =>
      String(b.updated || "").localeCompare(String(a.updated || "")),
    );
  async function copy(r: any) {
    try {
      await navigator.clipboard.writeText(r.body || "");
    } catch {
      const t = document.createElement("textarea");
      t.value = r.body || "";
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    C(r.id);
    setTimeout(() => C(""), 1600);
  }
  return (
    <section className="copy-notes card panel">
      <div className="copy-notes-head">
        <button
          type="button"
          className="copy-notes-toggle"
          aria-expanded={open}
          onClick={() => O(!open)}
        >
          <h2>Copy-ready notes</h2>
          <small>Emails, instructions and text the team pastes often</small>
        </button>
        <button
          type="button"
          className="primary"
          onClick={() =>
            E({ kind: "snippet", title: "", body: "", dealership: "" })
          }
        >
          <Plus size={15} /> New note
        </button>
      </div>
      {open && (
        <>
          {s.records.some((r: any) => r.kind === "snippet" && !r.archived) && (
            <input
              className="copy-notes-search"
              aria-label="Search notes"
              placeholder="Search notes…"
              value={q}
              onChange={(e) => Q(e.target.value)}
            />
          )}
          <div className="copy-notes-list">
            {notes.map((r: any) => (
              <article key={r.id} className="copy-note">
                <header>
                  <b>{r.title}</b>
                  {r.dealership && <small>{r.dealership}</small>}
                </header>
                <pre>{r.body}</pre>
                <footer>
                  <button
                    type="button"
                    className="primary copy-note-copy"
                    onClick={() => copy(r)}
                  >
                    {copied === r.id ? (
                      <>
                        <Check size={15} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={15} /> Copy
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label={"Edit " + r.title}
                    onClick={() => E(r)}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    aria-label={"Delete " + r.title}
                    onClick={() => {
                      if (confirm("Delete this note for everyone?"))
                        saveRecord({ ...r, archived: true });
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </footer>
              </article>
            ))}
            {!notes.length && (
              <p className="copy-notes-empty">
                {q
                  ? "No notes match."
                  : "No notes yet. Add an email template or a set of instructions so anyone can copy it in one tap."}
              </p>
            )}
          </div>
        </>
      )}
      {edit && (
        <div className="overlay" onClick={() => E(null)}>
          <form
            className="modal copy-note-editor"
            role="dialog"
            aria-modal="true"
            aria-label="Copy-ready note"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              if (!edit.title.trim() || !edit.body.trim()) return;
              saveRecord({
                ...edit,
                id: edit.id || crypto.randomUUID(),
                owner: edit.owner || user().name,
              });
              E(null);
            }}
          >
            <div className="modalhead">
              <h2>{edit.id ? "Edit note" : "New copy-ready note"}</h2>
              <button type="button" aria-label="Close" onClick={() => E(null)}>
                <X size={16} />
              </button>
            </div>
            <label>
              Title
              <input
                required
                autoFocus
                placeholder="CDJR email — weekend sale"
                value={edit.title}
                onChange={(e) => E({ ...edit, title: e.target.value })}
              />
            </label>
            <label>
              Store (optional)
              <input
                placeholder="Walker CDJR"
                value={edit.dealership || ""}
                onChange={(e) => E({ ...edit, dealership: e.target.value })}
              />
            </label>
            <label>
              Text to copy
              <textarea
                required
                rows={10}
                placeholder={"Subject: …\n\nHi team,\n…"}
                value={edit.body}
                onChange={(e) => E({ ...edit, body: e.target.value })}
              />
            </label>
            <p className="calendar-help">
              Everyone on the team can see and copy this. Don't put passwords
              here.
            </p>
            <button className="primary" type="submit">
              Save note
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
