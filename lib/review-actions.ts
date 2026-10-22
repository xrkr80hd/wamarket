import {
  getState,
  mutate,
  user,
  saveRecord,
  addAsset,
  conversation,
} from "./preview-store";
import { flushCloudWorkspace } from "./cloud-workspace";
import { parseDriveLink } from "./drive-review.js";
export async function addDriveVideoVersion(videoId: string, link: string, durationSeconds?: number) {
  if (durationSeconds !== undefined && (!Number.isFinite(durationSeconds) || durationSeconds <= 0 || durationSeconds > 86400))
    throw Error("Enter a valid video runtime.");
  if (!sessionStorage.getItem("wam-cloud-auth"))
    throw Error(
      "Sign in to the shared workspace to link a private Drive video.",
    );
  if (!["owner", "executive", "coordinator"].includes(user().role))
    throw Error("Only the production team can add video revisions.");
  // Public viewer links need no Google account, token, or video upload.
  const { fileId, resourceKey } = parseDriveLink(link);
  await flushCloudWorkspace();
  // Re-read after network work so a revision cannot erase an intervening update.
  const video = getState().records.find(
    (r: any) => r.id === videoId && r.kind === "video",
  );
  if (!video || video.archived) throw Error("Video project not found");
  const version = {
    id: crypto.randomUUID(),
    source: { provider: "gdrive-public", fileId, resourceKey },
    ...(durationSeconds ? { durationSeconds } : {}),
    originalName: "Shared Google Drive video",
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
    authorId: user().id,
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

function findEditableMarker(state: any, id: string) {
  const marker = state.annotations.find((a: any) => a.id === id);
  if (!marker || marker.archived) throw Error("Marker not found");
  if (!canManageAnnotation(marker))
    throw Error("You do not have permission to change this marker");
  return marker;
}
export function canManageAnnotation(marker: any) {
  const me = user();
  if (me.role === "viewer") return false;
  return ["owner", "executive", "coordinator"].includes(me.role) ||
    (marker.authorId ? marker.authorId === me.id : marker.author === me.name);
}
export function updateAnnotation(id: string, values: any) {
  if (!values.text?.trim()) throw Error("Enter marker feedback");
  if (!Number.isFinite(values.start) || values.start < 0 ||
      (values.end != null && (!Number.isFinite(values.end) || values.end < values.start)))
    throw Error("Invalid marker time range");
  mutate((state) => {
    const marker = findEditableMarker(state, id);
    const changes = {
      start: values.start, end: values.end ?? null,
      text: values.text.trim(), type: values.type, priority: values.priority,
      ...(values.reference ? { reference: values.reference } : {}),
    };
    Object.assign(marker, changes);
    marker.history ||= [];
    marker.history.push({ action: "Edited", by: user().name, at: new Date().toISOString() });
    const video = state.records.find((r: any) => r.id === marker.videoId);
    if (video) video.tasks = (video.tasks || []).map((task: any) =>
      task.annotationId === id ? {
        ...task,
        title: `${marker.type} at ${marker.start}s — ${marker.text}`,
        urgency: marker.priority,
      } : task
    );
  }, "Edited video review marker");
}
export function archiveAnnotation(id: string) {
  mutate((state) => {
    const marker = findEditableMarker(state, id);
    marker.archived = true;
    marker.history ||= [];
    marker.history.push({ action: "Deleted", by: user().name, at: new Date().toISOString() });
    const video = state.records.find((r: any) => r.id === marker.videoId);
    if (video) video.tasks = (video.tasks || []).filter((task: any) =>
      task.annotationId !== id
    );
    // Archiving a marker never removes a video, version, source, or uploaded asset.
  }, "Deleted video review marker");
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
