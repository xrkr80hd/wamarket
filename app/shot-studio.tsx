import { useState } from "react";
import { useWorkspace, FilePreview } from "./operations";
import { saveRecord, addAsset, exportJSON } from "../lib/preview-store";
export default function ShotStudio() {
  const s = useWorkspace(),
    videos = s.records.filter((r: any) => r.kind === "video" && !r.archived),
    [id, ID] = useState(videos[0]?.id || ""),
    [edit, E] = useState<any>(null),
    [query, Q] = useState(""),
    [error, Error] = useState("");
  const r = s.records.find((r: any) => r.id === id);
  function save(shots: any[]) {
    saveRecord({ ...r, shots });
  }
  const empty = {
    id: crypto.randomUUID(),
    framing: "Medium",
    movement: "Static",
    subject: "",
    location: "",
    notes: "",
    people: "",
    vehicles: "",
    equipment: "",
    status: "Planned",
    footage: "",
    reference: "",
  };
  return (
    <>
      <div className="ops-toolbar">
        <input
          aria-label="Search shots"
          placeholder="Search shots…"
          value={query}
          onChange={(e) => Q(e.target.value)}
        />
        <select
          aria-label="Shot list project"
          value={id}
          onChange={(e) => ID(e.target.value)}
        >
          {videos.map((v: any) => (
            <option key={v.id} value={v.id}>
              {v.title}
            </option>
          ))}
        </select>
        <button className="primary" disabled={!r} onClick={() => E(empty)}>
          ＋ Add shot
        </button>
        <button
          disabled={!r}
          onClick={() =>
            exportJSON(
              { project: r.title, shots: r.shots || [] },
              "shot-list.json",
            )
          }
        >
          Export JSON
        </button>
        <button disabled={!r} onClick={() => window.print()}>
          Print / PDF
        </button>
      </div>
      {!r ? (
        <p>Create a video project first.</p>
      ) : (
        <>
          <h2>{r.title} / shot list</h2>
          <p>
            {r.date || "Shoot date to be confirmed"} ·{" "}
            {r.dealership || "Location unassigned"}
          </p>
          {(r.shots || []).map((shot: any, i: number) => (
            <article
              className="card panel shot-card"
              hidden={
                shot.archived ||
                !(shot.subject + " " + shot.notes + " " + shot.location)
                  .toLowerCase()
                  .includes(query.toLowerCase())
              }
              data-select-kind="shot"
              data-select-parent={r.id}
              data-select-id={shot.id}
              key={shot.id}
            >
              <div className="sectionhead">
                <span className="shot-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{shot.subject || "Untitled shot"}</h3>
                <span className="badge">{shot.status}</span>
              </div>
              {shot.reference && (
                <FilePreview id={shot.reference} type="image/" />
              )}
              <p>
                {shot.framing} · {shot.movement} ·{" "}
                {shot.location || "Location not set"}
              </p>
              <p>{shot.notes}</p>
              <small>
                People: {shot.people || "—"} · Vehicles: {shot.vehicles || "—"}{" "}
                · Equipment: {shot.equipment || "—"}
              </small>
              {shot.footage && (
                <p>
                  <a href={shot.footage} target="_blank" rel="noreferrer">
                    Open footage ↗
                  </a>
                </p>
              )}
              <div className="ops-actions">
                <button onClick={() => E(shot)}>Edit</button>
                <button
                  onClick={() =>
                    save([
                      ...(r.shots || []),
                      { ...shot, id: crypto.randomUUID(), status: "Planned" },
                    ])
                  }
                >
                  Duplicate
                </button>
                <button
                  disabled={i === 0}
                  aria-label={"Move shot " + (i + 1) + " up"}
                  onClick={() => {
                    const shots = [...r.shots];
                    [shots[i - 1], shots[i]] = [shots[i], shots[i - 1]];
                    save(shots);
                  }}
                >
                  ↑
                </button>
                <button
                  disabled={i === r.shots.length - 1}
                  aria-label={"Move shot " + (i + 1) + " down"}
                  onClick={() => {
                    const shots = [...r.shots];
                    [shots[i + 1], shots[i]] = [shots[i], shots[i + 1]];
                    save(shots);
                  }}
                >
                  ↓
                </button>
                <button
                  onClick={() => {
                    if (confirm("Archive this shot?"))
                      save(
                        r.shots.map((x: any) =>
                          x.id === shot.id ? { ...x, archived: true } : x,
                        ),
                      );
                  }}
                >
                  Archive
                </button>
              </div>
            </article>
          ))}
          {!r.shots?.length && (
            <div className="card empty">
              Build your first shot. Add framing, movement, talent, equipment
              and visual references.
            </div>
          )}
        </>
      )}
      {edit && (
        <div className="overlay">
          <form
            className="modal wide"
            role="dialog"
            aria-modal="true"
            onSubmit={(e) => {
              e.preventDefault();
              const exists = r.shots?.some((x: any) => x.id === edit.id);
              save(
                exists
                  ? r.shots.map((x: any) => (x.id === edit.id ? edit : x))
                  : [...(r.shots || []), edit],
              );
              E(null);
            }}
          >
            <h2>Shot details</h2>
            <div className="formgrid">
              {[
                "subject",
                "framing",
                "movement",
                "location",
                "people",
                "vehicles",
                "equipment",
              ].map((k) => (
                <label key={k}>
                  {k[0].toUpperCase() + k.slice(1)}
                  <input
                    required={k === "subject"}
                    value={edit[k] || ""}
                    onChange={(e) => E({ ...edit, [k]: e.target.value })}
                  />
                </label>
              ))}
              <label>
                Status
                <select
                  value={edit.status}
                  onChange={(e) => E({ ...edit, status: e.target.value })}
                >
                  {[
                    "Planned",
                    "Filmed",
                    "Editing",
                    "Approved",
                    "Completed",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label>
                Footage URL
                <input
                  type="url"
                  value={edit.footage || ""}
                  onChange={(e) => E({ ...edit, footage: e.target.value })}
                />
              </label>
              <label>
                Visual reference
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    try {
                      const f = e.target.files?.[0];
                      if (f) E({ ...edit, reference: await addAsset(f) });
                    } catch (e: any) {
                      Error(e.message);
                    }
                  }}
                />
              </label>
              <label className="full">
                Notes
                <textarea
                  value={edit.notes || ""}
                  onChange={(e) => E({ ...edit, notes: e.target.value })}
                />
              </label>
            </div>
            {error && <p role="alert">{error}</p>}
            <div className="modalactions">
              <button type="button" onClick={() => E(null)}>
                Cancel
              </button>
              <button className="primary">Save shot</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
