import { getState, user, saveRecord, mutate } from "./preview-store";
export function personName(value: string) {
  const v = (value || "").trim();
  return /^(trav|travis)(\s|$)/i.test(v)
    ? "Travis"
    : /^mckenzie(\s|$)/i.test(v)
      ? "McKenzie"
      : v;
}
export function occursOn(r: any, day: string) {
  if (!r.date) return false;
  if (r.date === day) return true;
  if (r.date > day || (r.endDate && day > r.endDate)) return false;
  const a = new Date(r.date + "T12:00:00Z"),
    b = new Date(day + "T12:00:00Z");
  if (r.recurrence === "Weekly") return a.getUTCDay() === b.getUTCDay();
  if (r.recurrence === "Monthly") return a.getUTCDate() === b.getUTCDate();
  if (r.recurrence === "Annual") return r.date.slice(5) === day.slice(5);
  return false;
}
export function dayPlan(day: string, state = getState()) {
  const items: any[] = [];
  for (const r of state.records.filter((r: any) => !r.archived)) {
    if (
      ["todo", "event", "video", "content"].includes(r.kind) &&
      occursOn({ ...r, date: r.plannedDate || r.date }, day)
    )
      items.push({
        ...r,
        ref: { kind: "record", id: r.id },
        person: personName(r.owner || r.assignee),
        source:
          r.kind === "todo"
            ? "Day plan"
            : r.kind === "video"
              ? "Shoot / production"
              : r.kind === "content"
                ? "Publishing plan"
                : "Calendar",
        complete: ["Complete", "Completed", "Done", "Published"].includes(
          r.status,
        ),
      });
    if (["project", "event", "video"].includes(r.kind))
      for (const [t, i] of (r.tasks || []).map((t: any, i: number) => [t, i]))
        if (!t.archived && !t.annotationId && (t.plannedDate || t.due) === day)
          items.push({
            ...t,
            id: r.id + ":" + i,
            ref: { kind: "task", parent: r.id, id: String(i) },
            person: personName(t.assignee),
            source: r.title,
            complete: t.status === "Complete",
          });
  }
  return items.sort(
    (a, b) =>
      String(a.time || "99:99").localeCompare(String(b.time || "99:99")) ||
      a.title.localeCompare(b.title),
  );
}
export function createDayTask(values: any) {
  if (!["owner", "coordinator"].includes(user().role))
    throw Error("Your role can view day plans only");
  if (!values.title?.trim()) throw Error("Enter a task");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date || ""))
    throw Error("Choose a day");
  return saveRecord({
    kind: "todo",
    title: values.title.trim(),
    date: values.date,
    plannedDate: values.date,
    time: values.time || "",
    owner: values.owner || user().name,
    notes: values.notes || "",
    status: "To Do",
    priority: values.priority || "Normal",
    createdBy: user().name,
    dayPlanner: true,
  });
}
export function completeDayTask(item: any, complete: boolean) {
  if (!["owner", "coordinator"].includes(user().role))
    throw Error("Your role can view day plans only");
  if (item.ref.kind === "record") {
    const r = getState().records.find((r: any) => r.id === item.ref.id);
    saveRecord({ ...r, status: complete ? "Complete" : "To Do" });
  } else {
    const r = getState().records.find((r: any) => r.id === item.ref.parent);
    saveRecord({
      ...r,
      tasks: r.tasks.map((t: any, i: number) =>
        i === +item.ref.id
          ? { ...t, status: complete ? "Complete" : "To Do" }
          : t,
      ),
    });
  }
}
