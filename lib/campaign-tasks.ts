export const productionSteps = [
  {
    title: "Confirm campaign goals, dates, dealerships and offers",
    assignee: "McKenzie",
    offset: -21,
  },
  {
    title: "Collect approved logos, photos and campaign references",
    assignee: "Trav",
    offset: -18,
  },
  { title: "Draft captions, copy and scripts", assignee: "Trav", offset: -14 },
  {
    title: "Produce graphics, video and required media",
    assignee: "Trav",
    offset: -10,
  },
  { title: "Submit creative for review", assignee: "Trav", offset: -7 },
  {
    title: "Review creative and confirm disclosures",
    assignee: "McKenzie",
    offset: -5,
  },
  { title: "Approve final materials", assignee: "McKenzie", offset: -3 },
  {
    title: "Prepare publication schedule and dealership handoff",
    assignee: "McKenzie",
    offset: -2,
  },
  {
    title: "Publish or distribute approved materials",
    assignee: "Trav",
    offset: 0,
  },
  {
    title: "Record results and archive campaign assets",
    assignee: "Trav",
    offset: 2,
  },
];
export function productionChecklist(date = "", endDate = "") {
  return productionSteps.map((step) => {
    let due = "";
    const base = step.offset === 2 ? endDate || date : date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(base)) {
      const d = new Date(base + "T12:00:00Z");
      if (!Number.isNaN(d.getTime())) {
        d.setUTCDate(d.getUTCDate() + step.offset);
        due = d.toISOString().slice(0, 10);
      }
    }
    return { title: step.title, assignee: step.assignee, status: "To Do", due };
  });
}
export function withCampaignTasks(data: any, existing: any) {
  if (
    existing ||
    !["project", "event"].includes(data.kind) ||
    data.tasks?.length ||
    data.source ||
    ["Completed", "Needs Verification", "Archived"].includes(data.status)
  )
    return data;
  return { ...data, tasks: productionChecklist(data.date, data.endDate) };
}
export function campaignRecords(records: any[]) {
  return records.filter(
    (r) =>
      !r.archived &&
      ((r.kind === "project" &&
        !["Completed", "Published", "Archived"].includes(r.status)) ||
        (r.kind === "event" &&
          (r.status === "In Progress" ||
            ((!r.source || r.sourceEvent) && r.status === "Proposed")))),
  );
}
export function effectiveUrgency(task: any, today: string) {
  if (["Urgent", "High", "Normal", "Low"].includes(task.urgency))
    return task.urgency;
  const dates = [
    task.due,
    task.eventDate,
    ...(!task.due && !task.eventDate ? [task.record?.date] : []),
  ].filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d || ""));
  if (!dates.length) return "Normal";
  const deadline = dates.sort()[0];
  const days =
    (Date.parse(deadline + "T12:00:00Z") - Date.parse(today + "T12:00:00Z")) /
    86400000;
  return days <= 1
    ? "Urgent"
    : days <= 3
      ? "High"
      : days <= 7
        ? "Normal"
        : "Low";
}
export function sortedTodos(tasks: any[], today: string) {
  const rank: { [key: string]: number } = {
    Urgent: 0,
    High: 1,
    Normal: 2,
    Low: 3,
  };
  return [...tasks].sort(
    (a, b) =>
      rank[effectiveUrgency(a, today)] - rank[effectiveUrgency(b, today)] ||
      (a.due || a.eventDate || a.record?.date || "9999").localeCompare(
        b.due || b.eventDate || b.record?.date || "9999",
      ),
  );
}
