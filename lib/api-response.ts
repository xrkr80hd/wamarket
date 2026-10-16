import { flushCloudWorkspace } from "./cloud-workspace";
export class WorkspaceResponseError extends Error {
  needsSignIn: boolean;
  constructor(message: string, needsSignIn = false) {
    super(message);
    this.needsSignIn = needsSignIn;
  }
}
export async function apiJSON(response: Response): Promise<any> {
  const auth =
    response.status === 401 ||
    response.status === 403 ||
    /\/signin-with-chatgpt(?:\?|$)/.test(response.url);
  if (!(response.headers.get("content-type") || "").includes("json"))
    throw new WorkspaceResponseError(
      auth
        ? "Your session needs to be refreshed. Reload the workspace to continue."
        : "The workspace could not load its data. Refresh and try again.",
      auth,
    );
  let data: any;
  try {
    data = JSON.parse(await response.text());
  } catch {
    throw new WorkspaceResponseError(
      "The workspace returned incomplete data. Refresh and try again.",
    );
  }
  if (!response.ok)
    throw new WorkspaceResponseError(
      auth
        ? "Your session or workspace access needs attention. Reload the workspace to continue."
        : String(data.error || "Unable to complete this request. Try again."),
      auth,
    );
  return data;
}
import {
  getState,
  mutate,
  member,
  user,
  saveRecord,
  addAsset,
  conversation,
  people,
} from "./preview-store";
export async function apiFetch(
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  try {
    const u = new URL(url, window.location.origin),
      s = getState(),
      b = typeof init.body === "string" ? JSON.parse(init.body) : {},
      post = init.method && init.method !== "GET";
    let result: any = { ok: true };
    if (u.pathname === "/api/workspace") {
      if (!post)
        result = {
          member: member(),
          members: people,
          records: s.records.filter(
            (r: any) =>
              !r.privateConversation ||
              [r.privateConversation, ...(r.sharedConversations || [])].some(
                (id: string) =>
                  s.conversations.some(
                    (c: any) => c.id === id && c.members.includes(user().id),
                  ),
              ),
          ),
        };
      else if (b.action === "import") {
      } else if (b.action === "preferences")
        mutate((s) => (s.preferences[user().id] = b.preferences));
      else if (b.action === "task") {
        const r = s.records.find((r: any) => r.id === b.recordId);
        if (!r) throw Error("Campaign not found");
        const tasks = [...(r.tasks || [])];
        if (b.add) tasks.push({ ...b, title: b.title, status: "To Do" });
        else {
          if (!tasks[b.index] || tasks[b.index].title !== b.title)
            throw Error("Task changed; refresh");
          tasks[b.index] = {
            ...tasks[b.index],
            ...b,
            title: b.newTitle || b.title,
          };
        }
        saveRecord({ ...r, tasks });
      } else if (b.action === "delete") {
        const r = s.records.find((r: any) => r.id === b.id);
        if (!r) throw Error("Record not found");
        saveRecord({ ...r, archived: !r.archived });
      } else if (b.action === "remove-contact")
        mutate((s) => {
          const r = s.records.find((r: any) => r.id === b.id);
          if (r) r.archived = true;
        });
      else if (b.action === "invite")
        throw Error(
          "Production invitations are disabled. Use the preview identity selector.",
        );
      else result.id = saveRecord(b.record);
    } else if (
      u.pathname === "/api/files" &&
      post &&
      init.body instanceof FormData
    ) {
      const file = init.body.get("file") as File;
      if (!file) throw Error("Choose a file");
      const meta: any = {};
      for (const k of ["project", "folder", "parent", "dealership", "version"])
        if (init.body.get(k)) meta[k] = init.body.get(k);
      result.id = await addAsset(file, meta);
      result.asset = getState().records.find((r: any) => r.id === result.id);
    } else if (u.pathname === "/api/chat") {
      const cid =
        u.searchParams.get("conversation") || b.conversationId || "team";
      conversation(cid, s);
      if (!post)
        result = {
          messages: s.messages.filter((m: any) => m.conversationId === cid),
          people: people.map((p) => ({ ...p, online: false })),
          readAt: s.read[user().id + cid],
        };
      else if (b.action === "heartbeat") {
        if (b.read)
          mutate((s) => (s.read[user().id + cid] = new Date().toISOString()));
      } else
        mutate(
          (s) =>
            s.messages.push({
              id: b.id || crypto.randomUUID(),
              conversationId: cid,
              sender_id: user().id,
              sender_name: user().name,
              text: b.text,
              created_at: new Date().toISOString(),
              thread_id: b.threadId,
              project_id: b.projectId,
              attachment_id: b.attachmentId,
            }),
          "Sent local demo message",
        );
    } else if (u.pathname === "/api/personal-workspace") {
      const entries = s.personal[user().id] || [];
      if (!post) result = { entries };
      else {
        if (b.password)
          throw Error("Do not store real passwords in this local preview");
        mutate((s) => {
          const list = (s.personal[user().id] ||= []);
          const i = list.findIndex((x: any) => x.id === b.id);
          if (b.action === "delete") list[i].archived = true;
          else if (b.action === "check" && i >= 0) list[i].checkedDate = b.date;
          else if (b.action === "reveal")
            throw Error("Password storage is disabled in preview");
          else if (b.action === "project-task") {
            const r = s.records.find((r: any) => r.id === b.projectId);
            r.tasks ||= [];
            r.tasks.push({
              title: list[i].title,
              status: "To Do",
              assignee: user().name,
            });
          } else if (i >= 0) list[i] = { ...list[i], ...b };
          else list.push({ ...b, id: crypto.randomUUID() });
        });
      }
    } else if (
      u.pathname === "/api/hero-images" ||
      u.pathname === "/api/profile-photo"
    ) {
      if (init.body instanceof FormData) {
        const id = await addAsset(init.body.get("file") as File, {
          category: "Branding",
        });
        mutate((s) => {
          s.preferences[user().id] ||= {};
          if (u.pathname === "/api/hero-images") {
            s.preferences[user().id].heroImages ||= [];
            s.preferences[user().id].heroImages.push(id);
          } else s.preferences[user().id].avatar = id;
        });
        result = { images: getState().preferences[user().id].heroImages || [] };
      } else if (init.method === "DELETE") {
        mutate(
          (s) =>
            (s.preferences[user().id].heroImages = (
              s.preferences[user().id].heroImages || []
            ).filter((x: string) => x !== u.searchParams.get("image"))),
        );
        result = { images: getState().preferences[user().id].heroImages };
      }
    } else
      throw Error(
        "This external integration is unavailable in the local preview",
      );
    if (
      sessionStorage.getItem("wam-cloud-auth") &&
      post &&
      b.action !== "heartbeat"
    )
      await flushCloudWorkspace();
    return Response.json(result);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 });
  }
}
