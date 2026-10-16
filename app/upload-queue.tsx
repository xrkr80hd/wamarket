import { useRef, useState } from "react";
import { localStorageAdapter } from "../lib/storage-adapter";
export default function UploadQueue({ metadata = {} }: any) {
  const [queue, Q] = useState<any[]>([]),
    [busy, B] = useState(false),
    [drag, D] = useState(false);
  const input = useRef<HTMLInputElement>(null),
    cancel = useRef(false);
  function add(files: FileList | File[] | null) {
    if (!files) return;
    Q((old) => [
      ...old,
      ...Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        file,
        status: "Queued",
        error: "",
      })),
    ]);
  }
  async function run() {
    B(true);
    cancel.current = false;
    for (const item of queue.filter((x) =>
      ["Queued", "Failed", "Cancelled"].includes(x.status),
    )) {
      if (cancel.current) {
        Q((old) =>
          old.map((x) =>
            x.status === "Queued" ? { ...x, status: "Cancelled" } : x,
          ),
        );
        break;
      }
      Q((old) =>
        old.map((x) =>
          x.id === item.id ? { ...x, status: "Saving", error: "" } : x,
        ),
      );
      try {
        await localStorageAdapter.upload(item.file, metadata);
        Q((old) =>
          old.map((x) => (x.id === item.id ? { ...x, status: "Saved" } : x)),
        );
      } catch (e: any) {
        Q((old) =>
          old.map((x) =>
            x.id === item.id ? { ...x, status: "Failed", error: e.message } : x,
          ),
        );
      }
    }
    B(false);
  }
  const done = queue.filter((x) => x.status === "Saved").length;
  return (
    <section
      className={"upload-zone " + (drag ? "dragover" : "")}
      onDragOver={(e) => {
        e.preventDefault();
        D(true);
      }}
      onDragLeave={() => D(false)}
      onDrop={(e) => {
        e.preventDefault();
        D(false);
        add(e.dataTransfer.files);
      }}
    >
      <div className="sectionhead">
        <div>
          <h3>Add files</h3>
          <p>Drop files here, or choose them from your device.</p>
        </div>
        <button
          className="primary"
          disabled={busy}
          onClick={() => input.current?.click()}
        >
          Choose files
        </button>
      </div>
      <input
        hidden
        type="file"
        ref={input}
        multiple
        onChange={(e) => {
          add(e.target.files);
          e.target.value = "";
        }}
      />
      <small>Videos, images and audio · Saved to shared storage</small>
      {!!queue.length && (
        <>
          <div className="upload-progress">
            <progress max={queue.length} value={done} />
            <small>{done === queue.length ? "Saved" : "Saving…"}</small>
          </div>
          {queue.map((x) => (
            <div className="upload-row" key={x.id}>
              <span>{x.file.name}</span>
              <b>{x.status}</b>
              {x.error && <small role="alert">{x.error}</small>}
              {!busy && x.status !== "Saved" && (
                <button
                  onClick={() => Q((q) => q.filter((i) => i.id !== x.id))}
                >
                  Remove from queue
                </button>
              )}
            </div>
          ))}
          <div className="ops-actions">
            <button
              className="primary"
              disabled={busy || queue.every((x) => x.status === "Saved")}
              onClick={run}
            >
              {busy ? "Saving…" : "Upload / retry remaining"}
            </button>
            {busy ? (
              <button
                onClick={() => {
                  cancel.current = true;
                }}
              >
                Cancel after current file
              </button>
            ) : (
              <button
                onClick={() => Q((q) => q.filter((x) => x.status !== "Saved"))}
              >
                Clear completed
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
