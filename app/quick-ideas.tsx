import { useEffect, useState, useRef } from "react";
import {
  Plus,
  X,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { useWorkspace, FilePreview } from "./operations";
import { user, fileURL } from "../lib/preview-store";
import {
  refreshQuickIdeas,
  quickIdeaAction,
  uploadIdeaMedia,
  unreadIdeas,
  openQuickIdea,
} from "../lib/quick-ideas";
import TeamStatus from "./team-status";

export function QuickIdeasNotice({ onGo }: any) {
  const s = useWorkspace(),
    [error, E] = useState(""),
    ideas = s.records.filter((r: any) => r.kind === "quickidea" && !r.archived),
    unread = unreadIdeas(s);
  return (
    <section className="quick-ideas-notice">
      <div className="quick-notice-heading">
        <Lightbulb size={18} />
        <b>Quick Ideas</b>
        {unread.length > 0 && (
          <span className="idea-unread-count">{unread.length} new</span>
        )}
        <button onClick={onGo}>
          View all <ArrowRight size={13} />
        </button>
      </div>
      {unread.slice(0, 3).map((r: any) => (
        <div className="quick-notice-row" key={r.id}>
          <button
            onClick={() => {
              onGo();
              window.dispatchEvent(
                new CustomEvent("wam-open-quick-idea", { detail: r.id }),
              );
            }}
          >
            <b>{r.title}</b>
            <small>
              From {r.author}
              {r.attachments?.length
                ? " · " + r.attachments.length + " attachment(s)"
                : ""}
            </small>
          </button>
          <TeamStatus record={r} />
        </div>
      ))}
      {!unread.length && (
        <p className="quick-notice-empty">
          {ideas.length
            ? "You’re caught up."
            : "A place for a quick thought, photo or video."}
        </p>
      )}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}

export default function QuickIdeas({ active = false }: any) {
  const s = useWorkspace(),
    [compose, Compose] = useState(false),
    [draft, Draft] = useState<any>({}),
    [files, Files] = useState<File[]>([]),
    [busy, B] = useState(false),
    [error, E] = useState(""),
    [query, Q] = useState(""),
    [filter, F] = useState("All"),
    [opened, Open] = useState(""),
    [comment, C] = useState(""),
    [sync, Sync] = useState(""),
    [selected, Select] = useState<string[]>([]);
  const anchor = useRef(-1),
    press = useRef<any>(),
    longPress = useRef(false);
  const uploaded = useRef(new Map<File, any>()),
    input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const start = () => {
        Draft({});
        Files([]);
        Compose(true);
        E("");
      },
      open = (e: any) => {
        Open(e.detail);
        Compose(false);
      };
    window.addEventListener("wam-quick-idea", start);
    window.addEventListener("wam-open-quick-idea", open);
    let alive = true;
    const load = () =>
      refreshQuickIdeas()
        .then(() => {
          if (alive) Sync("");
        })
        .catch((e: any) => {
          if (alive) Sync("Can’t refresh ideas: " + e.message);
        });
    void load();
    const timer = setInterval(load, 5000);
    window.addEventListener("wam-account-session", load);
    return () => {
      alive = false;
      clearInterval(timer);
      window.removeEventListener("wam-quick-idea", start);
      window.removeEventListener("wam-open-quick-idea", open);
      window.removeEventListener("wam-account-session", load);
    };
  }, []);
  const ideas = s.records
    .filter(
      (r: any) =>
        r.kind === "quickidea" &&
        !!r.archived === (filter === "Archived") &&
        (!query ||
          (r.title + " " + r.notes + " " + r.author)
            .toLowerCase()
            .includes(query.toLowerCase())) &&
        (filter !== "New" || unreadIdeas(s).some((x) => x.id === r.id)) &&
        (filter !== "On it" ||
          r.acknowledgements?.[user().id]?.status === "onit"),
    )
    .sort((a: any, b: any) => b.created.localeCompare(a.created));
  const current = s.records.find((r: any) => r.id === opened),
    canManage = (r: any) =>
      r.authorId === user().id || user().role === "owner" || user().isAdmin;
  function selectIdea(id: string, index: number, range = false) {
    Select((old) =>
      range && anchor.current >= 0
        ? [
            ...new Set([
              ...old,
              ...ideas
                .slice(
                  Math.min(index, anchor.current),
                  Math.max(index, anchor.current) + 1,
                )
                .map((r: any) => r.id),
            ]),
          ]
        : old.includes(id)
          ? old.filter((x) => x !== id)
          : [...old, id],
    );
    anchor.current = index;
  }
  async function bulk(action: string, value?: string) {
    if (
      (action === "archive" || action === "restore") &&
      !confirm(
        (action === "archive" ? "Archive" : "Restore") +
          " " +
          selected.length +
          " idea(s)? Files will be kept.",
      )
    )
      return;
    B(true);
    let done = 0;
    const failures: string[] = [];
    for (const id of selected) {
      try {
        await quickIdeaAction({ action, id, value });
        done++;
      } catch (e: any) {
        failures.push(e.message);
      }
    }
    E(
      done +
        " updated" +
        (failures.length
          ? " · " + failures.length + " failed: " + failures.join("; ")
          : ""),
    );
    Select([]);
    B(false);
  }
  useEffect(() => {
    Select([]);
  }, [query, filter]);
  async function act(body: any) {
    E("");
    B(true);
    try {
      return await quickIdeaAction(body);
    } catch (e: any) {
      E(e.message);
    } finally {
      B(false);
    }
  }
  function addFiles(list: File[]) {
    const good = list.filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/"),
    );
    if (good.length !== list.length) E("Choose photos, screenshots or videos");
    Files((old) => [...old, ...good].slice(0, 12));
  }
  async function save(e: any) {
    e.preventDefault();
    B(true);
    E("");
    try {
      const attachments = [...(draft.attachments || [])];
      for (const file of files) {
        let media = uploaded.current.get(file);
        if (!media) {
          media = await uploadIdeaMedia(file);
          uploaded.current.set(file, media);
        }
        attachments.push(media);
      }
      await quickIdeaAction({
        action: "save",
        id: draft.id,
        title: draft.title,
        notes: draft.notes,
        attachments,
      });
      Compose(false);
      Files([]);
      Draft({});
    } catch (e: any) {
      E(e.message);
    } finally {
      B(false);
    }
  }
  function media(r: any) {
    return r.attachments?.length ? (
      <div className="quick-idea-media">
        {r.attachments.map((a: any) => (
          <div key={a.id}>
            <FilePreview id={a.id} type={a.type} />
            <button
              onClick={async () => {
                try {
                  const url = await fileURL(a.id);
                  if (!url) throw Error("File unavailable");
                  window.open(url, "_blank");
                } catch (e: any) {
                  E(e.message);
                }
              }}
            >
              {a.title}
            </button>
          </div>
        ))}
      </div>
    ) : null;
  }
  function reactions(r: any) {
    return (
      <div className="idea-reactions">
        {[1, -1].map((value) => {
          const Icon = value === 1 ? ThumbsUp : ThumbsDown;
          return (
            <button
              key={value}
              aria-label={value === 1 ? "Like idea" : "Dislike idea"}
              aria-pressed={r.votes?.[user().id] === value}
              disabled={busy || user().role === "viewer"}
              onClick={() =>
                act({
                  action: "react",
                  id: r.id,
                  value: r.votes?.[user().id] === value ? 0 : value,
                })
              }
            >
              <Icon size={14} />
              {Object.values(r.votes || {}).filter((v) => v === value).length}
            </button>
          );
        })}
        <button
          onClick={() => {
            Open(r.id);
            C("");
            E("");
          }}
        >
          Notes · {r.comments?.filter((c: any) => !c.archived).length || 0}
        </button>
      </div>
    );
  }
  return (
    <>
      {active && (
        <div className="quick-ideas-page">
          <div className="quick-ideas-toolbar">
            <button
              className="primary"
              disabled={user().role === "viewer"}
              onClick={openQuickIdea}
            >
              <Plus size={15} />
              Add quick idea
            </button>
            <input
              aria-label="Search quick ideas"
              placeholder="Find an idea…"
              value={query}
              onChange={(e) => Q(e.target.value)}
            />
            <select
              aria-label="Quick ideas filter"
              value={filter}
              onChange={(e) => F(e.target.value)}
            >
              {["All", "New", "On it", "Archived"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          <p className="quick-ideas-intro">
            A label, a note, a photo or a video. No dates or planning required.
          </p>
          {sync && <p role="status">{sync}</p>}
          {error && !compose && <p role="alert">{error}</p>}
          <div className="quick-ideas-grid">
            {ideas.map((r: any, index: number) => (
              <article
                className={
                  "quick-idea-card universal-selectable " +
                  (selected.includes(r.id) ? "universal-selected" : "")
                }
                key={r.id}
                onPointerDown={(e) => {
                  if (
                    e.pointerType === "mouse" ||
                    (e.target as HTMLElement).closest(
                      "button,input,select,a,textarea",
                    )
                  )
                    return;
                  longPress.current = false;
                  press.current = setTimeout(() => {
                    longPress.current = true;
                    selectIdea(r.id, index);
                  }, 550);
                }}
                onPointerUp={() => clearTimeout(press.current)}
                onPointerMove={() => clearTimeout(press.current)}
                onPointerCancel={() => clearTimeout(press.current)}
                onClickCapture={(e) => {
                  if (longPress.current) {
                    e.preventDefault();
                    e.stopPropagation();
                    longPress.current = false;
                  } else if (
                    selected.length &&
                    !(e.target as HTMLElement).closest(
                      "button,input,select,a,textarea",
                    )
                  ) {
                    e.preventDefault();
                    e.stopPropagation();
                    selectIdea(r.id, index, e.shiftKey);
                  }
                }}
              >
                <button
                  type="button"
                  className={
                    "selection-circle " +
                    (selected.includes(r.id) ? "checked" : "")
                  }
                  aria-label={"Select " + r.title}
                  aria-pressed={selected.includes(r.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectIdea(r.id, index, e.shiftKey);
                  }}
                >
                  ✓
                </button>
                <div className="quick-idea-heading">
                  <button
                    onClick={() => {
                      Open(r.id);
                      C("");
                      E("");
                    }}
                  >
                    <h2>{r.title}</h2>
                  </button>
                  <small>
                    {r.author} ·{" "}
                    {new Date(r.created).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </small>
                </div>
                {r.notes && <p className="idea-note-preview">{r.notes}</p>}
                {media(r)}
                <TeamStatus record={r} />
                {reactions(r)}
                {canManage(r) && (
                  <details className="idea-manage">
                    <summary>More</summary>
                    <button
                      onClick={() => {
                        Draft({ ...r });
                        Files([]);
                        Compose(true);
                      }}
                    >
                      Edit idea
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => {
                        if (
                          confirm(
                            r.archived
                              ? "Restore this idea?"
                              : "Archive this idea? Attached files will be kept.",
                          )
                        )
                          void act({
                            action: r.archived ? "restore" : "archive",
                            id: r.id,
                          });
                      }}
                    >
                      {r.archived ? "Restore" : "Archive"}
                    </button>
                  </details>
                )}
              </article>
            ))}
          </div>
          {!ideas.length && (
            <div className="quick-ideas-empty">
              <Lightbulb size={24} />
              <h2>
                {filter === "All"
                  ? "Have something in mind?"
                  : "No ideas here yet"}
              </h2>
              <p>Drop a quick idea here and the team can pick it up.</p>
              <button onClick={openQuickIdea}>Add an idea</button>
            </div>
          )}
        </div>
      )}
      {!!selected.length && active && (
        <div
          className="universal-bulkbar"
          role="toolbar"
          aria-label="Selected quick ideas"
        >
          <b>{selected.length} selected</b>
          <button disabled={busy} onClick={() => void bulk("ack", "seen")}>
            Seen
          </button>
          <button disabled={busy} onClick={() => void bulk("ack", "onit")}>
            On it
          </button>
          <button
            disabled={busy}
            onClick={() =>
              void bulk(filter === "Archived" ? "restore" : "archive")
            }
          >
            {filter === "Archived" ? "Restore" : "Archive"}
          </button>
          <button onClick={() => Select(ideas.map((r: any) => r.id))}>
            Select all
          </button>
          <button onClick={() => Select([])}>Clear</button>
        </div>
      )}
      {compose && (
        <div className="overlay">
          <section
            className="modal quick-idea-composer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-idea-title"
          >
            <div className="modalhead">
              <h2 id="quick-idea-title">
                {draft.id ? "Edit idea" : "Quick idea"}
              </h2>
              <button
                disabled={busy}
                aria-label="Close quick idea"
                onClick={() => Compose(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={save}
              onPaste={(e) => {
                const pasted = Array.from(e.clipboardData.files);
                if (pasted.length) {
                  e.preventDefault();
                  addFiles(pasted);
                }
              }}
            >
              <label>
                Give it a quick label
                <input
                  required
                  autoFocus
                  maxLength={180}
                  value={draft.title || ""}
                  onChange={(e) => Draft({ ...draft, title: e.target.value })}
                  placeholder="What caught your eye?"
                />
              </label>
              <label>
                Note <small>optional</small>
                <textarea
                  rows={3}
                  maxLength={4000}
                  value={draft.notes || ""}
                  onChange={(e) => Draft({ ...draft, notes: e.target.value })}
                  placeholder="Anything you want the team to know…"
                />
              </label>
              <input
                ref={input}
                type="file"
                accept="image/*,video/*"
                multiple
                hidden
                onChange={(e) => {
                  addFiles(Array.from(e.target.files || []));
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                className="quick-attach"
                disabled={busy}
                onClick={() => input.current?.click()}
              >
                <Paperclip size={16} />
                Add photo or video
              </button>
              <small className="quick-paste-hint">
                You can also paste a screenshot here.
              </small>
              <div className="quick-attached-files">
                {(draft.attachments || []).map((a: any) => (
                  <div key={a.id}>
                    <span>{a.title}</span>
                    <button
                      type="button"
                      aria-label={"Remove " + a.title}
                      onClick={() =>
                        Draft({
                          ...draft,
                          attachments: draft.attachments.filter(
                            (x: any) => x.id !== a.id,
                          ),
                        })
                      }
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {files.map((f, i) => (
                  <div key={i}>
                    <span>{f.name}</span>
                    <button
                      type="button"
                      disabled={busy}
                      aria-label={"Remove " + f.name}
                      onClick={() => Files(files.filter((_, j) => j !== i))}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              {error && <p role="alert">{error}</p>}
              <div className="modalactions">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => Compose(false)}
                >
                  Cancel
                </button>
                <button className="primary" disabled={busy}>
                  {busy ? "Saving…" : draft.id ? "Save changes" : "Share idea"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
      {current && !compose && (
        <div className="overlay">
          <section
            className="modal quick-idea-detail"
            role="dialog"
            aria-modal="true"
            aria-labelledby="idea-detail-title"
          >
            <div className="modalhead">
              <div>
                <h2 id="idea-detail-title">{current.title}</h2>
                <small>From {current.author}</small>
              </div>
              <button aria-label="Close idea" onClick={() => Open("")}>
                <X size={18} />
              </button>
            </div>
            {current.notes && <p className="prewrap">{current.notes}</p>}
            {media(current)}
            <TeamStatus record={current} />
            {reactions(current)}
            <div className="idea-comments">
              {(current.comments || [])
                .filter((c: any) => !c.archived)
                .map((c: any) => (
                  <article key={c.id}>
                    <small>{c.by}</small>
                    <p>{c.text}</p>
                    {(c.authorId === user().id ||
                      user().role === "owner" ||
                      user().isAdmin) && (
                      <button
                        onClick={() => {
                          if (confirm("Remove this note?"))
                            void act({
                              id: current.id,
                              action: "delete-comment",
                              commentId: c.id,
                            });
                        }}
                      >
                        Remove note
                      </button>
                    )}
                  </article>
                ))}
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const result = await act({
                  id: current.id,
                  action: "comment",
                  text: comment,
                });
                if (result) C("");
              }}
            >
              <label>
                Add a note
                <textarea
                  required
                  rows={2}
                  value={comment}
                  onChange={(e) => C(e.target.value)}
                />
              </label>
              <button className="primary" disabled={busy || !comment.trim()}>
                Add note
              </button>
            </form>
            {error && <p role="alert">{error}</p>}
          </section>
        </div>
      )}
    </>
  );
}
