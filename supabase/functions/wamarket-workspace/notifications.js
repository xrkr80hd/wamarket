import {
  newVapidKeys,
  sendWebPush,
  validSubscription,
  encode64,
} from "./web-push.js";
const PREFIX = "wam-push:";
const readKey = (id) => "wam-notification-read:" + id;
const privateFilter = (id) =>
  "&data->privateMembers=cs." + encodeURIComponent(JSON.stringify([id]));
export function notificationService(api, me, directory, chat, fetcher) {
  const integration = async (provider) =>
    (
      await api(
        "/rest/v1/wamarket_integrations?provider=eq." +
          encodeURIComponent(provider) +
          "&select=data",
      )
    )[0]?.data;
  const put = (provider, data, ignore = false) =>
    api(
      "/rest/v1/wamarket_integrations?on_conflict=provider",
      "POST",
      { provider, data, updated_at: new Date().toISOString() },
      {
        Prefer: ignore
          ? "resolution=ignore-duplicates"
          : "resolution=merge-duplicates",
      },
    );
  async function keys() {
    let value = await integration("wam-webpush-v1");
    if (!value) {
      await put("wam-webpush-v1", await newVapidKeys(), true);
      value = await integration("wam-webpush-v1");
    }
    return value;
  }
  async function feed(userId = me.id) {
    const [rows, receipt, personal] = await Promise.all([
      api(
        "/rest/v1/wamarket_records?data->>kind=eq.__notification" +
          privateFilter(userId) +
          "&select=data&order=updated_at.desc&limit=100",
      ),
      integration(readKey(userId)),
      api(
        "/rest/v1/wamarket_dashboards?user_id=eq." +
          encodeURIComponent(userId) +
          "&select=data",
      ),
    ]);
    return rows.map(({ data }) => ({
      ...data,
      read:
        data.actorId === userId ||
        !!receipt?.ids?.includes(data.id) ||
        data.createdAt <= (receipt?.readAt || "") ||
        (data.category === "message" &&
          data.messageAt <=
            (personal[0]?.data?.read?.[userId + data.conversationId] || "")),
    }));
  }
  async function request(req, send) {
    if (req.method === "GET") {
      const [items, vapid, recent] = await Promise.all([
        feed(),
        keys(),
        api(
          "/rest/v1/wamarket_records?data->>kind=neq.__notification&select=data&order=updated_at.desc&limit=50",
        ),
      ]);
      const labels = {
        note: "Note",
        quickidea: "Quick idea",
        project: "Campaign",
        video: "Video project",
        event: "Event",
        asset: "File",
        folder: "Folder",
        todo: "Task",
        content: "Scheduled post",
      };
      const targets = new Set(items.map((item) => item.targetId));
      const history = recent
        .filter(
          ({ data: r }) =>
            labels[r.kind] &&
            !r.archived &&
            (!r.privateMembers || r.privateMembers.includes(me.id)) &&
            !targets.has(r.id) &&
            r.updated,
        )
        .map(({ data: r }) => ({
          id: "recent-" + r.id,
          title: labels[r.kind] + " updated",
          summary: r.title,
          createdAt: r.updated,
          targetId: r.id,
          targetKind: r.kind,
          folderId: r.folder || "",
          category: "activity",
          read: true,
        }));
      return send(200, {
        items: [...items, ...history]
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, 100),
        publicKey: vapid.publicKey,
      });
    }
    if (req.method !== "POST")
      return send(405, { error: "Method not allowed" });
    const raw = await req.text();
    if (raw.length > 16000)
      return send(413, { error: "Notification request too large" });
    const b = JSON.parse(raw);
    if (b.action === "read") {
      const previous = (await integration(readKey(me.id))) || {};
      const data = b.all
        ? { readAt: new Date().toISOString(), ids: [] }
        : {
            ...previous,
            ids: [
              ...new Set([
                ...(previous.ids || []),
                ...(Array.isArray(b.ids)
                  ? b.ids.filter((x) => typeof x === "string")
                  : []),
              ]),
            ].slice(-500),
          };
      await put(readKey(me.id), data);
      return send(200, { ok: true });
    }
    if (
      !["subscribe", "unsubscribe"].includes(b.action) ||
      !validSubscription(b.subscription)
    )
      return send(400, { error: "Invalid push subscription" });
    const provider =
      PREFIX +
      encode64(
        await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(b.subscription.endpoint),
        ),
      );
    const previous = await integration(provider);
    if (b.action === "unsubscribe") {
      if (previous?.userId === me.id)
        await api(
          "/rest/v1/wamarket_integrations?provider=eq." +
            encodeURIComponent(provider),
          "DELETE",
        );
    } else {
      await put(provider, { userId: me.id, subscription: b.subscription });
    }
    return send(200, { ok: true });
  }
  async function emit(record, old) {
    const names = {
      note: "note",
      quickidea: "quick idea",
      idea: "idea",
      asset: "file",
      folder: "folder",
      event: "event",
      project: "campaign",
      video: "video project",
      todo: "task",
      content: "scheduled post",
      __annotation: "video feedback",
    };
    const message = record.kind === "__message";
    if ((!message && !names[record.kind]) || (message && old)) return;
    const fields = [
      "title",
      "notes",
      "folder",
      "status",
      "artwork",
      "date",
      "archived",
      "text",
    ];
    if (
      old &&
      !fields.some(
        (key) => JSON.stringify(old[key]) !== JSON.stringify(record[key]),
      )
    )
      return;
    const members = await directory();
    const allowed = message
      ? (await chat(record.conversationId)).members
      : record.privateMembers || members.map((p) => p.id);
    const recipients = allowed.filter(
      (id) => members.some((p) => p.id === id) && (!message || id !== me.id),
    );
    if (!recipients.length) return;
    const actor = members.find((p) => p.id === me.id)?.name || "Team member";
    const verb = record.archived
      ? "archived"
      : old
        ? "updated"
        : record.kind === "asset"
          ? "uploaded"
          : "added";
    const item = {
      id:
        "notification-" +
        record.id +
        "-" +
        (old ? crypto.randomUUID() : "created"),
      kind: "__notification",
      title: message
        ? actor + " sent you a message"
        : actor + " " + verb + " a " + names[record.kind],
      summary: message
        ? "Open your conversation"
        : String(record.title).slice(0, 180),
      actorId: me.id,
      category: message ? "message" : "activity",
      createdAt: new Date().toISOString(),
      targetId: record.id,
      targetKind: record.kind,
      folderId: record.folder || "",
      conversationId: message ? record.conversationId : "",
      messageAt: record.created_at || "",
      privateMembers: recipients,
    };
    await api(
      "/rest/v1/wamarket_records?on_conflict=id",
      "POST",
      { id: item.id, data: item, version: 1 },
      { Prefer: "resolution=ignore-duplicates" },
    );
    const subscriptions = await api(
      "/rest/v1/wamarket_integrations?provider=like.wam-push:*&select=provider,data",
    );
    const targets = subscriptions.filter(
      (row) =>
        recipients.includes(row.data.userId) && row.data.userId !== me.id,
    );
    if (!targets.length) return;
    const vapid = await keys();
    const counts = new Map(
      await Promise.all(
        [...new Set(targets.map((row) => row.data.userId))].map(async (id) => [
          id,
          (await feed(id)).filter((n) => !n.read).length,
        ]),
      ),
    );
    await Promise.allSettled(
      targets.map(async (row) => {
        const status = await sendWebPush(
          row.data.subscription,
          {
            id: item.id,
            userId: row.data.userId,
            title: item.title,
            body: message
              ? "Open Walker Suite to read your message."
              : item.summary,
            badge: counts.get(row.data.userId),
            url: "/?wam-notification=" + encodeURIComponent(item.id),
          },
          vapid,
          fetcher,
        );
        if ([404, 410].includes(status))
          await api(
            "/rest/v1/wamarket_integrations?provider=eq." +
              encodeURIComponent(row.provider),
            "DELETE",
          );
      }),
    );
  }
  return { request, emit };
}
