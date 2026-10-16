import {
  uploadCloudFile,
  cloudRequest,
  flushCloudWorkspace,
} from "./cloud-workspace";
import seed from "../app/seed.json";
import { defaultTheme, themePresets } from "./theme-presets";
export const people: any[] = [
  {
    id: "mckenzie",
    name: "McKenzie",
    role: "owner",
    email: "mckenzie@preview.invalid",
  },
  {
    id: "travis",
    name: "Travis",
    role: "coordinator",
    email: "travis@preview.invalid",
  },
  {
    id: "lawrence",
    name: "Lawrence",
    role: "executive",
    email: "lawrence@preview.invalid",
  },
];
if (typeof localStorage !== "undefined") {
  try {
    for (const p of JSON.parse(
      localStorage.getItem("wam-user-directory") || "[]",
    )) {
      if (p.name === "Lawrence" + " Searcy") p.name = "Lawrence";
      const i = people.findIndex((x) => x.id === p.id);
      if (i >= 0) people[i] = p;
      else people.push(p);
    }
  } catch {}
}
export const locations = [
  ["Walker Mazda", "1616A MacArthur Dr, Alexandria, LA 71301"],
  ["Walker Toyota", "5735 Coliseum Blvd, Alexandria, LA 71303"],
  ["Walker Mercedes-Benz", "6655 Coliseum Blvd, Alexandria, LA 71303"],
  ["Walker Kia", "6699 Coliseum Blvd, Alexandria, LA 71303"],
  ["Walker Honda", "6677 Coliseum Blvd, Alexandria, LA 71303"],
  ["Walker CDJR", "5757 Coliseum Blvd, Alexandria, LA 71303"],
  ["Walker BMW", "6655 Coliseum Blvd, Alexandria, LA 71303"],
  ["Walker GMC", "1616 MacArthur Dr, Alexandria, LA 71301"],
  [
    "Walker Automotive Used Cars – Pineville",
    "2250 Hwy 28 East, Pineville, LA 71360",
  ],
  ["Walker Big Lot", "1616 MacArthur Dr, Alexandria, LA 71301"],
];
export const workflow = [
  "Idea",
  "Planned",
  "In Production",
  "Editing",
  "Review",
  "Approved",
  "Scheduled",
  "Published",
];
const key = "wam-source-preview-v2";
const stateKey = () =>
  sessionStorage.getItem("wam-cloud-auth")
    ? key + ":" + sessionStorage.getItem("wam-cloud-auth")
    : key;
