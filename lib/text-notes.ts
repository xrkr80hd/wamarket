import { apiFetch, apiJSON } from "./api-response";
import { getState } from "./preview-store";

export function folderPath(folder: any, records: any[]) {
  const parts: string[] = [];
  const seen = new Set<string>();
  let current = folder;
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    parts.unshift(current.title);
    current = records.find(
      (r: any) => r.kind === "folder" && r.id === current.folder,
    );
  }
  if (folder.dealership && !parts.includes(folder.dealership))
    parts.unshift(folder.dealership);
  return parts.join(" / ");
}

export async function saveTextNote(draft: any) {
  const records = getState().records;
  const folder = records.find(
    (r: any) => r.id === draft.folder && r.kind === "folder" && !r.archived,
  );
  const latest = records.find((r: any) => r.id === draft.id);
  if (!folder) throw Error("Choose an available folder or organization.");
  if (latest && (latest.kind !== "note" || latest.archived))
    throw Error("This note is no longer available.");
  if (!draft.title?.trim()) throw Error("Enter a note title.");
  const record = {
    ...(latest || draft),
    id: draft.id,
    kind: "note",
    title: draft.title.trim(),
    notes: draft.notes || "",
    folder: folder.id,
    dealership: folder.dealership || "",
    status: latest?.status || "Active",
  };
  await apiJSON(
    await apiFetch("/api/workspace", {
      method: "POST",
      body: JSON.stringify({ record }),
    }),
  );
  return record;
}
