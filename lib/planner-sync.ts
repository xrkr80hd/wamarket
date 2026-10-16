import { getState, mutate } from "./preview-store";
import { accountRequest } from "./local-session";

const queueKey = "wam-planner-outbox";
let applying = false,
  running = false,
  started = false,
  seen = new Map<string, string>();
const isSharedPlan = (r: any) =>
  ["todo", "event", "video", "content", "project"].includes(r.kind);
const fingerprint = (r: any) => JSON.stringify(r);
export let plannerSyncStatus = "Demo · plans shared in this browser";
function status(value: string) {
  plannerSyncStatus = value;
  window.dispatchEvent(new Event("wam-planner-sync"));
}
function queue(): any[] {
  try {
    return JSON.parse(localStorage.getItem(queueKey) || "[]");
  } catch {
    return [];
  }
}
function snapshot() {
  seen = new Map(
    getState()
      .records.filter((r: any) => isSharedPlan(r))
      .map((r: any) => [r.id, fingerprint(r)]),
  );
}
function changed() {
  if (applying) return;
  const records = getState().records.filter((r: any) => isSharedPlan(r));
  if (sessionStorage.getItem("wam-local-auth")) {
    let jobs = queue();
    for (const r of records)
      if (seen.get(r.id) !== fingerprint(r))
        jobs = [
          ...jobs.filter((j) => j.record.id !== r.id),
          {
            account: sessionStorage.getItem("wam-local-auth"),
            record: r,
            revision: r.plannerRevision || 0,
          },
        ];
    localStorage.setItem(queueKey, JSON.stringify(jobs));
  }
  snapshot();
  void syncPlanner();
}
export async function syncPlanner() {
  if (running || !sessionStorage.getItem("wam-local-auth")) return;
  running = true;
  try {
    let jobs = queue();
    for (const job of jobs.filter(
      (j) => j.account === sessionStorage.getItem("wam-local-auth"),
    )) {
      status("Saving shared plans…");
      const response = await accountRequest("day-plans", {
        record: job.record,
        revision: job.revision,
      });
      const latest = queue();
      const match = latest.find((j) => j.record.id === job.record.id);
      if (match && fingerprint(match.record) === fingerprint(job.record))
        localStorage.setItem(
          queueKey,
          JSON.stringify(latest.filter((j) => j !== match)),
        );
      else if (match) {
        match.revision = response.revision;
        localStorage.setItem(queueKey, JSON.stringify(latest));
      }
    }
    const remote = await accountRequest("day-plans"),
      pending = new Set(queue().map((j) => j.record.id));
    applying = true;
    const local = getState();
    if (
      remote.records.some(
        (r: any) =>
          !pending.has(r.id) &&
          fingerprint(local.records.find((x: any) => x.id === r.id)) !==
            fingerprint(r),
      )
    )
      mutate((s) => {
        for (const r of remote.records) {
          if (pending.has(r.id)) continue;
          const i = s.records.findIndex((x: any) => x.id === r.id);
          if (i < 0) s.records.push(r);
          else s.records[i] = r;
        }
      });
    snapshot();
    status(
      pending.size
        ? "Changes queued · retrying"
        : "Shared plans saved on this computer",
    );
  } catch (e: any) {
    status("Plan sync needs attention: " + e.message);
  } finally {
    applying = false;
    running = false;
  }
}
export function startPlannerSync() {
  if (started) return;
  started = true;
  snapshot();
  window.addEventListener("wam-change", changed);
  window.addEventListener("wam-account-session", () => {
    snapshot();
    void syncPlanner();
  });
  window.addEventListener("online", () => void syncPlanner());
  setInterval(() => void syncPlanner(), 5000);
  void syncPlanner();
}
export async function useSharedPlannerVersions() {
  const remote = await accountRequest("day-plans"),
    jobs = queue();
  const conflicts = jobs.filter(
    (j) =>
      j.account === sessionStorage.getItem("wam-local-auth") &&
      remote.records.some(
        (r: any) => r.id === j.record.id && r.plannerRevision !== j.revision,
      ),
  );
  if (conflicts.length) {
    if (
      !confirm(
        "Use the latest shared version of " +
          conflicts.length +
          " changed plan(s)? Your unsent drafts will be downloaded as a backup.",
      )
    )
      return;
    const a = document.createElement("a"),
      url = URL.createObjectURL(
        new Blob([JSON.stringify(conflicts, null, 2)], {
          type: "application/json",
        }),
      );
    a.href = url;
    a.download = "walker-unsent-plan-drafts.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    localStorage.setItem(
      queueKey,
      JSON.stringify(jobs.filter((j) => !conflicts.includes(j))),
    );
  }
  await syncPlanner();
}
