import { notificationService } from "./notifications.js";
const MASTER = "xrkr80hd@gmail.com";
export function createWorkspaceHandler(env, fetcher = fetch) {
  const url = env.SUPABASE_URL,
    key = env.SUPABASE_SERVICE_ROLE_KEY;
  const headers = {
    apikey: key,
    Authorization: "Bearer " + key,
    "Content-Type": "application/json",
  };
  async function api(path, method = "GET", body, extra = {}) {
    const r = await fetcher(url + path, {
      method,
      headers: { ...headers, ...extra },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const t = await r.text();
    let d;
    try {
      d = t ? JSON.parse(t) : null;
    } catch {
      d = { message: t };
    }
    if (!r.ok)
      throw Object.assign(
        Error(d?.message || d?.msg || d?.error || "Workspace request failed"),
        { status: r.status },
      );
    return d;
  }
  return async (req) => {
    const send = (status, data) =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      });
    try {
      const bearer = req.headers.get("Authorization") || "";
      if (!bearer.startsWith("Bearer "))
        return send(401, { error: "Sign in to continue." });
      const me = await api("/auth/v1/user", "GET", undefined, {
        Authorization: bearer,
      });
      if (
        !me.email_confirmed_at ||
        !(
          me.email?.toLowerCase() === MASTER ||
          me.app_metadata?.wamarket_access === true
        ) ||
        me.app_metadata?.wamarket_active === false
      )
        return send(403, { error: "Workspace access unavailable." });
      if (
        req.headers.get("X-Wam-User") &&
        req.headers.get("X-Wam-User") !== me.id
      )
        return send(409, {
          error: "Your signed-in account changed. Reload the page.",
        });
      const role =
        me.email?.toLowerCase() === MASTER
          ? "owner"
          : me.app_metadata?.wamarket_role;
      const endpoint = new URL(req.url).searchParams.get("route") || "state";
      const readable = (r) =>
        !r?.privateMembers || r.privateMembers.includes(me.id);
      async function directory() {
        let all = [];
        for (let page = 1; page <= 100; page++) {
          const d = await api(
            "/auth/v1/admin/users?page=" + page + "&per_page=100",
          );
          all.push(...d.users);
          if (d.users.length < 100) break;
        }
        const presence = await api(
          "/rest/v1/wamarket_presence?select=user_id,last_seen,online",
        );
        return all
          .filter(
            (u) =>
              u.email_confirmed_at &&
              (u.email?.toLowerCase() === MASTER ||
                u.app_metadata?.wamarket_access === true) &&
              u.app_metadata?.wamarket_active !== false,
          )
          .map((u) => ({
            id: u.id,
            name:
              u.user_metadata?.name ||
              (u.email?.toLowerCase() === MASTER ? "Travis" : "Team member"),
            email: u.email,
            role:
              u.email?.toLowerCase() === MASTER
                ? "owner"
                : u.app_metadata?.wamarket_role,
            isAdmin: u.email?.toLowerCase() === MASTER,
            active: true,
            online: presence.some(
              (p) =>
                p.user_id === u.id &&
                p.online &&
                Date.now() - Date.parse(p.last_seen) < 60000,
            ),
          }));
      }
      async function chat(id) {
        if (id === "team")
          return { members: (await directory()).map((p) => p.id) };
        const c = await api(
          "/rest/v1/wamarket_records?id=eq." +
            encodeURIComponent(id) +
            "&select=data",
        );
        if (
          c[0]?.data.kind !== "__conversation" ||
          !c[0].data.members.includes(me.id)
        )
          throw Object.assign(Error("This conversation is private."), {
            status: 403,
          });
        return c[0].data;
      }
      const notifications = notificationService(
        api,
        me,
        directory,
        chat,
        fetcher,
      );
      if (endpoint === "notifications")
        return await notifications.request(req, send);
      if (endpoint === "drive-config") {
        const bridge = req.headers.get("X-Drive-Bridge") || "";
        const digest = Array.from(
          new Uint8Array(
            await crypto.subtle.digest(
              "SHA-256",
              new TextEncoder().encode(bridge),
            ),
          ),
        )
          .map((x) => x.toString(16).padStart(2, "0"))
          .join("");
        if (
          digest !==
          "eb1b20035497dd13cff53b4f0f9b84993cf6f1366996755977df916a29676f34"
        )
          return send(403, { error: "Server connection required." });
        if (req.method === "GET") {
          const rows = await api(
            "/rest/v1/wamarket_integrations?provider=eq.google-drive&select=data",
          );
          return send(200, { data: rows[0]?.data || null });
        }
        if (me.email?.toLowerCase() !== MASTER)
          return send(403, {
            error: "Only the master administrator can connect storage.",
          });
        const body = await req.json();
        if (typeof body.encrypted !== "string" || body.encrypted.length > 30000)
          return send(400, { error: "Invalid connection." });
        await api(
          "/rest/v1/wamarket_integrations?on_conflict=provider",
          "POST",
          {
            provider: "google-drive",
            data: { encrypted: body.encrypted },
            updated_at: new Date().toISOString(),
          },
          { Prefer: "resolution=merge-duplicates" },
        );
        return send(200, { ok: true });
      }
      if (req.method === "GET" && endpoint === "state") {
        const rows = await api(
          "/rest/v1/wamarket_records?data->>kind=neq.__notification&select=id,data,version&limit=1000",
        );
        const personal = await api(
          "/rest/v1/wamarket_dashboards?user_id=eq." + me.id + "&select=data",
        );
        return send(200, {
          records: rows.filter((r) => readable(r.data)),
          personal: personal[0]?.data || {},
          members: await directory(),
        });
      }
      if (req.method !== "POST")
        return send(405, { error: "Method not allowed" });
      const raw = await req.text();
      if (raw.length > 1500000)
        return send(413, { error: "Workspace update too large." });
      const b = JSON.parse(raw);
      if (endpoint === "presence") {
        await api(
          "/rest/v1/wamarket_presence?on_conflict=user_id",
          "POST",
          {
            user_id: me.id,
            last_seen: new Date().toISOString(),
            online: b.online === true,
          },
          { Prefer: "resolution=merge-duplicates" },
        );
        return send(200, { ok: true });
      }
      if (endpoint === "personal") {
        if (!b.data || typeof b.data !== "object" || Array.isArray(b.data))
          return send(400, { error: "Invalid dashboard" });
        await api(
          "/rest/v1/wamarket_dashboards?on_conflict=user_id",
          "POST",
          {
            user_id: me.id,
            data: b.data,
            updated_at: new Date().toISOString(),
          },
          { Prefer: "resolution=merge-duplicates" },
        );
        return send(200, { ok: true });
      }
      if (endpoint === "media-upload") {
        if (role === "viewer")
          return send(403, { error: "Viewer accounts cannot upload media." });
        const category = String(b.type || "").split("/")[0],
          bucket = {
            video: "wamarket-videos",
            image: "wamarket-images",
            audio: "wamarket-audio",
          }[category];
        if (!bucket)
          return send(400, { error: "Choose a video, image, or audio file." });
        const id = crypto.randomUUID(),
          name = String(b.name || "media")
            .replace(/[^a-zA-Z0-9._-]/g, "_")
            .slice(-150),
          path = me.id + "/" + id + "/" + name;
        const signed = await api(
          "/storage/v1/object/upload/sign/" + bucket + "/" + path,
          "POST",
          {},
        );
        const privateMembers =
          b.conversationId && b.conversationId !== "team"
            ? (await chat(b.conversationId)).members
            : undefined;
        return send(200, {
          id,
          bucket,
          path,
          privateMembers,
          uploadURL: url + "/storage/v1" + signed.url,
        });
      }
      if (endpoint === "media-read") {
        const rows = await api(
          "/rest/v1/wamarket_records?id=eq." +
            encodeURIComponent(b.id) +
            "&select=data",
        );
        const r = rows[0]?.data;
        if (!r || !readable(r) || !r.storage)
          return send(404, { error: "Media not found" });
        if (r.storage.provider === "gdrive")
          return send(200, {
            provider: "gdrive",
            fileId: r.storage.fileId,
            assetId: r.id,
          });
        const signed = await api(
          "/storage/v1/object/sign/" + r.storage.bucket + "/" + r.storage.path,
          "POST",
          { expiresIn: 900 },
        );
        return send(200, { url: url + "/storage/v1" + signed.signedURL });
      }
      if (endpoint !== "record") return send(404, { error: "Not found" });
      const r = b.record;
      if (!r?.id || !r.kind || !r.title)
        return send(400, { error: "Invalid team record." });
      const existing = await api(
        "/rest/v1/wamarket_records?id=eq." +
          encodeURIComponent(r.id) +
          "&select=data,version",
      );
      const old = existing[0];
      if (r.kind === "__notification" || old?.data.kind === "__notification")
        return send(403, { error: "Notifications are managed by the server." });
      if (old && old.data.kind !== r.kind)
        return send(400, { error: "The record type cannot be changed." });
      if (old && !readable(old.data))
        return send(403, { error: "This record is private." });
      if (r.kind === "video") {
        const versions = r.versions || [];
        if (
          !Array.isArray(versions) ||
          versions.some((v) => !v?.id) ||
          new Set(versions.map((v) => v.id)).size !== versions.length
        )
          return send(400, { error: "Video revisions need unique IDs." });
        for (const version of versions) {
          const previous = old?.data.versions?.find((v) => v.id === version.id);
          if (
            previous &&
            (previous.source?.provider === "gdrive-link" ||
              version.source?.provider === "gdrive-link") &&
            (JSON.stringify(previous.source) !==
              JSON.stringify(version.source) ||
              previous.assetId !== version.assetId)
          )
            return send(403, {
              error:
                "Add a new revision instead of replacing a linked video. Existing feedback belongs to the original cut.",
            });
        }
      }
      if (r.kind === "__conversation") {
        if (
          !Array.isArray(r.members) ||
          r.members.length !== 2 ||
          !r.members.includes(me.id) ||
          !r.members.every((id) => typeof id === "string")
        )
          return send(403, { error: "Invalid private conversation." });
        const members = await directory();
        if (!r.members.every((id) => members.some((p) => p.id === id)))
          return send(403, { error: "Unknown team member." });
        if (
          old &&
          JSON.stringify(old.data.members) !== JSON.stringify(r.members)
        )
          return send(403, {
            error: "Conversation membership cannot be changed.",
          });
        r.privateMembers = r.members;
      } else if (r.kind === "__message") {
        const c = await chat(r.conversationId);
        if (old && old.data.sender_id !== me.id)
          return send(403, { error: "Only the sender can change a message." });
        r.privateMembers = r.conversationId === "team" ? undefined : c.members;
        r.sender_id = me.id;
        r.sender_name = me.user_metadata?.name || "Team member";
      } else if (r.privateConversation) {
        const c = await chat(r.privateConversation);
        r.privateMembers =
          r.privateConversation === "team" ? undefined : c.members;
      }
      if (
        old?.data.privateMembers &&
        JSON.stringify(old.data.privateMembers) !==
          JSON.stringify(r.privateMembers)
      )
        return send(403, {
          error: "Private file visibility cannot be changed here.",
        });
      if (
        role === "viewer" &&
        !["__message", "__conversation"].includes(r.kind)
      )
        return send(403, { error: "Viewer accounts are read-only." });
      if (
        role === "qa" &&
        ![
          "idea",
          "quickidea",
          "__annotation",
          "todo",
          "asset",
          "__message",
          "__conversation",
          "video",
        ].includes(r.kind)
      )
        return send(403, {
          error: "Q/A can add ideas, media and video feedback.",
        });
      if (role === "qa" && r.kind === "todo" && r.ownerId !== me.id)
        return send(403, { error: "Q/A can change their own tasks only." });
      if (
        !["owner", "executive"].includes(role) &&
        ((r.status === "Approved" && old?.data.status !== "Approved") ||
          r.versions?.some(
            (v) =>
              v.status === "Approved" &&
              !old?.data.versions?.some(
                (x) => x.id === v.id && x.status === "Approved",
              ),
          ))
      )
        return send(403, { error: "A manager or executive must approve." });
      if (role === "qa" && r.kind === "video") {
        if (!old)
          return send(403, {
            error: "Only the production team can create video projects.",
          });
        const allowed = ["tasks", "status", "updated", "history"];
        for (const k of new Set([...Object.keys(old.data), ...Object.keys(r)]))
          if (
            !allowed.includes(k) &&
            JSON.stringify(old.data[k]) !== JSON.stringify(r[k])
          )
            return send(403, {
              error:
                "Q/A can submit feedback without changing the video project.",
            });
        if (!["Revision", old.data.status].includes(r.status))
          return send(403, { error: "Q/A cannot approve videos." });
      }
      if (r.storage?.provider === "gdrive") {
        const digest = Array.from(
          new Uint8Array(
            await crypto.subtle.digest(
              "SHA-256",
              new TextEncoder().encode(req.headers.get("X-Drive-Bridge") || ""),
            ),
          ),
        )
          .map((x) => x.toString(16).padStart(2, "0"))
          .join("");
        if (
          digest !==
          "eb1b20035497dd13cff53b4f0f9b84993cf6f1366996755977df916a29676f34"
        )
          return send(403, {
            error: "Drive uploads must be verified by the website.",
          });
        if (
          old &&
          JSON.stringify(old.data.storage) !== JSON.stringify(r.storage)
        )
          return send(403, {
            error: "The original media file cannot be replaced here.",
          });
      } else if (r.storage) {
        if (
          !["wamarket-videos", "wamarket-images", "wamarket-audio"].includes(
            r.storage.bucket,
          ) ||
          typeof r.storage.path !== "string"
        )
          return send(400, { error: "Invalid media storage reference." });
        if (
          old &&
          JSON.stringify(old.data.storage) !== JSON.stringify(r.storage)
        )
          return send(403, {
            error:
              "The original media file cannot be replaced by changing its metadata.",
          });
        if (!old && !r.storage.path.startsWith(me.id + "/"))
          return send(403, {
            error:
              "Upload the original file with your account before adding its metadata.",
          });
      }
      const safe = {
        ...r,
        updatedById: me.id,
        updated: new Date().toISOString(),
      };
      if (!old) {
        const d = await api(
          "/rest/v1/wamarket_records",
          "POST",
          { id: r.id, data: safe, version: 1 },
          { Prefer: "return=representation" },
        );
        await notifications.emit(safe).catch(() => {});
        return send(200, { record: d[0] });
      }
      if (b.version !== old.version)
        return send(409, {
          error: "This item changed. Reload the shared version before saving.",
          record: old,
        });
      const d = await api(
        "/rest/v1/wamarket_records?id=eq." +
          encodeURIComponent(r.id) +
          "&version=eq." +
          old.version,
        "PATCH",
        {
          data: safe,
          version: old.version + 1,
          updated_at: new Date().toISOString(),
        },
        { Prefer: "return=representation" },
      );
      if (!d.length)
        return send(409, { error: "This item changed. Reload and try again." });
      await notifications.emit(safe, old.data).catch(() => {});
      return send(200, { record: d[0] });
    } catch (e) {
      return send(
        [400, 401, 403, 409, 413, 422, 429].includes(e.status) ? e.status : 500,
        { error: e.message || "Workspace unavailable." },
      );
    }
  };
}
