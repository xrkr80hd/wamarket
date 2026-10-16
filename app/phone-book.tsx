"use client";
import { useState } from "react";
import { Plus, X, Phone, Mail } from "lucide-react";
export default function PhoneBook({ records, onSave }: any) {
  const [search, setSearch] = useState(""),
    [view, setView] = useState("List"),
    [draft, setDraft] = useState<any>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const contacts = records
    .filter(
      (r: any) =>
        r.kind === "contact" &&
        !r.archived &&
        (!search ||
          [r.name, r.title, r.company, r.email, r.phone, r.purpose, r.notes]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())),
    )
    .sort((a: any, b: any) => a.title.localeCompare(b.title));
  return (
    <section>
      <div className="hub-toolbar">
        <button
          className="primary"
          onClick={() =>
            setDraft({
              kind: "contact",
              title: "",
              name: "",
              company: "",
              email: "",
              phone: "",
              purpose: "",
              notes: "",
            })
          }
        >
          <Plus size={16} /> Add contact
        </button>
        <input
          aria-label="Search marketing contacts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Who handles sponsorships, printing, advertising…?"
        />
        <select
          aria-label="Contacts view"
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          <option>Cards</option>
          <option>List</option>
        </select>
      </div>
      <div className={"hub-links " + (view === "List" ? "hub-list" : "")}>
        {contacts.map((r: any) => (
          <article data-select-id={r.id} key={r.id} className="card hub-link">
            <h3 className="contact-name">{r.name || r.company || r.title}</h3>
            {r.company && (
              <p className="contact-company">
                {r.company}
                {r.name ? " · Point of contact: " + r.name : ""}
              </p>
            )}
            {r.purpose && <p className="contact-purpose">{r.purpose}</p>}
            <div className="contact-methods">
              {r.email && (
                <a href={"mailto:" + r.email}>
                  <Mail size={15} />
                  {r.email}
                </a>
              )}
              {r.phone && (
                <a href={"tel:" + r.phone.replace(/[^\d+]/g, "")}>
                  <Phone size={15} />
                  {r.phone}
                </a>
              )}
            </div>
            {r.notes && (
              <details className="contact-notes">
                <summary>Notes</summary>
                <p className="prewrap">{r.notes}</p>
              </details>
            )}
            <div className="hub-actions">
              <button onClick={() => setDraft({ ...r })}>Edit</button>
              <button
                disabled={busy}
                onClick={async () => {
                  if (!confirm("Delete this contact for both users?")) return;
                  setBusy(true);
                  await onSave({ action: "remove-contact", id: r.id });
                  setBusy(false);
                }}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
      {!contacts.length && (
        <div className="card empty">
          <h3>Marketing contacts</h3>
          <p>Add people and businesses you and Travis work with.</p>
        </div>
      )}
      {draft && (
        <div className="overlay">
          <form
            className="modal hub-editor"
            role="dialog"
            aria-modal="true"
            aria-label="Contact editor"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!draft.name.trim() && !draft.company.trim()) {
                setError("Enter a person or business name.");
                return;
              }
              setBusy(true);
              if (
                await onSave({
                  record: {
                    ...draft,
                    title: draft.name.trim() || draft.company.trim(),
                  },
                })
              )
                setDraft(null);
              else setError("Could not save contact.");
              setBusy(false);
            }}
          >
            <div className="modalhead">
              <h2>{draft.id ? "Edit contact" : "Add contact"}</h2>
              <button
                type="button"
                onClick={() => setDraft(null)}
                aria-label="Close contact editor"
              >
                <X />
              </button>
            </div>
            {[
              ["name", "Name / point of contact"],
              ["company", "Company / business (optional)"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["purpose", "Contact them for"],
            ].map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  maxLength={300}
                  type={
                    key === "email" ? "email" : key === "phone" ? "tel" : "text"
                  }
                  value={draft[key] || ""}
                  onChange={(e) =>
                    setDraft({ ...draft, [key]: e.target.value })
                  }
                />
              </label>
            ))}
            <label>
              Notes
              <textarea
                maxLength={4000}
                rows={3}
                value={draft.notes || ""}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              />
            </label>
            {error && <p role="alert">{error}</p>}
            <div className="modalactions">
              <button type="button" onClick={() => setDraft(null)}>
                Cancel
              </button>
              <button className="primary" disabled={busy}>
                Save contact
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
