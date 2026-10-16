import LocationBadge from "./location-badge";
import React, { useState, useEffect, useRef } from "react";
import {
  getState,
  mutate,
  user,
  people,
  locations,
  workflow,
  saveRecord,
  addAsset,
  fileURL,
  exportJSON,
} from "../lib/preview-store";
import { chicagoDate, quoteForDay } from "../lib/daily-quotes";
export function useWorkspace() {
  const [s, set] = useState(getState);
  useEffect(() => {
    const update = () => set(getState());
    window.addEventListener("wam-change", update);
    window.addEventListener("wam-cloud-hydrated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("wam-change", update);
      window.removeEventListener("wam-cloud-hydrated", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return s;
}
export function FilePreview({ id, type, controls = true }: any) {
  const [url, set] = useState("");
  useEffect(() => {
    let alive = true;
    fileURL(id).then((u) => {
      if (alive) set(u);
    });
    return () => {
      alive = false;
    };
  }, [id]);
  return !url ? (
    <div className="file-placeholder">
      {type?.startsWith("video/") ? "▶" : "▧"}
      <small>No local file attached</small>
    </div>
  ) : type?.startsWith("image/") ? (
    <img className="ops-preview" src={url} alt="Asset preview" />
  ) : type?.startsWith("video/") ? (
    <video
      className="ops-preview"
      src={url}
      controls={controls}
      preload="metadata"
    />
  ) : type?.startsWith("audio/") ? (
    <audio src={url} controls />
  ) : (
    <a href={url} target="_blank" rel="noreferrer">
      Open / download file ↗
    </a>
  );
}
export function DailyQuote() {
  const s = useWorkspace(),
    day = chicagoDate(),
    scheduled = s.quotes.find((q: any) => q.date === day);
  return (
    <section className="quote-top">
      <span className="eyebrow">QUOTE OF THE DAY · {day}</span>
      <blockquote>“{scheduled?.text || quoteForDay(day)}”</blockquote>
      <small>
        {scheduled?.author || "Walker Suite · original motivational copy"}
      </small>
    </section>
  );
}
export function RecordEditor({ record, onClose }: any) {
  const [d, set] = useState({ ...record }),
    [error, E] = useState("");
  const state = useWorkspace();
  const field = (key: string, label: string, type = "text") => (
    <label>
      {label}
      {type === "textarea" ? (
        <textarea
          value={d[key] || ""}
          onChange={(e) => set({ ...d, [key]: e.target.value })}
        />
      ) : (
        <input
          type={type}
          value={d[key] || ""}
          onChange={(e) => set({ ...d, [key]: e.target.value })}
        />
      )}
    </label>
  );
  return (
    <div className="overlay">
      <form
        className="modal wide record-editor"
        role="dialog"
        aria-modal="true"
        aria-label="Record editor"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            saveRecord(d);
            onClose();
          } catch (e: any) {
            E(e.message);
          }
        }}
      >
        <div className="modalhead">
          <h2>
            {d.id ? "Edit" : "Create"} {d.kind}
          </h2>
          <button type="button" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        <details className="editor-section" open>
          <summary>Basics</summary>
          <div className="formgrid">
            <label className="full">
              Name
              <input
                required
                maxLength={300}
                value={d.title || ""}
                onChange={(e) => set({ ...d, title: e.target.value })}
              />
            </label>
            <label>
              Status
              <select
                value={d.status || "Planned"}
                onChange={(e) => set({ ...d, status: e.target.value })}
              >
                {[
                  ...new Set(
                    [
                      ...(state.settings.statuses || workflow),
                      "Draft",
                      "Revision",
                      "Completed",
                      d.status,
                    ].filter(Boolean),
                  ),
                ].map((x: any) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Owner
              <select
                value={d.owner || "Travis"}
                onChange={(e) => set({ ...d, owner: e.target.value })}
              >
                {people.map((p) => (
                  <option key={p.id}>{p.name}</option>
                ))}
              </select>
            </label>
          </div>
        </details>
        <details className="editor-section">
          <summary>Schedule</summary>
          <div className="formgrid">
            {field("date", "Start / shoot / publication date", "date")}
            {field("endDate", "End date", "date")}
            {field("deadline", "Deadline", "date")}
            <label>
              Recurrence
              <select
                value={d.recurrence || "One-time"}
                onChange={(e) => set({ ...d, recurrence: e.target.value })}
              >
                <option>One-time</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Annual</option>
              </select>
            </label>
          </div>
        </details>
        <details className="editor-section">
          <summary>Locations & campaign</summary>
          <div className="formgrid">
            <label>
              Location (optional)
              <select
                value={d.dealership || ""}
                onChange={(e) => set({ ...d, dealership: e.target.value })}
              >
                <option value="">Unassigned / group-wide</option>
                {locations.map(([n]) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <label>
              Campaign (optional)
              <select
                value={d.project || ""}
                onChange={(e) => set({ ...d, project: e.target.value })}
              >
                <option value="">No campaign</option>
                {state.records
                  .filter(
                    (r: any) =>
                      r.kind === "project" && !r.archived && r.id !== d.id,
                  )
                  .map((r: any) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
              </select>
            </label>
            {["project", "video"].includes(d.kind) && (
              <fieldset className="full location-picker">
                <legend>Additional locations</legend>
                <div className="location-picker-grid">
                  {locations.map(([n]) => {
                    const selected = (d.dealerships || []).includes(n);
                    return (
                      <button
                        type="button"
                        className={
                          "location-choice " + (selected ? "is-selected" : "")
                        }
                        aria-pressed={selected}
                        key={n}
                        onClick={() =>
                          set({
                            ...d,
                            dealerships: selected
                              ? (d.dealerships || []).filter(
                                  (x: string) => x !== n,
                                )
                              : [...(d.dealerships || []), n],
                          })
                        }
                      >
                        <LocationBadge
                          record={{ kind: "dealership", title: n }}
                        />
                        <span>
                          {n
                            .replace(/^Walker /, "")
                            .replace(
                              "Automotive Used Cars – Pineville",
                              "Used Cars · Pineville",
                            )}
                        </span>
                        <span
                          className="location-choice-check"
                          aria-hidden="true"
                        >
                          {selected ? "✓" : "+"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}
          </div>
        </details>
        <details className="editor-section">
          <summary>Creative details</summary>
          <div className="formgrid">
            {field("notes", "Brief / description / caption", "textarea")}
            {field("objectives", "Objectives", "textarea")}
            {["video", "idea"].includes(d.kind) && (
              <>
                {field("script", "Script / hook", "textarea")}
                {field("equipment", "Equipment, people and vehicles")}
                {field("rawFootage", "Raw footage / reference URL", "url")}
              </>
            )}
            {d.kind === "content" && (
              <>
                {field("hashtags", "Hashtags")}
                <label>
                  Platform
                  <select
                    value={d.platform || "Instagram"}
                    onChange={(e) => set({ ...d, platform: e.target.value })}
                  >
                    {[
                      "Facebook",
                      "Instagram",
                      "TikTok",
                      "YouTube",
                      "Email",
                      "Website",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
              </>
            )}
            {d.kind === "dealership" && field("address", "Street address")}
          </div>
        </details>
        <details className="editor-section">
          <summary>Organization</summary>
          <div className="formgrid">
            <label>
              Campaign category
              <select
                value={d.category || ""}
                onChange={(e) => set({ ...d, category: e.target.value })}
              >
                <option value="">No category</option>
                {state.settings.categories.map((c: string) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            {field("priority", "Priority")}
            <label>
              Folder (optional)
              <select
                value={d.folder || ""}
                onChange={(e) => set({ ...d, folder: e.target.value })}
              >
                <option value="">Central library / no folder</option>
                {state.records
                  .filter(
                    (r: any) =>
                      r.kind === "folder" && !r.archived && r.id !== d.id,
                  )
                  .map((r: any) => (
                    <option key={r.id} value={r.id}>
                      {r.dealership && r.dealership !== r.title
                        ? r.dealership + " / "
                        : ""}
                      {r.title}
                    </option>
                  ))}
              </select>
            </label>
            {field("collaborators", "Collaborators / @mentions")}
            {field("tags", "Tags (comma-separated)")}
          </div>
        </details>
        {error && (
          <p className="notice" role="alert">
            {error}
          </p>
        )}
        <div className="modalactions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary">Save</button>
        </div>
      </form>
    </div>
  );
}
export function Operations({ section, onReview }: any) {
  const s = useWorkspace(),
    [edit, E] = useState<any>(null),
    [loc, L] = useState(""),
    [q, Q] = useState(""),
    [picked, P] = useState<any>(null),
    [sort, Sort] = useState("Newest");
  const kind =
    section === "Video production"
      ? "video"
      : section === "Ideas library"
        ? "idea"
        : section === "Social planner"
          ? "content"
          : "project";
  const rows = s.records.filter(
    (r: any) =>
      r.kind === kind &&
      !r.archived &&
      (!loc || r.dealership === loc || r.dealerships?.includes(loc)) &&
      (!q || (r.title + " " + r.notes).toLowerCase().includes(q.toLowerCase())),
  );
  rows.sort((a: any, b: any) =>
    sort === "Name"
      ? a.title.localeCompare(b.title)
      : sort === "Date"
        ? String(a.date || "9999").localeCompare(String(b.date || "9999"))
        : String(b.updated || "").localeCompare(String(a.updated || "")),
  );
  return (
    <>
      <div className="ops-toolbar">
        <select
          aria-label="Sort records"
          value={sort}
          onChange={(e) => Sort(e.target.value)}
        >
          <option>Newest</option>
          <option>Name</option>
          <option>Date</option>
        </select>
        <button
          className="primary"
          onClick={() =>
            E({
              kind,
              title: "",
              status: "Planned",
              owner: user().name,
              tasks: [],
              shots: [],
              versions: [],
            })
          }
        >
          ＋ New {kind === "project" ? "campaign" : kind}
        </button>
        <input
          placeholder="Search…"
          aria-label="Search records"
          value={q}
          onChange={(e) => Q(e.target.value)}
        />
        <LocationSelect value={loc} onChange={L} />
      </div>
      <div className="ops-cards">
        {rows.map((r: any) => (
          <article className="card panel" data-select-id={r.id} key={r.id}>
            <span className="eyebrow">
              {r.dealership || "Group-wide"} {r.demo ? "· Demo" : ""}
            </span>
            <h3>{r.title}</h3>
            <p>{r.notes?.slice(0, 170)}</p>
            <span className="badge">{r.status}</span>
            <p>
              {r.owner || "Unassigned"} · {r.date || "Date not set"}
            </p>
            <div className="ops-actions">
              <button onClick={() => E(r)}>Edit</button>
              <button onClick={() => P(r)}>Open workspace</button>
              {kind === "video" && (
                <button onClick={() => onReview(r.id)}>Review video</button>
              )}
              {kind === "idea" &&
                ["project", "video", "todo"].map((k) => (
                  <button
                    key={k}
                    onClick={() =>
                      E({
                        ...r,
                        id: undefined,
                        kind: k,
                        status: "Planned",
                        sourceIdea: r.id,
                      })
                    }
                  >
                    Create {k === "project" ? "campaign" : k}
                  </button>
                ))}
              <button
                onClick={() => {
                  if (confirm("Archive this local record?"))
                    saveRecord({ ...r, archived: true });
                }}
              >
                Archive
              </button>
            </div>
          </article>
        ))}
      </div>
      {!rows.length && (
        <div className="card empty">
          No matching records. Create one to get started.
        </div>
      )}
      {edit && <RecordEditor record={edit} onClose={() => E(null)} />}
      {picked && (
        <ProjectDetails
          record={s.records.find((r: any) => r.id === picked.id)}
          onClose={() => P(null)}
          onReview={onReview}
        />
      )}
    </>
  );
}
export function LocationSelect({ value, onChange }: any) {
  return (
    <select
      aria-label="Location filter"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All locations</option>
      {locations.map(([n]) => (
        <option key={n}>{n}</option>
      ))}
    </select>
  );
}
function ProjectDetails({ record: r, onClose, onReview }: any) {
  const s = useWorkspace(),
    [text, T] = useState("");
  return (
    <div className="overlay">
      <section className="modal wide" role="dialog" aria-modal="true">
        <div className="modalhead">
          <div>
            <small>
              {r.kind} / {r.dealership || "Group-wide"}
            </small>
            <h2>{r.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <p className="prewrap">{r.notes}</p>
        <p>{r.script}</p>
        {r.kind === "video" && (
          <button
            className="primary"
            onClick={() => {
              onReview(r.id);
              onClose();
            }}
          >
            Open video review
          </button>
        )}
        <h3>Linked deliverables & assets</h3>
        {s.records
          .filter(
            (x: any) =>
              (x.project === r.id ||
                x.associations?.some((a: any) => a.id === r.id)) &&
              !x.archived,
          )
          .map((x: any) => (
            <p key={x.id}>
              {x.kind} · {x.title} · {x.status}
            </p>
          ))}
        <h3>Production checklist</h3>
        {(r.tasks || []).map((t: any, i: number) => (
          <label
            className="ops-taskline"
            data-select-kind="task"
            data-select-parent={r.id}
            data-select-id={String(i)}
            key={i}
            hidden={t.archived}
          >
            <input
              type="checkbox"
              checked={t.status === "Complete"}
              onChange={(e) =>
                saveRecord({
                  ...r,
                  tasks: r.tasks.map((x: any, j: number) =>
                    j === i
                      ? {
                          ...x,
                          status: e.target.checked ? "Complete" : "To Do",
                        }
                      : x,
                  ),
                })
              }
            />
            {t.title}{" "}
            <small>
              {t.assignee} · {t.due}
            </small>
          </label>
        ))}
        <form
          className="ops-toolbar"
          onSubmit={(e) => {
            e.preventDefault();
            saveRecord({
              ...r,
              tasks: [
                ...(r.tasks || []),
                { title: text, status: "To Do", assignee: "Trav" },
              ],
            });
            T("");
          }}
        >
          <input
            required
            placeholder="Add checklist item"
            value={text}
            onChange={(e) => T(e.target.value)}
          />
          <button>Add task</button>
        </form>
        <Comments record={r} />
        <details>
          <summary>Activity history</summary>
          {r.history?.map((h: any, i: number) => (
            <p key={i}>
              {h.by} · {h.action} · {h.status} ·{" "}
              {new Date(h.at).toLocaleString()}
            </p>
          ))}
        </details>
        <div className="ops-actions">
          <button onClick={() => exportJSON(r, r.title + ".json")}>
            Export record
          </button>
          <button
            className="danger"
            onClick={() => {
              if (
                confirm(
                  "Archive this record? Linked originals remain available.",
                )
              ) {
                saveRecord({ ...r, archived: true });
                onClose();
              }
            }}
          >
            Archive record
          </button>
        </div>
      </section>
    </div>
  );
}
export function Comments({ record: r }: any) {
  const [text, T] = useState("");
  return (
    <section>
      <h3>Team notes & handoffs</h3>
      {(r.comments || []).map((c: any, i: number) => (
        <div
          className="comment"
          hidden={c.archived}
          data-select-kind="comment"
          data-select-parent={r.id}
          data-select-id={String(i)}
          key={i}
        >
          <b>{c.by}</b>
          <small>{c.at}</small>
          <p>{c.text}</p>
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveRecord({
            ...r,
            comments: [
              ...(r.comments || []),
              { text, by: user().name, at: new Date().toISOString() },
            ],
          });
          T("");
        }}
      >
        <textarea
          required
          placeholder="Feedback, @mentions, or next steps…"
          value={text}
          onChange={(e) => T(e.target.value)}
        />
        <button disabled={!text.trim()}>Save note</button>
      </form>
    </section>
  );
}
