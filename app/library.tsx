import LocationBadge from "./location-badge";
import FolderNotepad from "./folder-notepad";
import FolderImagePicker from "./folder-image-picker";
import { useState, useRef, useEffect, useMemo } from "react";
import { useWorkspace, FilePreview, RecordEditor } from "./operations";
import {
  saveRecord,
  addAsset,
  fileURL,
  downloadFile,
  locations,
  mutate,
  user,
} from "../lib/preview-store";
import "../library.css";

// Every file and folder belongs to one organization library. The group library
// is virtual: nothing needs to be written for it to exist.
export const GROUP_LIBRARY = "locfolder-group";
const GROUP_NAME = "Walker Automotive Group";
const libraries = [
  { id: GROUP_LIBRARY, title: GROUP_NAME, dealership: GROUP_NAME },
  ...locations.map(([title], i) => ({
    id: "locfolder-" + i,
    title,
    dealership: title,
  })),
];
const libraryIds = new Set(libraries.map((l) => l.id));
const DRAG_TYPE = "application/x-wam-items";
const kinds = [
  ["", "All files"],
  ["logo", "Logos"],
  ["image/", "Graphics"],
  ["video/", "Video"],
  ["doc", "Documents"],
] as const;
const sizes = { S: 130, M: 190, L: 280 } as const;

function isLogo(a: any) {
  return /logo/i.test(
    a.title + " " + (a.originalName || "") + " " + (a.tags || []).join(" "),
  );
}
function matchesType(a: any, type: string) {
  if (!type) return true;
  if (type === "logo") return isLogo(a);
  if (type === "doc") return !/^(image|video|audio)\//.test(a.type || "");
  return (a.type || "").startsWith(type);
}

