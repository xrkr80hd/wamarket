import {
  getState,
  mutate,
  user,
  people,
  conversation,
  saveRecord,
} from "./preview-store";
import { sendLocalMessage } from "./review-actions";
export function ensureTeamChat() {
  const s = getState(),
    ids = people.filter((p) => p.active !== false).map((p) => p.id),
    team = s.conversations.find((c: any) => c.id === "team");
  if (
    !team ||
    team.title !== "COLLAB chat" ||
    JSON.stringify([...team.members].sort()) !== JSON.stringify([...ids].sort())
  )
    mutate((s) => {
      const c = s.conversations.find((c: any) => c.id === "team");
      if (c) {
        c.members = ids;
        c.title = "COLLAB chat";
      } else
        s.conversations.unshift({
          id: "team",
          title: "COLLAB chat",
          type: "Group",
          members: ids,
        });
    });
}
export function directChat(personId: string) {
  if (
    !people.some((p) => p.id === personId && p.active !== false) ||
    personId === user().id
  )
    throw Error("Choose another team member");
  const s = getState(),
    members = [user().id, personId].sort(),
    found = s.conversations.find(
      (c: any) =>
        c.type === "Direct" &&
        JSON.stringify([...c.members].sort()) === JSON.stringify(members),
    );
  if (found) return found.id;
  const id = crypto.randomUUID();
  mutate((s) =>
    s.conversations.push({
      id,
      title: members
        .map((id) => people.find((p) => p.id === id)?.name)
        .join(" + "),
      type: "Direct",
      members,
    }),
  );
  return id;
}
export function canAccessAsset(a: any, s = getState()) {
  if (!a.privateConversation) return true;
  return [a.privateConversation, ...(a.sharedConversations || [])].some((id) =>
    s.conversations.some(
      (c: any) => c.id === id && c.members.includes(user().id),
    ),
  );
}
export function sendChatMedia(conversationId: string, values: any) {
  const s = getState(),
    chat = conversation(conversationId, s),
    ids = [...new Set<string>(values.assetIds || [])];
  for (const id of ids) {
    const asset = s.records.find((r: any) => r.id === id && r.kind === "asset");
    if (!asset || !canAccessAsset(asset, s))
      throw Error("You do not have access to one of the selected files");
  }
  if (!values.text?.trim() && !ids.length)
    throw Error("Write a message or select media");
  const m = {
    id: crypto.randomUUID(),
    conversationId,
    text: values.text || "",
    replyTo: values.replyTo,
    attachments: ids,
    attachment_id: ids[0] || "",
    sender_id: user().id,
    sender_name: user().name,
    created_at: new Date().toISOString(),
  };
  mutate((s) => {
    s.messages.push(m);
    for (const id of ids) {
      const a = s.records.find((r: any) => r.id === id);
      a.chatOrigins ||= [];
      a.chatOrigins.push({
        conversationId: chat.id,
        conversationTitle: chat.title,
        messageId: m.id,
        sentBy: user().name,
        sentAt: m.created_at,
      });
      a.associations ||= [];
      if (
        !a.associations.some(
          (x: any) => x.kind === "conversation" && x.id === chat.id,
        )
      )
        a.associations.push({
          id: chat.id,
          kind: "conversation",
          label: chat.title,
        });
      if (a.privateConversation && a.privateConversation !== chat.id)
        a.sharedConversations = [
          ...new Set([...(a.sharedConversations || []), chat.id]),
        ];
      delete a.chatUploadPending;
    }
  }, "Sent chat message and linked media");
  return m;
}
