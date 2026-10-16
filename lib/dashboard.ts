// Shared identity labels used throughout the signed-in workspace.
export const roleLabel = (role: string, isAdmin = false) =>
  isAdmin
    ? "Site Owner · Master Administrator"
    : {
        owner: "Marketing Manager",
        coordinator: "Marketing Media Coordinator",
        executive: "Executive Reviewer",
        qa: "Q/A",
        viewer: "Viewer",
      }[role] || "Team Member";
export function assignedTo(r: any, me: any) {
  const matches = (v: any) =>
    typeof v === "string" &&
    [me.id, me.name, me.email, ...(me.name === "Travis" ? ["Trav"] : [])]
      .filter(Boolean)
      .some((x) => v.trim().toLowerCase() === String(x).trim().toLowerCase());
  const collaborators = Array.isArray(r.collaborators)
    ? r.collaborators
    : String(r.collaborators || "").split(",");
  return (
    [r.ownerId, r.assigneeId, r.owner, r.assignee, r.createdById].some(
      matches,
    ) ||
    collaborators.some(matches) ||
    (r.tasks || []).some(
      (t: any) => matches(t.assigneeId) || matches(t.assignee),
    )
  );
}
export function personalRecords(records: any[], me: any) {
  return records.filter((r) => assignedTo(r, me));
}