export default function Library({ initialFolder = "" }: any) {
  const s = useWorkspace(),
    me = user(),
    [folder, setFolder] = useState(initialFolder),
    [q, setQ] = useState(""),
    [everywhere, setEverywhere] = useState(false),
    [type, setType] = useState(""),
    [view, setView] = useState<"Grid" | "List">("Grid"),
    [size, setSize] = useState<keyof typeof sizes>("M"),
    [archived, setArchived] = useState(false),
    [selection, setSelection] = useState<string[]>([]),
    [lastClicked, setLastClicked] = useState(""),
    [dropTarget, setDropTarget] = useState(""),
    [lightbox, setLightbox] = useState(-1),
    [moving, setMoving] = useState<string[] | null>(null),
    [newFolder, setNewFolder] = useState(false),
    [rename, setRename] = useState<any>(null),
    [edit, setEdit] = useState<any>(null),
    [busy, setBusy] = useState(""),
    [error, setError] = useState(""),
    [toast, setToast] = useState<any>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const touchX = useRef(0);
  useEffect(() => {
    if (initialFolder) setFolder(initialFolder);
  }, [initialFolder]);
  useEffect(() => {
    setSelection([]);
    setLightbox(-1);
  }, [folder, archived]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 7000);
    return () => clearTimeout(t);
  }, [toast]);

  const byId = useMemo(() => {
    const m = new Map<string, any>();
    for (const r of s.records) m.set(r.id, r);
    return m;
  }, [s.records]);
  const rootFor = (dealership: string) =>
    libraries.find((l) => l.dealership === dealership)?.id || GROUP_LIBRARY;
  // Where an item lives, without rewriting old records: its folder if that
  // still exists, otherwise its dealership's library, otherwise the group one.
  function parentOf(r: any): string {
    if (r.locationRoot || libraryIds.has(r.id)) return "";
    if (
      r.folder &&
      (libraryIds.has(r.folder) || byId.get(r.folder)?.kind === "folder")
    )
      return r.folder;
    return rootFor(r.dealership || "");
  }
  function chain(id: string) {
    const out: any[] = [];
    const seen = new Set<string>();
    let cur = id;
    while (cur && !seen.has(cur)) {
      seen.add(cur);
      const lib = libraries.find((l) => l.id === cur);
      if (lib) {
        out.unshift(lib);
        break;
      }
      const f = byId.get(cur);
      if (!f) break;
      out.unshift(f);
      cur = parentOf(f);
    }
    return out;
  }
  const libraryOf = (id: string) => chain(id)[0]?.id || GROUP_LIBRARY;
  const dealershipOf = (id: string) =>
    libraries.find((l) => l.id === libraryOf(id))?.dealership || GROUP_NAME;
  const isInside = (id: string, ancestor: string) =>
    chain(id).some((c) => c.id === ancestor);
  const visible = (r: any) =>
    !!r.archived === archived &&
    (!r.privateConversation ||
      [r.privateConversation, ...(r.sharedConversations || [])].some(
        (id: string) =>
          s.conversations.some(
            (c: any) => c.id === id && c.members.includes(me.id),
          ),
      ));
  const allFolders = s.records.filter(
    (r: any) =>
      r.kind === "folder" && !r.locationRoot && !libraryIds.has(r.id),
  );
  const allAssets = s.records.filter((r: any) => r.kind === "asset");
  const currentLib = folder ? libraryOf(folder) : "";
  const crumbs = folder ? chain(folder) : [];

  const query = q.trim().toLowerCase();
  const searching = !!query || !!type;
  const matches = (r: any) =>
    !query ||
    (
      r.title +
      " " +
      (r.originalName || "") +
      " " +
      JSON.stringify(r.tags || [])
    )
      .toLowerCase()
      .includes(query);
  const inScope = (r: any) =>
    everywhere || !folder || libraryOf(parentOf(r)) === currentLib;
  const folders = allFolders
    .filter(
      (f: any) =>
        visible(f) &&
        (searching
          ? !type && matches(f) && inScope(f)
          : parentOf(f) === folder),
    )
    .sort((a: any, b: any) => a.title.localeCompare(b.title));
  const assets = allAssets
    .filter(
      (a: any) =>
        visible(a) &&
        matchesType(a, type) &&
        (searching ? matches(a) && inScope(a) : parentOf(a) === folder),
    )
    .sort((a: any, b: any) =>
      String(b.updated || "").localeCompare(String(a.updated || "")),
    );
  const countIn = (libId: string) =>
    allAssets.filter(
      (a: any) =>
        !a.archived && visible(a) && libraryOf(parentOf(a)) === libId,
    ).length;
  const canEdit = (r: any) =>
    me.role === "owner" || !r.createdById || r.createdById === me.id;
  const allowBulk = selection
    .map((id) => byId.get(id))
    .every((r) => r && canEdit(r));

  function move(ids: string[], target: string) {
    setError("");
    const blocked = ids.filter(
      (id) => byId.get(id)?.kind === "folder" && isInside(target, id),
    );
    const moveIds = ids.filter(
      (id) =>
        !blocked.includes(id) &&
        byId.get(id) &&
        canEdit(byId.get(id)) &&
        parentOf(byId.get(id)) !== target,
    );
    if (blocked.length)
      setError("A folder can’t go inside itself or one of its own folders.");
    if (!moveIds.length) return;
    const before = moveIds.map((id) => {
      const r = byId.get(id);
      return { id, folder: r.folder || "", dealership: r.dealership || "" };
    });
    const dealership = dealershipOf(target);
    try {
      mutate(
        (st) => {
          st.records = st.records.map((r: any) =>
            moveIds.includes(r.id)
              ? {
                  ...r,
                  folder: target,
                  dealership,
                  updated: new Date().toISOString(),
                }
              : r,
          );
        },
        "Moved " + moveIds.length + (moveIds.length === 1 ? " item" : " items"),
      );
      const name = chain(target).at(-1)?.title || "folder";
      setToast({ text: `Moved ${moveIds.length} to ${name}`, before });
      setSelection([]);
    } catch (e: any) {
      setError(e.message);
    }
  }
  function undo() {
    const before = toast?.before;
    if (!before) return;
    try {
      mutate((st) => {
        st.records = st.records.map((r: any) => {
          const b = before.find((x: any) => x.id === r.id);
          return b ? { ...r, folder: b.folder, dealership: b.dealership } : r;
        });
      }, "Undid move");
      setToast(null);
    } catch (e: any) {
      setError(e.message);
    }
  }
  async function upload(files: FileList | File[] | null, target = folder) {
    if (!files || !files.length) return;
    const dest = target || GROUP_LIBRARY;
    setBusy(`Uploading ${files.length}…`);
    setError("");
    try {
      for (const f of Array.from(files))
        await addAsset(f, { folder: dest, dealership: dealershipOf(dest) });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy("");
    }
  }
  function archiveItems(ids: string[], restore = false) {
    const nonEmpty = ids.filter(
      (id) =>
        byId.get(id)?.kind === "folder" &&
        s.records.some((r: any) => !r.archived && parentOf(r) === id),
    );
    if (
      !restore &&
      !confirm(
        nonEmpty.length
          ? "This folder still has files. They’ll move up one level, then the folder is archived. Continue?"
          : `Archive ${ids.length} item${ids.length === 1 ? "" : "s"}? Originals are kept and can be restored.`,
      )
    )
      return;
    try {
      mutate(
        (st) => {
          st.records = st.records.map((r: any) => {
            if (ids.includes(r.id)) return { ...r, archived: !restore };
            const p = parentOf(r);
            if (!restore && !r.archived && nonEmpty.includes(p)) {
              const up = parentOf(byId.get(p));
              return { ...r, folder: up, dealership: dealershipOf(up) };
            }
            return r;
          });
        },
        (restore ? "Restored " : "Archived ") + ids.length + " items",
      );
      setSelection([]);
    } catch (e: any) {
      setError(e.message);
    }
  }
  async function download(a: any) {
    try {
      await downloadFile(a.id, a.originalName || a.title);
    } catch (e: any) {
      setError(e.message);
    }
  }
  function pick(id: string, shift: boolean) {
    const order = [...folders, ...assets].map((r: any) => r.id);
    if (shift && lastClicked && order.includes(lastClicked)) {
      const [a, b] = [order.indexOf(lastClicked), order.indexOf(id)].sort(
        (x, y) => x - y,
      );
      setSelection((v) => [...new Set([...v, ...order.slice(a, b + 1)])]);
    } else
      setSelection((v) =>
        v.includes(id) ? v.filter((x) => x !== id) : [...v, id],
      );
    setLastClicked(id);
  }
  function open(id: string) {
    setError("");
    setFolder(id);
    setQ("");
    setType("");
  }

  // Drag and drop: dragging a selected item drags the whole selection.
  // Files dragged in from the desktop upload into the drop target.
  function dragStart(e: React.DragEvent, id: string) {
    const ids = selection.includes(id) ? selection : [id];
    e.dataTransfer.setData(DRAG_TYPE, JSON.stringify(ids));
    e.dataTransfer.effectAllowed = "move";
  }
  function dropProps(target: string) {
    return {
      onDragOver: (e: React.DragEvent) => {
        const t = e.dataTransfer.types;
        if (!t.includes(DRAG_TYPE) && !t.includes("Files")) return;
        e.preventDefault();
        e.stopPropagation();
        if (dropTarget !== target) setDropTarget(target);
      },
      onDragLeave: (e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node))
          setDropTarget((d) => (d === target ? "" : d));
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDropTarget("");
        const raw = e.dataTransfer.getData(DRAG_TYPE);
        if (raw) move(JSON.parse(raw), target);
        else if (e.dataTransfer.files.length)
          upload(e.dataTransfer.files, target);
      },
      "data-drop": dropTarget === target ? "over" : undefined,
    };
  }

  const shown = lightbox >= 0 ? assets[lightbox] : null;
  useEffect(() => {
    if (lightbox < 0) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(-1);
      if (e.key === "ArrowRight")
        setLightbox((i) => Math.min(i + 1, assets.length - 1));
      if (e.key === "ArrowLeft") setLightbox((i) => Math.max(i - 1, 0));
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [lightbox, assets.length]);

  const toastEl = toast && (
    <div className="lib-toast" role="status">
      {toast.text}
      <button onClick={undo}>Undo</button>
    </div>
  );

  // Landing page: one tile per organization library.
  if (!folder && !searching)
    return (
      <div className="lib">
        <div className="lib-toolbar">
          <input
            className="lib-search"
            aria-label="Search all libraries"
            placeholder="Search all files…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setEverywhere(true);
            }}
          />
        </div>
        <TypeChips
          type={type}
          setType={(t) => {
            setType(t);
            setEverywhere(true);
          }}
        />
        <div className="lib-tiles">
          {libraries.map((l) => {
            const n = countIn(l.id);
            return (
              <button
                key={l.id}
                className="lib-tile"
                onClick={() => open(l.id)}
                {...dropProps(l.id)}
              >
                {l.id === GROUP_LIBRARY ? (
                  <img
                    className="location-badge"
                    src="/walker-suite-logo.png"
                    alt=""
                  />
                ) : (
                  <LocationBadge
                    record={{ kind: "dealership", title: l.dealership }}
                    records={s.records}
                  />
                )}
                <b>{l.title}</b>
                <small>
                  {n} file{n === 1 ? "" : "s"}
                </small>
              </button>
            );
          })}
        </div>
        {toastEl}
      </div>
    );

  return (
    <div className="lib lib-browser">
      <aside className="lib-side" aria-label="Libraries">
        <button className="lib-side-all" onClick={() => open("")}>
          ← All libraries
        </button>
        {libraries.map((l) => (
          <button
            key={l.id}
            className={currentLib === l.id ? "selected" : ""}
            onClick={() => open(l.id)}
            {...dropProps(l.id)}
          >
            <span>{l.title}</span>
            <small>{countIn(l.id)}</small>
          </button>
        ))}
      </aside>
      <section
        className="lib-main"
        {...dropProps(folder || GROUP_LIBRARY)}
        data-drop={undefined}
        data-page-drop={
          dropTarget === (folder || GROUP_LIBRARY) ? "over" : undefined
        }
      >
        <div className="lib-crumbs" role="navigation" aria-label="Folder path">
          <button onClick={() => open("")}>Assets</button>
          {crumbs.map((c) => (
            <span key={c.id}>
              <span aria-hidden="true">›</span>
              <button onClick={() => open(c.id)} {...dropProps(c.id)}>
                {c.title}
              </button>
            </span>
          ))}
        </div>
        <div className="lib-toolbar">
          <button
            className="primary"
            disabled={!!busy}
            onClick={() => fileInput.current?.click()}
          >
            {busy || "＋ Upload"}
          </button>
          <input
            type="file"
            ref={fileInput}
            multiple
            hidden
            onChange={(e) => {
              upload(e.target.files);
              e.target.value = "";
            }}
          />
          <button onClick={() => setNewFolder(true)}>＋ New folder</button>
          <input
            className="lib-search"
            aria-label="Search files"
            placeholder={
              everywhere ? "Search all libraries…" : "Search this library…"
            }
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <label className="lib-check">
            <input
              type="checkbox"
              checked={everywhere}
              onChange={(e) => setEverywhere(e.target.checked)}
            />
            All libraries
          </label>
          <div className="lib-seg" role="group" aria-label="View">
            {(Object.keys(sizes) as (keyof typeof sizes)[]).map((k) => (
              <button
                key={k}
                aria-pressed={view === "Grid" && size === k}
                onClick={() => {
                  setView("Grid");
                  setSize(k);
                }}
              >
                {k}
              </button>
            ))}
            <button
              aria-pressed={view === "List"}
              onClick={() => setView("List")}
            >
              List
            </button>
          </div>
          <button aria-pressed={archived} onClick={() => setArchived(!archived)}>
            Archived
          </button>
        </div>
        <TypeChips type={type} setType={setType} />
        {error && (
          <p className="notice" role="alert">
            {error}
          </p>
        )}
        {!!selection.length && (
          <div className="lib-selbar">
            <b>{selection.length} selected</b>
            {allowBulk && (
              <button onClick={() => setMoving(selection)}>Move to…</button>
            )}
            {allowBulk && (
              <button onClick={() => archiveItems(selection, archived)}>
                {archived ? "Restore" : "Archive"}
              </button>
            )}
            <button onClick={() => setSelection([])}>Clear</button>
            <small>Tip: drag selected items onto a folder.</small>
          </div>
        )}
        {!searching && byId.get(folder)?.kind === "folder" && (
          <details className="lib-notes">
            <summary>Folder notes</summary>
            <FolderNotepad key={folder} folderId={folder} />
          </details>
        )}
        <div
          className={view === "Grid" ? "lib-grid" : "lib-list"}
          style={{ ["--lib-size" as any]: sizes[size] + "px" }}
        >
          {folders.map((f: any) => (
            <article
              key={f.id}
              className={
                "lib-item lib-folder" +
                (selection.includes(f.id) ? " is-selected" : "")
              }
              draggable={canEdit(f)}
              onDragStart={(e) => dragStart(e, f.id)}
              {...dropProps(f.id)}
            >
              <input
                type="checkbox"
                className="lib-pick"
                aria-label={"Select folder " + f.title}
                checked={selection.includes(f.id)}
                onClick={(e) => pick(f.id, e.shiftKey)}
                readOnly
              />
              <button
                className="lib-thumb"
                aria-label={"Open folder " + f.title}
                onClick={() => open(f.id)}
              >
                {f.artwork ? (
                  <LocationBadge record={f} records={s.records} />
                ) : (
                  <span className="lib-folder-icon" aria-hidden="true" />
                )}
              </button>
              <div className="lib-meta">
                <b title={f.title}>{f.title}</b>
                <small>
                  {searching
                    ? chain(parentOf(f))
                        .map((c) => c.title)
                        .join(" › ")
                    : "Folder"}
                </small>
              </div>
              {canEdit(f) && (
                <ItemMenu>
                  <button onClick={() => setMoving([f.id])}>Move to…</button>
                  <button onClick={() => setRename(f)}>Rename</button>
                  <button onClick={() => setEdit(f)}>Change artwork</button>
                  <button onClick={() => archiveItems([f.id], archived)}>
                    {archived ? "Restore" : "Archive"}
                  </button>
                </ItemMenu>
              )}
            </article>
          ))}
          {assets.map((a: any, i: number) => (
            <article
              key={a.id}
              className={
                "lib-item" + (selection.includes(a.id) ? " is-selected" : "")
              }
              draggable={canEdit(a)}
              onDragStart={(e) => dragStart(e, a.id)}
            >
              <input
                type="checkbox"
                className="lib-pick"
                aria-label={"Select " + a.title}
                checked={selection.includes(a.id)}
                onClick={(e) => pick(a.id, e.shiftKey)}
                readOnly
              />
              <button
                className="lib-thumb"
                aria-label={"Preview " + a.title}
                onClick={() => setLightbox(i)}
              >
                <FilePreview id={a.id} type={a.type} controls={false} />
              </button>
              <div className="lib-meta">
                <b title={a.title}>{a.title}</b>
                <small>
                  {searching
                    ? chain(parentOf(a))
                        .map((c) => c.title)
                        .join(" › ")
                    : ((a.size || 0) / 1024 / 1024).toFixed(1) + " MB"}
                </small>
              </div>
              <ItemMenu>
                <button onClick={() => setLightbox(i)}>Preview</button>
                <button onClick={() => download(a)}>Download</button>
                {canEdit(a) && (
                  <>
                    <button onClick={() => setMoving([a.id])}>Move to…</button>
                    <button onClick={() => setRename(a)}>Rename</button>
                    <button onClick={() => setEdit(a)}>Edit details</button>
                    <button onClick={() => archiveItems([a.id], archived)}>
                      {archived ? "Restore" : "Archive"}
                    </button>
                  </>
                )}
              </ItemMenu>
            </article>
          ))}
        </div>
        {!folders.length && !assets.length && (
          <div className="lib-empty">
            <h3>{searching ? "No matches." : "This folder is empty."}</h3>
            {!searching && (
              <p>Drag files here or use Upload. Any file type works.</p>
            )}
          </div>
        )}
      </section>

      {shown && (
        <div
          className="lib-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={shown.title}
          onClick={(e) => e.target === e.currentTarget && setLightbox(-1)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (dx < -50)
              setLightbox((i) => Math.min(i + 1, assets.length - 1));
            if (dx > 50) setLightbox((i) => Math.max(i - 1, 0));
          }}
        >
          <header>
            <b>{shown.title}</b>
            <span>
              {lightbox + 1} / {assets.length}
            </span>
            <button onClick={() => download(shown)}>Download</button>
            <button aria-label="Close" onClick={() => setLightbox(-1)}>
              ✕
            </button>
          </header>
          <button
            className="lib-nav prev"
            aria-label="Previous"
            disabled={lightbox === 0}
            onClick={() => setLightbox(lightbox - 1)}
          >
            ‹
          </button>
          <div className="lib-stage">
            <FilePreview key={shown.id} id={shown.id} type={shown.type} />
          </div>
          <button
            className="lib-nav next"
            aria-label="Next"
            disabled={lightbox >= assets.length - 1}
            onClick={() => setLightbox(lightbox + 1)}
          >
            ›
          </button>
        </div>
      )}

      {moving && (
        <MoveDialog
          ids={moving}
          options={[
            ...libraries.map((l) => ({ id: l.id, label: l.title })),
            ...allFolders
              .filter((f: any) => !f.archived)
              .map((f: any) => ({
                id: f.id,
                label: chain(f.id)
                  .map((c) => c.title)
                  .join(" › "),
              })),
          ]
            .filter((o) => !moving.some((id) => isInside(o.id, id)))
            .sort((a, b) => a.label.localeCompare(b.label))}
          onClose={() => setMoving(null)}
          onMove={(target: string) => {
            move(moving, target);
            setMoving(null);
          }}
        />
      )}

      {newFolder && (
        <NewFolder
          where={crumbs.at(-1)?.title || ""}
          dealership={dealershipOf(folder)}
          onClose={() => setNewFolder(false)}
          onCreate={(title: string, artwork: string) => {
            try {
              saveRecord({
                kind: "folder",
                title,
                artwork,
                folder,
                dealership: dealershipOf(folder),
                status: "Active",
              });
              setNewFolder(false);
            } catch (e: any) {
              setError(e.message);
            }
          }}
        />
      )}

      {rename && (
        <div className="overlay">
          <form
            className="modal"
            role="dialog"
            aria-modal="true"
            onSubmit={(e) => {
              e.preventDefault();
              const title = String(
                new FormData(e.currentTarget).get("title") || "",
              ).trim();
              try {
                saveRecord({ ...rename, title });
                setRename(null);
              } catch (err: any) {
                setError(err.message);
              }
            }}
          >
            <h2>Rename</h2>
            <label>
              Name
              <input
                name="title"
                required
                maxLength={150}
                defaultValue={rename.title}
                autoFocus
              />
            </label>
            <div className="modalactions">
              <button type="button" onClick={() => setRename(null)}>
                Cancel
              </button>
              <button className="primary">Save</button>
            </div>
          </form>
        </div>
      )}
      {edit && <RecordEditor record={edit} onClose={() => setEdit(null)} />}
      {toastEl}
    </div>
  );
}

