import { useState } from "react";
import { useWorkspace } from "./operations";
import { saveRecord, locations } from "../lib/preview-store";
export default function AssetAssignment({ asset, onClose }: any) {
  const s = useWorkspace(),
    [links, L] = useState<any[]>(asset.associations || []),
    [q, Q] = useState(""),
    [folder, F] = useState(asset.folder || ""),
    [error, E] = useState("");
  const targets = [
    ...s.records
      .filter(
        (r: any) =>
          [
            "project",
            "video",
            "event",
            "todo",
            "folder",
            "dealership",
          ].includes(r.kind) &&
          !r.archived &&
          r.id !== asset.id,
      )
      .map((r: any) => ({ id: r.id, label: r.title, kind: r.kind })),
    ...s.records
      .filter((r: any) => r.kind === "video")
      .flatMap((r: any) =>
        (r.shots || []).map((shot: any, i: number) => ({
          id: r.id + ":" + shot.id,
          label: r.title + " / Shot " + (i + 1) + " " + shot.subject,
          kind: "shot",
        })),
      ),
  ];
  return (
    <div className="overlay">
      <form
        className="modal wide"
        role="dialog"
        aria-modal="true"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            saveRecord({ ...asset, folder, associations: links });
            onClose();
          } catch (e: any) {
            E(e.message);
          }
        }}
      >
        <h2>Assign / organize {asset.title}</h2>
        <p>
          One original, any number of relationships. Removing a check never
          deletes the file.
        </p>
        <label>
          Physical library folder
          <select value={folder} onChange={(e) => F(e.target.value)}>
            <option value="">Unfiled Asset Pool</option>
            {s.records
              .filter((r: any) => r.kind === "folder" && !r.archived)
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
        <input
          aria-label="Search assignment destinations"
          placeholder="Search locations, projects, tasks or shots…"
          value={q}
          onChange={(e) => Q(e.target.value)}
        />
        <div className="assignment-targets">
          {targets
            .filter((t: any) => t.label.toLowerCase().includes(q.toLowerCase()))
            .map((t: any) => (
              <label className="ops-taskline" key={t.id}>
                <input
                  type="checkbox"
                  checked={links.some((l) => l.id === t.id)}
                  onChange={(e) =>
                    L(
                      e.target.checked
                        ? [...links, t]
                        : links.filter((l) => l.id !== t.id),
                    )
                  }
                />
                <span>
                  {t.label}
                  <small className="block">{t.kind}</small>
                </span>
              </label>
            ))}
        </div>
        {error && <p role="alert">{error}</p>}
        <div className="modalactions">
          <button type="button" onClick={() => L([])}>
            Remove all associations
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary">Save assignments</button>
        </div>
      </form>
    </div>
  );
}