export function replaceCloudState(patch: any) {
  const state = getState();
  Object.assign(state, patch);
  localStorage.setItem(stateKey(), JSON.stringify(state));
  window.dispatchEvent(new Event("wam-cloud-hydrated"));
}
const base = () => ({
  records: [
    ...seed.map((r) => ({ ...r, source: "Uploaded history · unverified" })),
    ...locations.flatMap(([title, address], i) => [
      {
        id: "location-" + i,
        kind: "dealership",
        title,
        address,
        status: "Active",
        source: "https://www.walkerautomotive.com/dealers/",
      },
      {
        id: "locfolder-" + i,
        kind: "folder",
        title,
        dealership: title,
        locationRoot: true,
        status: "Active",
      },
    ]),
    { id: "history-imported", kind: "system", title: "Imported locally" },
    {
      id: "pink-demo",
      kind: "project",
      title: "PINK OUT THE LOT!",
      notes:
        "Pink Tags. Big Deals.\nDemo October campaign — offers and dates require confirmation.",
      dealership: "Walker Automotive Group",
      dealerships: ["Walker CDJR", "Walker Toyota"],
      owner: "McKenzie",
      status: "In Production",
      date: "2026-10-19",
      endDate: "2026-10-31",
      tasks: [
        {
          title: "Capture inventory B-roll",
          assignee: "Trav",
          status: "To Do",
          due: "2026-10-20",
          urgency: "High",
        },
      ],
      comments: [],
      history: [],
      demo: true,
    },
    {
      id: "demo-video",
      kind: "video",
      title: "PINK OUT THE LOT! — CTV cut",
      project: "pink-demo",
      dealership: "Walker CDJR",
      status: "Editing",
      owner: "Travis",
      date: "2026-10-20",
      notes: "Pink Tags. Big Deals.",
      script:
        "Open on pink tags. Cut to inventory and team. End with approved offer and disclosures.",
      shots: [],
      versions: [],
      demo: true,
    },
    {
      id: "idea-demo",
      kind: "idea",
      title: "One question, one expert",
      notes:
        "Hook: What should I check before a road trip?\nScript: One service expert gives three useful checks.\nAssets: Service bay footage.\nNext: Confirm presenter and film a 25-second tip.",
      status: "Idea",
      demo: true,
    },
  ],
  preferences: {},
  messages: [],
  conversations: [
    {
      id: "team",
      title: "COLLAB chat",
      members: ["mckenzie", "travis", "lawrence"],
      type: "Group",
    },
    {
      id: "private-mt",
      title: "McKenzie + Travis",
      members: ["mckenzie", "travis"],
      type: "Direct",
    },
  ],
  personal: {},
  read: {},
  quotes: [],
  settings: {
    categories: ["Seasonal", "Service", "Community", "CTV"],
    assetTypes: ["Video", "Photo", "Logo", "Graphic", "Document"],
    statuses: workflow,
    notifications: true,
  },
  activity: [],
  annotations: [],
});
export function getState(): any {
  const raw = localStorage.getItem(stateKey());
  if (raw) {
    const s = JSON.parse(raw, (k, v) =>
      [
        "name",
        "sender_name",
        "owner",
        "assignee",
        "assigned",
        "author",
        "by",
        "createdBy",
        "updatedBy",
      ].includes(k) && v === "Lawrence" + " Searcy"
        ? "Lawrence"
        : v,
    );
    if (!s.themeDefaultsVersion) {
      s.themePresets ||= {};
      for (const id of ["travis", "mckenzie", "lawrence"]) {
        const old = s.preferences[id];
        if (old) s.themePresets["Previous appearance — " + id] = old;
        const base =
          old?.theme === "dark"
            ? themePresets[
                id === "travis" ? "Travis After Hours" : "Walker After Hours"
              ]
            : defaultTheme(id);
        s.preferences[id] = {
          ...old,
          ...base,
          logo: old?.logo || "",
          heroImages: old?.heroImages || [],
          avatar: old?.avatar || "",
          presetName:
            id === "travis"
              ? "Travis Default"
              : id === "mckenzie"
                ? "McKenzie Default"
                : "Walker Default",
        };
      }
      s.themeDefaultsVersion = 1;
      localStorage.setItem(stateKey(), JSON.stringify(s));
    }
    if (!s.travisOrangeRevision) {
      const p = s.preferences.travis;
      if (p && (!p.presetName || p.presetName.startsWith("Travis"))) {
        p.accent = p.theme === "dark" ? "#b94c08" : "#a74400";
        p.appearance = {
          ...p.appearance,
          primaryBg: p.accent,
          primaryText: "#ffffff",
          highlight: p.theme === "dark" ? "#f5ab68" : p.accent,
          linkText: p.theme === "dark" ? "#f5ab68" : "#923b00",
        };
      }
      s.travisOrangeRevision = 1;
      localStorage.setItem(stateKey(), JSON.stringify(s));
    }
    return s;
  }
  const s = base();
  localStorage.setItem(stateKey(), JSON.stringify(s));
  return s;
}
export function user() {
  if (!sessionStorage.getItem("wam-travis-default-v1")) {
    sessionStorage.setItem("wam-person", "travis");
    sessionStorage.setItem("wam-travis-default-v1", "applied");
  }
  return (
    people.find((p) => p.id === sessionStorage.getItem("wam-person")) ||
    people[1]
  );
}
export function setUser(id: string) {
  if (!people.some((p) => p.id === id)) throw Error("Unknown preview identity");
  sessionStorage.setItem("wam-travis-default-v1", "applied");
  sessionStorage.setItem("wam-person", id);
  window.dispatchEvent(new Event("wam-change"));
}
export function mutate(fn: (s: any) => void, action = "") {
  const s = getState();
  fn(s);
  if (action)
    s.activity.unshift({
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      by: user().name,
      text: action,
    });
  try {
    localStorage.setItem(stateKey(), JSON.stringify(s));
  } catch {
    throw Error("Browser storage is full. Export a backup before continuing.");
  }
  window.dispatchEvent(new Event("wam-change"));
  return s;
}
export function member() {
  const s = getState(),
    id = user().id;
  return {
    ...user(),
    preferences: JSON.stringify(s.preferences[id] || defaultTheme(id)),
  };
}
export function saveRecord(record: any) {
  if (user().role === "viewer") throw Error("Viewer accounts are read-only");
  if (!record?.title?.trim()) throw Error("Enter a title");
  if (record.endDate && record.date && record.endDate < record.date)
    throw Error("End date must follow start date");
  const id = record.id || crypto.randomUUID();
  mutate((s) => {
    const old = s.records.find((r: any) => r.id === id);
    if (
      (record.status === "Approved" || record.approval === "Approved") &&
      user().role === "coordinator" &&
      old?.status !== "Approved"
    )
      throw Error("McKenzie or Lawrence must approve");
    const r = {
      ...record,
      id,
      createdById: old?.createdById || record.createdById || user().id,
      updated: new Date().toISOString(),
      history: [
        ...(old?.history || []),
        {
          at: new Date().toISOString(),
          by: user().name,
          action: old ? "Updated" : "Created",
          status: record.status,
        },
      ],
    };
    s.records = old
      ? s.records.map((x: any) => (x.id === id ? r : x))
      : [...s.records, r];
  }, "Saved " + record.title);
  return id;
}
export function conversation(id: string, s = getState()) {
  const c = s.conversations.find((c: any) => c.id === id);
  if (!c || !c.members.includes(user().id))
    throw Error("This conversation is private");
  return c;
}
let dbPromise: Promise<IDBDatabase>;
function db() {
  return (dbPromise ||= new Promise((resolve, reject) => {
    const req = indexedDB.open("wam-local-files", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("files");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}
export async function putFile(id: string, file: Blob) {
  const d = await db();
  await new Promise<void>((resolve, reject) => {
    const tx = d.transaction("files", "readwrite");
    tx.objectStore("files").put(file, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
export async function readFile(id: string): Promise<Blob | undefined> {
  const record = getState().records.find((r: any) => r.id === id);
  if (record?.storage) {
    const d = await cloudRequest("media-read", { id });
    return (await fetch(d.url)).blob();
  }
  if (
    record?.privateConversation &&
    ![record.privateConversation, ...(record.sharedConversations || [])].some(
      (id) =>
        getState().conversations.some(
          (c: any) => c.id === id && c.members.includes(user().id),
        ),
    )
  )
    throw Error("This file is private");
  const d = await db();
  return new Promise((resolve, reject) => {
    const r = d.transaction("files").objectStore("files").get(id);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
const urls = new Map<string, string>();
export async function fileURL(id: string) {
  if (!id) return "";
  if (getState().records.find((r: any) => r.id === id)?.storage)
    return (await cloudRequest("media-read", { id })).url;
  const record = getState().records.find((r: any) => r.id === id);
  if (
    record?.privateConversation &&
    ![record.privateConversation, ...(record.sharedConversations || [])].some(
      (id) =>
        getState().conversations.some(
          (c: any) => c.id === id && c.members.includes(user().id),
        ),
    )
  )
    throw Error("This file is private");
  const cacheKey = user().id + ":" + id;
  if (urls.has(cacheKey)) return urls.get(cacheKey)!;
  let b = await readFile(id);
  if (
    !b &&
    sessionStorage.getItem("wam-local-auth") &&
    getState().records.some(
      (r: any) =>
        r.kind === "quickidea" && r.attachments?.some((a: any) => a.id === id),
    )
  ) {
    const response = await fetch(
      "/__local/quick-ideas/media?id=" + encodeURIComponent(id),
    );
    if (response.ok) b = await response.blob();
    else throw Error("Quick Idea media is unavailable");
  }
  if (!b) return "";
  const u = URL.createObjectURL(b);
  urls.set(cacheKey, u);
  return u;
}
export async function addAsset(file: File, meta: any = {}) {
  if (sessionStorage.getItem("wam-cloud-auth")) {
    const record = await uploadCloudFile(file, meta);
    saveRecord(record);
    await flushCloudWorkspace();
    return record.id;
  }
  if (file.size > 500 * 1024 * 1024)
    throw Error("Preview limit: 500 MB per file");
  const id = crypto.randomUUID();
  await putFile(id, file);
  saveRecord({
    id,
    kind: "asset",
    title: file.name,
    originalName: file.name,
    type: file.type || "application/octet-stream",
    size: file.size,
    status: "Draft",
    project: "",
    dealership: "",
    folder: "",
    tags: [],
    ...meta,
  });
  return id;
}
export function exportJSON(data: any, name: string) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
