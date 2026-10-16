import { user } from "../lib/preview-store";
import { useState } from "react";
import { useWorkspace } from "./operations";
import { bulkItems, canEdit } from "../lib/item-actions";
export default function ArchiveRoom() {
  const s = useWorkspace(),
    [q, Q] = useState("");
  const rows: any[] = [];
  for (const r of s.records) {
    if (r.archived) rows.push({ ref: { kind: "record", id: r.id }, item: r });
    for (const [list, kind] of [
      ["shots", "shot"],
      ["tasks", "task"],
      ["comments", "comment"],
    ])
      for (const [i, x] of (r[list] || []).entries())
        if (x.archived)
          rows.push({
            ref: { kind, id: kind === "shot" ? x.id : String(i), parent: r.id },
            item: x,
          });
  }
  for (const [list, kind] of [
    ["messages", "message"],
    ["annotations", "annotation"],
  ])
    for (const x of s[list])
      if (x.archived) rows.push({ ref: { kind, id: x.id }, item: x });
  for (const x of s.personal[user().id] || [])
    if (x.archived)
      rows.push({
        ref: { kind: "personal", id: x.id, parent: user().id },
        item: x,
      });
  for (const a of s.annotations)
    for (const [i, c] of a.comments.entries())
      if (c.archived)
        rows.push({
          ref: { kind: "annotation-comment", parent: a.id, id: String(i) },
          item: c,
        });
  const visible = rows
    .filter((r) => {
      try {
        canEdit(s, r.ref, r.item);
        return true;
      } catch {
        return false;
      }
    })
    .filter((r) =>
      (r.item.title || r.item.text || r.item.subject || "")
        .toLowerCase()
        .includes(q.toLowerCase()),
    );
  return (
    <>
      <div className="archive-toolbar">
        <span>{visible.length} archived items · originals preserved</span>
        <input
          aria-label="Search archive"
          placeholder="Search archived items…"
          value={q}
          onChange={(e) => Q(e.target.value)}
        />
      </div>
      {visible.map(({ ref, item }) => (
        <article
          className="archive-row"
          data-select-kind={ref.kind}
          data-select-parent={ref.parent}
          data-select-id={ref.id}
          key={ref.kind + "-" + ref.parent + "-" + ref.id}
        >
          <div>
            <h3>{item.title || item.text || item.subject}</h3>
            <small>{ref.kind}</small>
          </div>
          <button onClick={() => bulkItems([ref], "restore")}>Restore</button>
        </article>
      ))}
      {!visible.length && (
        <div className="archive-empty">No archived items match.</div>
      )}
    </>
  );
}
