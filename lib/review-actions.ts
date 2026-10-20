import {
  getState,
  mutate,
  user,
  saveRecord,
  addAsset,
  conversation,
} from "./preview-store";
import { flushCloudWorkspace } from "./cloud-workspace";
export async function addDriveVideoVersion(videoId: string, link: string) {
  if (!sessionStorage.getItem("wam-cloud-auth"))
    throw Error(
      "Sign in to the shared workspace to link a private Drive video.",
    );
  if (!["owner", "executive", "coordinator"].includes(user().role))
    throw Error("Only the production team can add video revisions.");
  await flushCloudWorkspace();
  const response = await fetch("/api/drive?route=review-link", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId, link }),
  });
  const data = await response.json();
  if (!response.ok) throw Error(data.error || "Unable to link Drive video.");
  // Re-read after network work so a revision cannot erase an intervening update.
  const video = getState().records.find(
    (r: any) => r.id === videoId && r.kind === "video",
  );
  if (!video || video.archived) throw Error("Video project not found");
  const version = {
    id: crypto.randomUUID(),
    source: data.source,
    originalName: data.name,
    name: "Version " + ((video.versions || []).length + 1),
    createdBy: user().name,
    createdAt: new Date().toISOString(),
    status: "Video Draft",
    reviews: [],
  };
  saveRecord({
    ...video,
    status: "Editing",
    versions: [...(video.versions || []), version],
  });
  await flushCloudWorkspace();
  return version;
}
export async function addVideoVersion(videoId: string, file: File) {
  const r = getState().records.find(
    (r: any) => r.id === videoId && r.kind === "video",
  );
  if (!r) throw Error("Video project not found");
  if (!file.type.startsWith("video/")) throw Error("Choose a video file");
  const assetId = await addAsset(file);
  const v = {
    id: crypto.randomUUID(),
    assetId,
    name: "Version " + ((r.versions || []).length + 1),
    createdBy: user().name,
    createdAt: new Date().toISOString(),
    status: "Video Draft",
    reviews: [],
  };
  saveRecord({ ...r, status: "Editing", versions: [...(r.versions || []), v] });
  return v;
}
export function addAnnotation(videoId: string, versionId: string, values: any) {
  if (!values.text?.trim()) throw Error("Enter feedback");
  if (
    values.start < 0 ||
    !Number.isFinite(values.start) ||
    (values.end !== null && values.end < values.start)
  )
    throw Error("Invalid time range");
  const a = {
    ...values,
    id: crypto.randomUUID(),
    videoId,
    versionId,
    assigned: "travis",
    author: user().name,
    createdAt: new Date().toISOString(),
    status: "Open",
    comments: [],
    history: [],
  };
  mutate((s) => {
    const r = s.records.find((r: any) => r.id === videoId);
    if (!r?.versions?.some((v: any) => v.id === versionId))
      throw Error("Video version not found");
    s.annotations.push(a);
    r.status = "Revision";
    r.tasks ||= [];
    r.tasks.push({
      title: `${values.type} at ${values.start}s — ${values.text}`,
      annotationId: a.id,
      assignee: "Trav",
      status: "To Do",
      urgency: values.priority,
      due: r.date || "",
    });
  }, "Added timestamped feedback");
  return a;
}
export function setAnnotationStatus(id: string, status: string) {
  if (
    ![
      "Open",
      "In Progress",
      "Ready for Review",
      "Resolved",
      "Reopened",
    ].includes(status)
  )
    throw Error("Invalid status");
  mutate((s) => {
    const a = s.annotations.find((a: any) => a.id === id);
    if (!a) throw Error("Feedback not found");
    a.status = status;
    a.history.push({ status, by: user().name, at: new Date().toISOString() });
    const r = s.records.find((r: any) => r.id === a.videoId);
    r.tasks = (r.tasks || []).map((t: any) =>
      t.annotationId === id
        ? { ...t, status: status === "Resolved" ? "Complete" : "To Do" }
        : t,
    );
  }, "Feedback " + status);
}
export function reviewVersion(
  videoId: string,
  versionId: string,
  status: string,
) {
  const s = getState(),
    r = s.records.find((r: any) => r.id === videoId);
  if (!r) throw Error("Video not found");
  if (status === "Approved" && !["owner", "executive"].includes(user().role))
    throw Error("McKenzie or Lawrence must approve");
  if (
    status === "Approved" &&
    s.annotations.some(
      (a: any) =>
        a.videoId === videoId &&
        a.versionId === versionId &&
        !a.archived &&
        a.status !== "Resolved",
    )
  )
    throw Error("Resolve outstanding annotations before approval");
  if (!r.versions.some((v: any) => v.id === versionId))
    throw Error("Version not found");
  saveRecord({
    ...r,
    status:
      r.versions.at(-1).id === versionId
        ? status === "Approved"
          ? "Approved"
          : "Review"
        : r.status,
    versions: r.versions.map((v: any) =>
      v.id === versionId
        ? {
            ...v,
            status,
            reviews: [
              ...(v.reviews || []),
              { status, by: user().name, at: new Date().toISOString() },
            ],
          }
        : v,
    ),
  });
}
export function sendLocalMessage(conversationId: string, values: any) {
  conversation(conversationId);
  if (!values.text?.trim() && !values.attachment_id)
    throw Error("Enter a message or attachment");
  const m = {
    ...values,
    id: crypto.randomUUID(),
    conversationId,
    sender_id: user().id,
    sender_name: user().name,
    created_at: new Date().toISOString(),
  };
  mutate((s) => s.messages.push(m), "Sent local demo message");
  return m;
}
