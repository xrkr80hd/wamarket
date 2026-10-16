import { getState, user, mutate, addAsset } from "./preview-store";
import { accountRequest } from "./local-session";
const signed = () => !!sessionStorage.getItem("wam-local-auth");
function accept(record: any) {
  mutate((s) => {
    const i = s.records.findIndex((r: any) => r.id === record.id);
    if (i < 0) s.records.push(record);
    else s.records[i] = record;
    for (const a of record.attachments || [])
      if (!s.records.some((r: any) => r.id === a.id))
        s.records.push({
          ...a,
          kind: "asset",
          status: "Draft",
          quickIdea: record.id,
          source: "Quick Ideas",
          project: "",
          dealership: "",
          folder: "",
        });
  });
  return record;
}
export async function refreshQuickIdeas() {
  if (!signed()) return;
  const result = await accountRequest("quick-ideas");
  if (
    result.records.some(
      (r: any) =>
        JSON.stringify(getState().records.find((x: any) => x.id === r.id)) !==
        JSON.stringify(r),
    )
  )
    for (const r of result.records) accept(r);
}
export async function uploadIdeaMedia(file: File) {
  if (file.size > 100 * 1024 * 1024)
    throw Error("Quick Idea files can be up to 100 MB each");
  if (
    (!file.type.startsWith("image/") && !file.type.startsWith("video/")) ||
    file.type === "image/svg+xml"
  )
    throw Error("Choose a photo, screenshot or video");
  if (signed()) {
    const r = await fetch("/__local/quick-ideas/media", {
      method: "POST",
      headers: {
        "Content-Type": file.type,
        "X-File-Name": encodeURIComponent(file.name),
      },
      body: file,
    });
    const result = await r.json();
    if (!r.ok) throw Error(result.error || "Media upload failed");
    return result;
  }
  const id = await addAsset(file, { source: "Quick Ideas" });
  return { id, title: file.name, type: file.type, size: file.size };
}
export async function quickIdeaAction(body: any) {
  if (user().role === "viewer")
    throw Error("Your role can view quick ideas only");
  if (signed()) {
    const result = await accountRequest("quick-ideas", body);
    return accept(result.record);
  }
  let r = getState().records.find((r: any) => r.id === body.id);
  if (body.action === "save") {
    if (!body.title?.trim()) throw Error("Give the idea a quick label");
    if (
      r &&
      r.authorId !== user().id &&
      user().role !== "owner" &&
      !user().isAdmin
    )
      throw Error("Only the author or marketing lead can edit this idea");
    r = {
      ...r,
      id: r?.id || crypto.randomUUID(),
      kind: "quickidea",
      title: body.title.trim(),
      notes: body.notes || "",
      attachments: body.attachments || [],
      authorId: r?.authorId || user().id,
      author: r?.author || user().name,
      created: r?.created || new Date().toISOString(),
      votes: r?.votes || {},
      comments: r?.comments || [],
      updated: new Date().toISOString(),
    };
  } else {
    if (!r) throw Error("Idea not found");
    r = JSON.parse(JSON.stringify(r));
    if (body.action === "ack") {
      if (!["seen", "onit", ""].includes(body.value))
        throw Error("Choose Seen or On it");
      r.acknowledgements ||= {};
      if (body.value) {
        r.acknowledgements[user().id] = {
          name: user().name,
          status: body.value,
          at: new Date().toISOString(),
        };
        r.seenBy ||= {};
        r.seenBy[user().id] = new Date().toISOString();
      } else {
        delete r.acknowledgements[user().id];
        if (r.seenBy) delete r.seenBy[user().id];
      }
    } else if (body.action === "seen") {
      r.seenBy ||= {};
      if (body.value === false) delete r.seenBy[user().id];
      else r.seenBy[user().id] = new Date().toISOString();
    } else if (body.action === "react") {
      if (![-1, 0, 1].includes(body.value)) throw Error("Choose a reaction");
      r.votes[user().id] = body.value;
    } else if (body.action === "comment") {
      if (!body.text?.trim()) throw Error("Write a note");
      r.comments.push({
        id: crypto.randomUUID(),
        text: body.text.trim(),
        by: user().name,
        authorId: user().id,
        at: new Date().toISOString(),
      });
    } else if (body.action === "archive" || body.action === "restore") {
      if (
        r.authorId !== user().id &&
        user().role !== "owner" &&
        !user().isAdmin
      )
        throw Error("Only the author or marketing lead can archive this idea");
      r.archived = body.action === "archive";
    } else if (body.action === "delete-comment") {
      const c = r.comments.find((c: any) => c.id === body.commentId);
      if (
        !c ||
        (c.authorId !== user().id && user().role !== "owner" && !user().isAdmin)
      )
        throw Error("You cannot remove that note");
      c.archived = true;
    } else throw Error("Unknown action");
  }
  return accept(r);
}
export function unreadIdeas(state = getState()) {
  return state.records.filter(
    (r: any) =>
      r.kind === "quickidea" &&
      !r.archived &&
      r.authorId !== user().id &&
      !r.seenBy?.[user().id],
  );
}
export function markIdeaRead(id: string) {
  return quickIdeaAction({ action: "seen", id, value: true });
}
export function openQuickIdea() {
  window.dispatchEvent(new Event("wam-quick-idea"));
}