function TypeChips({
  type,
  setType,
}: {
  type: string;
  setType: (t: string) => void;
}) {
  return (
    <div className="lib-chips" role="group" aria-label="File type">
      {kinds.map(([v, n]) => (
        <button
          key={v}
          aria-pressed={type === v}
          className={v === "logo" ? "lib-chip-logo" : ""}
          onClick={() => setType(v)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

function ItemMenu({ children }: any) {
  return (
    <details className="lib-menu">
      <summary aria-label="Actions">⋯</summary>
      <div
        onClick={(e) => {
          (e.currentTarget.parentElement as HTMLDetailsElement).open = false;
        }}
      >
        {children}
      </div>
    </details>
  );
}

function MoveDialog({ ids, options, onClose, onMove }: any) {
  const [target, setTarget] = useState("");
  return (
    <div className="overlay">
      <section className="modal" role="dialog" aria-modal="true">
        <h2>
          Move {ids.length} item{ids.length === 1 ? "" : "s"} to…
        </h2>
        <label>
          Destination
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            autoFocus
          >
            <option value="" disabled>
              Choose a library or folder
            </option>
            {options.map((o: any) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <div className="modalactions">
          <button onClick={onClose}>Cancel</button>
          <button
            className="primary"
            disabled={!target}
            onClick={() => onMove(target)}
          >
            Move
          </button>
        </div>
      </section>
    </div>
  );
}

function NewFolder({ where, dealership, onClose, onCreate }: any) {
  const [name, setName] = useState(""),
    [artwork, setArtwork] = useState(""),
    [uploading, setUploading] = useState(false);
  return (
    <div className="overlay">
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        onSubmit={(e) => {
          e.preventDefault();
          if (!uploading) onCreate(name.trim(), artwork);
        }}
      >
        <h2>New folder</h2>
        <p>Inside {where}</p>
        <label>
          Folder name
          <input
            required
            maxLength={150}
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <FolderImagePicker
          value={artwork}
          onChange={setArtwork}
          onBusyChange={setUploading}
          folder={{ dealership }}
        />
        <div className="modalactions">
          <button type="button" disabled={uploading} onClick={onClose}>
            Cancel
          </button>
          <button className="primary" disabled={uploading}>
            Create folder
          </button>
        </div>
      </form>
    </div>
  );
}
