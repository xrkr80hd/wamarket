import { member, records, save } from "../../lib/workspace";
export const dynamic = "force-dynamic";
const tools = [
  {
    name: "walker_list_workspace",
    description:
      "Read Walker shared events, projects, ideas and media metadata.",
    inputSchema: { type: "object", properties: { kind: { type: "string" } } },
  },
  {
    name: "walker_save_record",
    description:
      "Create or update a to-do, event, project, idea or content draft in Walker Marketing Suite. Confirm user intent before writing; approvals remain owner controlled.",
    inputSchema: {
      type: "object",
      properties: { record: { type: "object" } },
      required: ["record"],
    },
  },
];
export async function POST(req: Request) {
  const b: any = await req.json();
  let result: any;
  if (b.method === "initialize")
    result = {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "Walker Marketing Suite", version: "1.0.0" },
    };
  else if (b.method === "tools/list") result = { tools };
  else if (b.method === "notifications/initialized")
    return new Response(null, { status: 204 });
  else if (b.method === "tools/call") {
    try {
      const m = await member();
      const a = b.params.arguments || {};
      if (b.params.name === "walker_list_workspace")
        result = {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                (await records()).filter(
                  (r) =>
                    !["invite", "system"].includes(r.kind) &&
                    (!a.kind || r.kind === a.kind),
                ),
              ),
            },
          ],
        };
      else if (b.params.name === "walker_save_record") {
        if (
          !["event", "project", "idea", "content", "todo"].includes(
            a.record?.kind,
          )
        )
          throw new Error("Unsupported record type");
        result = {
          content: [
            {
              type: "text",
              text: JSON.stringify({ id: await save(a.record, m) }),
            },
          ],
        };
      }
    } catch (e: any) {
      return Response.json(
        {
          jsonrpc: "2.0",
          id: b.id,
          error: { code: -32001, message: e.message },
        },
        { status: 403 },
      );
    }
  } else
    return Response.json({
      jsonrpc: "2.0",
      id: b.id,
      error: { code: -32601, message: "Method not found" },
    });
  return Response.json({ jsonrpc: "2.0", id: b.id, result });
}
