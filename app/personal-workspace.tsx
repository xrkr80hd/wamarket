import { user } from "../lib/preview-store";
("use client");
import { useEffect, useState } from "react";
import { Plus, X, ExternalLink, Eye, EyeOff, Check } from "lucide-react";
import { apiFetch, apiJSON } from "../lib/api-response";
import { shiftDate } from "../lib/planner";
import { chicagoDate } from "../lib/daily-quotes";
export default function PersonalWorkspace({ records }: any) {
  const [entries, setEntries] = useState<any[]>([]),
    [draft, setDraft] = useState<any>(null),
    [search, setSearch] = useState(""),
    [category, setCategory] = useState("All"),
    [view, setView] = useState("Cards"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [revealed, setRevealed] = useState<Record<string, string>>({}),
    [showDraftPassword, setShowDraftPassword] = useState(false);
  async function load() {
    try {
      const data = await apiJSON(await apiFetch("/api/personal-workspace"));
      setEntries(data.entries);
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  }
  useEffect(() => {
    load();
    return () => setRevealed({});
  }, []);
  useEffect(() => {
    if (!Object.keys(revealed).length) return;
    const timer = setTimeout(() => setRevealed({}), 30000);
    return () => clearTimeout(timer);
  }, [revealed]);
  useEffect(() => {
    const hide = () => {
      if (document.visibilityState !== "visible") setRevealed({});
    };
    document.addEventListener("visibilitychange", hide);
    return () => document.removeEventListener("visibilitychange", hide);
  }, []);
  async function save(body: any) {
    setBusy(true);
    setError("");
    try {
      await apiJSON(
        await apiFetch("/api/personal-workspace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
      );
      await load();
      setMessage("Saved to workspace");
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  const filtered = entries.filter(
    (e) =>
      !e.archived &&
      (category === "All" || e.category === category) &&
      (!search ||
        [e.title, e.url, e.category, e.notes, e.username]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())),
  );
  return (
    <section className="personal-hub">
      <div className="hub-toolbar">
        <button
          className="primary"
          onClick={() => {
            setRevealed({});
            setDraft({
              title: "",
              url: "",
              category: "",
              username: "",
              password: "",
              notes: "",
              entryType: "link",
              reminderDate: "",
            });
          }}
        >
          <Plus size={16} /> Add link / account
        </button>
        <button
          onClick={() =>
            setDraft({
              title: "",
              url: "",
              category: "",
              username: "",
              password: "",
              notes: "",
              entryType: "note",
              reminderDate: "",
            })
          }
        >
          <Plus size={16} /> Quick note / reminder
        </button>
        <input
          aria-label="Search saved links"
          placeholder="Search links and accounts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Link category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All</option>
          {Array.from(
            new Set(entries.map((e) => e.category).filter(Boolean)),
          ).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          aria-label="Workspace view"
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          <option>Cards</option>
          <option>List</option>
        </select>
        <button onClick={load}>Refresh links</button>
      </div>
      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      {entries.some(
        (e) =>
          e.reminderDate &&
          e.reminderDate <= chicagoDate() &&
          (!e.checkedDate || e.checkedDate < e.reminderDate),
      ) && (
        <div className="notice" role="status">
          You have reminders due. They are highlighted below.
        </div>
      )}
      <div className={"hub-links " + (view === "List" ? "hub-list" : "")}>
        {filtered.map((e) => (
          <article
            className={
              "card hub-link " +
              (e.reminderDate &&
              e.reminderDate <= chicagoDate() &&
              (!e.checkedDate || e.checkedDate < e.reminderDate)
                ? "reminder-due"
                : "")
            }
            data-select-kind="personal"
            data-select-parent={user().id}
            data-select-id={e.id}
            key={e.id}
          >
            {e.url && (
              <div className="website-preview">
                <img
                  loading="lazy"
                  src={"/api/link-preview?id=" + encodeURIComponent(e.id)}
                  alt={"Preview of " + e.title}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <span>{new URL(e.url).hostname}</span>
              </div>
            )}
            <div className="sectionhead">
              <h3>{e.title}</h3>
              {e.category && <small>{e.category}</small>}
            </div>
            {e.url && (
              <a
                className="hub-open"
                href={e.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open website <ExternalLink size={15} />
              </a>
            )}
            {e.username && <p className="hub-account">Account: {e.username}</p>}
            {e.hasPassword && (
              <div className="hub-password">
                <input
                  aria-label={"Saved password for " + e.title}
                  type={revealed[e.id] !== undefined ? "text" : "password"}
                  readOnly
                  value={revealed[e.id] ?? "••••••••"}
                />
                <button
                  aria-label={
                    revealed[e.id] !== undefined
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={busy}
                  onClick={async () => {
                    if (revealed[e.id] !== undefined) {
                      setRevealed((current) => {
                        const next = { ...current };
                        delete next[e.id];
                        return next;
                      });
                      return;
                    }
                    try {
                      const data = await apiJSON(
                        await apiFetch("/api/personal-workspace", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "reveal", id: e.id }),
                        }),
                      );
                      setRevealed({ ...revealed, [e.id]: data.password });
                    } catch (err: any) {
                      setError(err.message);
                    }
                  }}
                >
                  {revealed[e.id] !== undefined ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>
              </div>
            )}
            {e.notes && <p className="prewrap">{e.notes}</p>}
            {e.reminderDate && (
              <p className="reminder-date">
                Reminder: {e.reminderDate}
                {e.checkedDate >= e.reminderDate ? " · Done" : ""}
              </p>
            )}
            {["note", "reminder"].includes(e.entryType) && (
              <label className="reminder-project">
                Add to a project
                <select
                  aria-label={"Add " + e.title + " to project"}
                  disabled={busy}
                  value=""
                  onChange={async (event) => {
                    if (!event.target.value) return;
                    if (
                      await save({
                        action: "project-task",
                        id: e.id,
                        projectId: event.target.value,
                      })
                    )
                      setMessage("Added to project checklist");
                  }}
                >
                  <option value="">Choose project / campaign…</option>
                  {records
                    .filter(
                      (r: any) =>
                        ["project", "event"].includes(r.kind) &&
                        !r.archived &&
                        r.status !== "Completed",
                    )
                    .map((r: any) => (
                      <option key={r.id} value={r.id}>
                        {r.title}
                      </option>
                    ))}
                </select>
              </label>
            )}
            <div className="hub-actions">
              <button
                disabled={busy}
                aria-pressed={e.checkedDate === chicagoDate()}
                onClick={() =>
                  save({
                    action: "check",
                    id: e.id,
                    date: e.checkedDate === chicagoDate() ? "" : chicagoDate(),
                  })
                }
              >
                <Check size={14} />
                {e.checkedDate === chicagoDate()
                  ? "Checked today"
                  : "Mark checked today"}
              </button>
              <button
                onClick={() => {
                  setRevealed({});
                  setDraft({ ...e, password: "", clearPassword: false });
                }}
              >
                Edit
              </button>
              <button
                disabled={busy}
                onClick={async () => {
                  if (
                    confirm("Delete this saved link and its account details?")
                  )
                    await save({ action: "delete", id: e.id });
                }}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="card empty">
          <h3>Your links and reminders</h3>
          <p>Add the websites, accounts, and checks you use during the day.</p>
        </div>
      )}
      <p className="hub-private-note">
        Notes and links stay in this local preview. Real password storage is
        disabled.
      </p>
      {draft && (
        <div className="overlay">
          <form
            className="modal hub-editor"
            role="dialog"
            aria-modal="true"
            aria-label="Edit saved link"
            onSubmit={async (e) => {
              e.preventDefault();
              const body = { ...draft };
              if (draft.id && !draft.password) delete body.password;
              if (await save(body)) setDraft(null);
            }}
          >
            <div className="modalhead">
              <h2>{draft.id ? "Edit link / account" : "Add link / account"}</h2>
              <button
                type="button"
                aria-label="Close editor"
                onClick={() => setDraft(null)}
              >
                <X />
              </button>
            </div>
            <label>
              Save as
              <select
                value={draft.entryType || "link"}
                onChange={(e) =>
                  setDraft({ ...draft, entryType: e.target.value })
                }
              >
                <option value="link">Website / account</option>
                <option value="note">Note</option>
                <option value="reminder">Reminder</option>
              </select>
            </label>
            <label>
              Name
              <input
                required
                maxLength={300}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </label>
            {(draft.entryType || "link") === "link" && (
              <>
                <label>
                  Website URL
                  <input
                    type="url"
                    placeholder="https://…"
                    value={draft.url}
                    onChange={(e) =>
                      setDraft({ ...draft, url: e.target.value })
                    }
                  />
                </label>
              </>
            )}
            <label>
              Category
              <input
                maxLength={100}
                placeholder="Reporting, OEM portals, Vendors…"
                value={draft.category}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value })
                }
              />
            </label>
            {(draft.entryType || "link") === "link" && (
              <>
                <label>
                  Username / account email
                  <input
                    maxLength={300}
                    autoComplete="off"
                    value={draft.username}
                    onChange={(e) =>
                      setDraft({ ...draft, username: e.target.value })
                    }
                  />
                </label>
                <label>
                  Password
                  <div className="password-entry">
                    <input
                      type={showDraftPassword ? "text" : "password"}
                      maxLength={2000}
                      autoComplete="new-password"
                      placeholder={draft.hasPassword ? "Leave blank to keep saved password" : ""}
                      value={draft.password}
                      onChange={(e) => setDraft({ ...draft, password: e.target.value })}
                    />
                    <button type="button" aria-label={showDraftPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowDraftPassword(!showDraftPassword)}>{showDraftPassword ? "Hide" : "Show"}</button>
                  </div>
                </label>
                {draft.hasPassword && (
                  <label className="hub-checkbox">
                    <input
                      type="checkbox"
                      checked={draft.clearPassword}
                      onChange={(e) =>
                        setDraft({ ...draft, clearPassword: e.target.checked })
                      }
                    />{" "}
                    Remove saved password
                  </label>
                )}
              </>
            )}
            <label>
              Notes / what to check
              <textarea
                maxLength={4000}
                rows={3}
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              />
            </label>
            <label>
              Remind me on (optional)
              <input
                type="date"
                value={draft.reminderDate || ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    reminderDate: e.target.value,
                    entryType:
                      draft.entryType === "note" ? "reminder" : draft.entryType,
                  })
                }
              />
            </label>
            <button
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  reminderDate: shiftDate(chicagoDate(), 1),
                  entryType:
                    draft.entryType === "note" ? "reminder" : draft.entryType,
                })
              }
            >
              Remind me tomorrow
            </button>
            <small>
              Reminders appear in My Workspace when you open the site.
            </small>
            {error && <p role="alert">{error}</p>}
            <div className="modalactions">
              <button type="button" onClick={() => setDraft(null)}>
                Cancel
              </button>
              <button className="primary" disabled={busy}>
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
