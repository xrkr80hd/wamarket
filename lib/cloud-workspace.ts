import { defaultTheme } from "./theme-presets";
import { getState, replaceCloudState, user, people } from "./preview-store";
let activeId = "",
  baseline = new Map<string, string>(),
  versions = new Map<string, number>(),
  running = false,
  stopped = true,
  pending = false,
  timer: any,
  personalBaseline = "";
export async function cloudRequest(route: string, body?: any) {
  const r = await fetch("/api/cloud?route=" + route, {
    method: body ? "POST" : "GET",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", "X-Wam-User": activeId },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e: any = Error(d.error || "Unable to sync workspace");
    e.status = r.status;
    e.data = d;
    throw e;
  }
  return d;
}
const allRecords = (s: any) => [
  ...s.conversations
    .filter((c: any) => c.id !== "team")
    .map((c: any) => ({
      ...c,
      kind: "__conversation",
      privateMembers: c.members,
    })),
  ...s.records,
  ...s.annotations.map((a: any) => ({
    ...a,
    kind: "__annotation",
    title: a.text || "Video feedback",
  })),
  ...s.messages.map((m: any) => ({
    ...m,
    kind: "__message",
    title: m.text || "Media message",
  })),
];
const personal = (s: any) => ({
  preferences: s.preferences[activeId] || {},
  entries: s.personal[activeId] || [],
  read: s.read,
});
function status(text: string) {
  window.dispatchEvent(new CustomEvent("wam-cloud-status", { detail: text }));
}
export function stopCloudWorkspace() {
  if (typeof navigator !== "undefined")
    navigator.serviceWorker?.controller?.postMessage({
      type: "WAM_ACCOUNT",
      userId: "",
    });
  stopped = true;
  clearInterval(timer);
  window.removeEventListener("wam-change", changed);
  activeId = "";
  baseline.clear();
  versions.clear();
}
function changed() {
  if (!stopped) {
    pending = true;
    status("Saving…");
    setTimeout(() => sync().catch((e) => status(e.message)), 250);
  }
}
async function sync() {
  if (running || stopped) return;
  running = true;
  const identity = activeId;
  const conflicts: string[] = [];
  try {
    do {
      pending = false;
      const s = getState();
      for (const r of allRecords(s)) {
        if (stopped || identity !== activeId) return;
        if (baseline.get(r.id) !== JSON.stringify(r)) {
          // One bad record must never block the rest of the queue.
          try {
            const d = await cloudRequest("record", {
              record: r,
              version: versions.get(r.id),
            });
            versions.set(r.id, d.record.version);
          } catch (e: any) {
            // 409: a teammate saved first. Keep the shared copy (it is
            // reloaded below) instead of retrying the stale edit forever.
            if (e.status === 409 && e.data?.record) {
              versions.set(r.id, e.data.record.version);
              conflicts.push(r.title || "an item");
            } else if (![400, 403, 413, 422].includes(e.status)) throw e;
            else conflicts.push(r.title || "an item");
          }
          baseline.set(r.id, JSON.stringify(r));
        }
      }
      if (stopped || identity !== activeId) return;
      const p = JSON.stringify(personal(getState()));
      if (p !== personalBaseline) {
        await cloudRequest("personal", { data: JSON.parse(p) });
        personalBaseline = p;
      }
    } while (pending && !stopped);
    const d = await cloudRequest("state");
    if (pending) return;
    const state = getState();
    const shared = d.records.map((r: any) => r.data);
    people.splice(0, people.length, ...d.members);
    versions = new Map(d.records.map((r: any) => [r.id, r.version]));
    replaceCloudState({
      records: shared.filter((r: any) => !r.kind.startsWith("__")),
      messages: shared
        .filter((r: any) => r.kind === "__message")
        .map(({ kind, title, ...m }: any) => m),
      conversations: [
        {
          id: "team",
          title: "COLLAB chat",
          type: "Group",
          members: d.members.map((p: any) => p.id),
        },
        ...shared
          .filter((r: any) => r.kind === "__conversation")
          .map(({ kind, ...c }: any) => c),
      ],
      annotations: shared
        .filter((r: any) => r.kind === "__annotation")
        .map(({ kind, title, ...r }: any) => r),
      preferences: {
        ...state.preferences,
        [activeId]: d.personal.preferences || {},
      },
      personal: { ...state.personal, [activeId]: d.personal.entries || [] },
      read: d.personal.read || {},
    });
    baseline = new Map(
      allRecords(getState()).map((r) => [r.id, JSON.stringify(r)]),
    );
    personalBaseline = JSON.stringify(personal(getState()));
    status(
      conflicts.length
        ? "Updated from a teammate's newer copy: " + conflicts.slice(0, 2).join(", ")
        : "Saved",
    );
  } finally {
    running = false;
  }
}
export async function startCloudWorkspace(me: any) {
  stopCloudWorkspace();
  activeId = me.id;
  const d = await cloudRequest("state");
  const s = getState();
  const rows = d.records.map((r: any) => r.data);
  people.splice(0, people.length, ...d.members);
  replaceCloudState({
    records: rows.filter((r: any) => !r.kind.startsWith("__")),
    messages: rows
      .filter((r: any) => r.kind === "__message")
      .map(({ kind, title, ...m }: any) => m),
    conversations: [
      {
        id: "team",
        title: "COLLAB chat",
        type: "Group",
        members: d.members.map((p: any) => p.id),
      },
      ...rows
        .filter((r: any) => r.kind === "__conversation")
        .map(({ kind, ...c }: any) => c),
    ],
    annotations: rows
      .filter((r: any) => r.kind === "__annotation")
      .map(({ kind, title, ...r }: any) => r),
    preferences: {
      [me.id]:
        d.personal.preferences ||
        defaultTheme(
          me.role === "owner"
            ? "mckenzie"
            : me.role === "coordinator"
              ? "travis"
              : "",
        ),
    },
    personal: { [me.id]: d.personal.entries || [] },
    read: d.personal.read || {},
  });
  versions = new Map(d.records.map((r: any) => [r.id, r.version]));
  baseline = new Map(
    allRecords(getState()).map((r) => [r.id, JSON.stringify(r)]),
  );
  personalBaseline = JSON.stringify(personal(getState()));
  if (!d.personal.preferences) personalBaseline = "";
  stopped = false;
  window.addEventListener("wam-change", changed);
  cloudRequest("presence", {
    online: document.visibilityState === "visible",
  }).catch(() => {});
  timer = setInterval(() => {
    cloudRequest("presence", {
      online: document.visibilityState === "visible",
    }).catch(() => {});
    return sync().catch((e) => status(e.message));
  }, 4000);
  status("Saved");
}
export async function uploadCloudFile(file: File, meta: any = {}) {
  const signed = await cloudRequest("media-upload", {
    name: file.name,
    type: file.type,
    size: file.size,
    conversationId: meta.privateConversation,
  });
  const form = new FormData();
  form.append("cacheControl", "3600");
  form.append("", file);
  const r = await fetch(signed.uploadURL, {
    method: "PUT",
    body: signed.provider === "gdrive" ? file : form,
    ...(signed.provider === "gdrive"
      ? { headers: { "Content-Type": file.type } }
      : {}),
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw Error(
      e.message ||
        e.error ||
        "Media upload failed. Check the file size allowed by your Supabase plan.",
    );
  }
  const uploaded = signed.provider === "gdrive" ? await r.json() : null;
  return {
    id: signed.id,
    kind: "asset",
    title: file.name,
    originalName: file.name,
    type: file.type,
    size: file.size,
    status: "Draft",
    ...meta,
    privateMembers: signed.privateMembers,
    storage:
      signed.provider === "gdrive"
        ? { provider: "gdrive", fileId: uploaded.id, folderId: signed.folderId }
        : { bucket: signed.bucket, path: signed.path },
    uploadedById: user().id,
  };
}

export async function flushCloudWorkspace() {
  const started = Date.now();
  while (running) {
    if (Date.now() - started > 30000)
      throw Error("Saving is taking longer than expected. Please retry.");
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  await sync();
}
