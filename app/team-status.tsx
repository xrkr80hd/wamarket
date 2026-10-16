import { useState } from "react";
import { Check, Hand } from "lucide-react";
import { user, saveRecord, mutate } from "../lib/preview-store";
import { quickIdeaAction } from "../lib/quick-ideas";
export default function TeamStatus({
  record,
  annotation = false,
  taskIndex,
}: any) {
  const [error, E] = useState(""),
    [busy, B] = useState(false),
    item = taskIndex !== undefined ? record.tasks[taskIndex] : record;
  const mine = item.acknowledgements?.[user().id]?.status;
  async function set(status: string) {
    B(true);
    E("");
    try {
      const value = mine === status ? "" : status;
      if (record.kind === "quickidea")
        await quickIdeaAction({ id: record.id, action: "ack", value });
      else {
        const acknowledgements = { ...item.acknowledgements };
        if (value)
          acknowledgements[user().id] = {
            name: user().name,
            status: value,
            at: new Date().toISOString(),
          };
        else delete acknowledgements[user().id];
        if (annotation)
          mutate((s) => {
            const a = s.annotations.find((a: any) => a.id === record.id);
            if (a) a.acknowledgements = acknowledgements;
          });
        else
          saveRecord(
            taskIndex !== undefined
              ? {
                  ...record,
                  tasks: record.tasks.map((t: any, i: number) =>
                    i === taskIndex ? { ...t, acknowledgements } : t,
                  ),
                }
              : { ...record, acknowledgements },
          );
      }
    } catch (e: any) {
      E(e.message);
    } finally {
      B(false);
    }
  }
  return (
    <div className="team-status">
      <div className="team-status-actions">
        <button
          type="button"
          disabled={busy || user().role === "viewer"}
          aria-pressed={mine === "seen"}
          onClick={() => set("seen")}
        >
          <Check size={13} />
          Seen
        </button>
        <button
          type="button"
          disabled={busy || user().role === "viewer"}
          aria-pressed={mine === "onit"}
          onClick={() => set("onit")}
        >
          <Hand size={13} />
          On it
        </button>
      </div>
      <div className="team-acknowledgements">
        {Object.entries(item.acknowledgements || {}).map(([id, a]: any) => (
          <span className={a.status === "onit" ? "working" : ""} key={id}>
            {a.name} · {a.status === "onit" ? "On it" : "Seen"}
          </span>
        ))}
      </div>
      {error && <small role="alert">{error}</small>}
    </div>
  );
}
