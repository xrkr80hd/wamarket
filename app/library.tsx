import LocationBadge from "./location-badge";
import { folderBrand, brandStyle } from "../lib/location-branding";
import UploadQueue from "./upload-queue";
import FolderNotepad from "./folder-notepad";
import FolderImagePicker from "./folder-image-picker";
import AssetAssignment from "./asset-assignment";
import { useState, useRef, useEffect } from "react";
import {
  useWorkspace,
  FilePreview,
  LocationSelect,
  RecordEditor,
} from "./operations";
import {
  saveRecord,
  addAsset,
  fileURL,
  locations,
  mutate,
  exportJSON,
  user,
} from "../lib/preview-store";
export default function Library({
  locationsMode = false,
  initialFolder = "",
}: any) {
  const s = useWorkspace(),
    [pageIndex, Page] = useState(0),
    [folder, F] = useState(initialFolder),
    [loc, L] = useState(""),
    [q, Q] = useState(""),
    [type, T] = useState(""),
    [view, V] = useState("Grid"),
    [sort, S] = useState("Newest"),
    [selection, C] = useState<string[]>([]),
    [edit, E] = useState<any>(null),
    [detail, D] = useState<any>(null),
    [busy, B] = useState(false),
    [error, Error] = useState(""),
    [unassigned, U] = useState(false),
    [archived, A] = useState(false),
    [newFolder, N] = useState(false),
    [name, Name] = useState(""),
    [folderArtwork, setFolderArtwork] = useState(""),
    [folderUploading, setFolderUploading] = useState(false),
    [assignAsset, AssignAsset] = useState<any>(null),
    [bulk, K] = useState(false),
    [target, J] = useState("");
  const press = useRef<any>();
  useEffect(() => {
    if (initialFolder) F(initialFolder);
  }, [initialFolder]);
  useEffect(() => Page(0), [folder, loc, q, type, view, archived, unassigned]);
  const root = s.records.find((r: any) => r.id === folder);
  const folders = s.records.filter(
    (r: any) =>
      r.kind === "folder" &&
      !!r.archived === archived &&
      (r.folder || "") === folder &&
      (!loc || r.dealership === loc),
  );
  let assets = s.records.filter(
    (r: any) =>
      r.kind === "asset" &&
      (!r.privateConversation ||
        [r.privateConversation, ...(r.sharedConversations || [])].some(
          (id: string) =>
            s.conversations.some(
              (c: any) => c.id === id && c.members.includes(user().id),
            ),
        )) &&
      !!r.archived === archived &&
      (!folder || (r.folder || "") === folder) &&
      (!loc || r.dealership === loc) &&
      (!unassigned ||
        (!r.project &&
          !r.dealership &&
          !r.folder &&
          !r.associations?.some((a: any) =>
            ["project", "video", "event", "dealership", "folder"].includes(
              a.kind,
            ),
          ))) &&
      (!type || r.type?.startsWith(type)) &&
      (!q ||
        (r.title + " " + r.originalName + " " + JSON.stringify(r.tags))
          .toLowerCase()
          .includes(q.toLowerCase())),
  );
  assets.sort((a: any, b: any) =>
    sort === "Name"
      ? a.title.localeCompare(b.title)
      : sort === "Size"
        ? (b.size || 0) - (a.size || 0)
        : String(b.updated || "").localeCompare(String(a.updated || "")),
  );
  function select(id: string) {
    C((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));
  }
  async function upload(files: FileList | null) {
    if (!files) return;
    B(true);
    Error("");
    try {
      for (const f of Array.from(files))
        await addAsset(f, {
          folder,
          dealership:
            loc ||
            s.records.find((r: any) => r.id === folder)?.dealership ||
            "",
        });
    } catch (e: any) {
      Error(e.message);
    } finally {
      B(false);
    }
  }
  const fileInput = useRef<HTMLInputElement>(null);
  function bulkApply(action: string) {
    try {
      if (
        action === "archive" &&
        !confirm("Archive selected assets? Original files are preserved.")
      )
        return;
      mutate(
        (s) =>
          (s.records = s.records.map((r: any) =>
            selection.includes(r.id)
              ? action === "archive"
                ? { ...r, archived: true }
                : action === "restore"
                  ? { ...r, archived: false }
                  : {
                      ...r,
                      folder: target,
                      dealership:
                        s.records.find((x: any) => x.id === target)
                          ?.dealership || "",
                    }
              : r,
          )),
        "Updated " + selection.length + " assets",
      );
      C([]);
      K(false);
    } catch (e: any) {
      Error(e.message);
    }
  }
  return (
    <>
      <UploadQueue
        metadata={{
          folder,
          dealership:
            loc ||
            s.records.find((r: any) => r.id === folder)?.dealership ||
            "",
        }}
      />
      <div className="ops-toolbar">
        <button
          className="primary"
          disabled={busy}
          onClick={() => fileInput.current?.click()}
        >
          {busy ? "Uploading…" : "＋ Upload files"}
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
        <button
          onClick={() => {
            setFolderArtwork("");
            Name("");
            N(true);
          }}
        >
          ＋ New folder
        </button>
        <input
          aria-label="Search assets"
          placeholder="Search files or tags…"
          value={q}
          onChange={(e) => Q(e.target.value)}
        />
        <LocationSelect
          value={loc}
          onChange={(v: string) => {
            L(v);
            F("");
          }}
        />
        <select
          aria-label="Media type"
          value={type}
          onChange={(e) => T(e.target.value)}
        >
          <option value="">All file types</option>
          {[
            ["image/", "Images"],
            ["video/", "Video"],
            ["audio/", "Audio"],
            ["application/", "Documents"],
          ].map(([v, n]) => (
            <option value={v} key={v}>
              {n}
            </option>
          ))}
        </select>
        <select
          aria-label="Asset view"
          value={view}
          onChange={(e) => V(e.target.value)}
        >
          <option>Grid</option>
          <option>List</option>
        </select>
        <select
          aria-label="Sort assets"
          value={sort}
          onChange={(e) => S(e.target.value)}
        >
          <option>Newest</option>
          <option>Name</option>
          <option>Size</option>
        </select>
        <button
          aria-pressed={unassigned}
          onClick={() => {
            U(!unassigned);
            F("");
            L("");
          }}
        >
          Unassigned
        </button>
        <button aria-pressed={archived} onClick={() => A(!archived)}>
          Archived
        </button>
      </div>
      <p>Upload now. Organize whenever you’re ready.</p>
      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}
      <div className="ops-breadcrumb">
        <button
          onClick={() => {
            F("");
            L("");
          }}
        >
          All files
        </button>
        {root && (
          <>
            <span> / </span>
            <button onClick={() => F(root.folder || "")}>
              ← Back to folders
            </button>
            <LocationBadge
              record={root}
              records={s.records}
              className="breadcrumb-badge"
            />
            <strong>{root.title}</strong>
            <button onClick={() => E(root)}>Edit folder / icon</button>
          </>
        )}
      </div>
      {root?.kind === "folder" && (
        <FolderNotepad key={root.id} folderId={root.id} />
      )}
      {locationsMode && !folder && !unassigned && (
        <>
          <div className="ops-cards">
            {locations.map(([n, address], i) => (
              <button
                className="card panel location-card branded-folder"
                style={
                  brandStyle(
                    folderBrand({ kind: "dealership", title: n }),
                  ) as any
                }
                key={n}
                onClick={() => {
                  F("locfolder-" + i);
                  L(n);
                }}
              >
                <LocationBadge
                  record={
                    s.records.find((r: any) => r.id === "locfolder-" + i) || {
                      kind: "dealership",
                      title: n,
                    }
                  }
                />
                <h3>{n}</h3>
                <p>{address}</p>
                <small>
                  {
                    s.records.filter(
                      (r: any) =>
                        r.kind === "folder" &&
                        r.folder === "locfolder-" + i &&
                        !r.archived,
                    ).length
                  }{" "}
                  project folders
                </small>
              </button>
            ))}
          </div>
        </>
      )}
      {!unassigned && (!locationsMode || folder) && !!folders.length && (
        <div className="ops-foldergrid">
          {folders.map((f: any) => (
            <div
              className="card panel branded-folder"
              style={brandStyle(folderBrand(f, s.records)) as any}
              data-select-id={f.id}
              key={f.id}
            >
              <button className="folder-open" onClick={() => F(f.id)}>
                <LocationBadge record={f} records={s.records} />
                <span>
                  <b>{f.title}</b>
                  <small>
                    {f.locationRoot
                      ? "Location library"
                      : f.dealership || "Shared folder"}
                  </small>
                </span>
              </button>
              <button onClick={() => E(f)}>Edit folder / icon</button>
            </div>
          ))}
        </div>
      )}
      {!!selection.length && (
        <div className="selectionbar">
          <b>{selection.length} selected</b>
          <button onClick={() => K(true)}>Move to folder</button>
          <button onClick={() => bulkApply(archived ? "restore" : "archive")}>
            {archived ? "Restore" : "Archive"}
          </button>
          <button onClick={() => C([])}>Clear</button>
        </div>
      )}
      <div className={view === "Grid" ? "ops-cards" : "ops-filelist"}>
        {assets.slice(pageIndex * 60, (pageIndex + 1) * 60).map((a: any) => (
          <article
            className={
              "card asset-card " +
              (selection.includes(a.id) ? "is-selected" : "")
            }
            data-select-id={a.id}
            key={a.id}
          >
            <label className="asset-select legacy-selection">
              <input
                type="checkbox"
                aria-label={"Select " + a.title}
                checked={selection.includes(a.id)}
                onChange={() => select(a.id)}
              />
            </label>
            {view === "Grid" && (
              <FilePreview id={a.id} type={a.type} controls={false} />
            )}
            <div className="asset-info">
              <button className="asset-title" onClick={() => D(a.id)}>
                {a.title}
              </button>
              <small>
                {a.type} · {((a.size || 0) / 1024 / 1024).toFixed(1)} MB
              </small>
              <p>
                {a.chatOrigins?.length
                  ? "From chat: " +
                    [
                      ...new Set(
                        a.chatOrigins.map((o: any) => o.conversationTitle),
                      ),
                    ].join(", ")
                  : ""}
              </p>
              <p>
                {a.dealership || "No location"} ·{" "}
                {a.associations?.length
                  ? a.associations.length + " associations"
                  : a.project
                    ? s.records.find((r: any) => r.id === a.project)?.title ||
                      "Linked project"
                    : "No campaign"}
              </p>
              <div className="ops-actions">
                <button onClick={() => E(a)}>Edit details</button>
                <button onClick={() => AssignAsset(a)}>Assign</button>
                <button
                  onClick={async () => {
                    const url = await fileURL(a.id);
                    if (url) {
                      const el = document.createElement("a");
                      el.href = url;
                      el.download = a.originalName || a.title;
                      el.click();
                    } else
                      Error(
                        "Original file is not available in this local preview",
                      );
                  }}
                >
                  Download original
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {assets.length > 60 && (
        <div className="ops-toolbar">
          <button disabled={pageIndex === 0} onClick={() => Page((p) => p - 1)}>
            Previous 60
          </button>
          <span>
            Page {pageIndex + 1} of {Math.ceil(assets.length / 60)}
          </span>
          <button
            disabled={(pageIndex + 1) * 60 >= assets.length}
            onClick={() => Page((p) => p + 1)}
          >
            Next 60
          </button>
        </div>
      )}
      {locationsMode && root && (
        <section className="card panel">
          <h2>{root.dealership} · marketing workspace</h2>
          <p>Campaigns, production, events and deadlines for this location.</p>
          {s.records
            .filter(
              (r: any) =>
                ["project", "video", "event", "content", "todo"].includes(
                  r.kind,
                ) &&
                !r.archived &&
                (r.dealership === root.dealership ||
                  r.dealerships?.includes(root.dealership)),
            )
            .map((r: any) => (
              <div className="report-row" data-select-id={r.id} key={r.id}>
                <div>
                  <b>{r.title}</b>
                  <small className="block">
                    {r.kind} · {r.status} · {r.date || "Date unconfirmed"}
                  </small>
                </div>
                <button onClick={() => E(r)}>Open / edit</button>
              </div>
            ))}
        </section>
      )}
      {!assets.length && (
        <div className="card empty">
          <h3>Room for your next creative.</h3>
          <p>Upload any file here. No campaign required.</p>
        </div>
      )}
      {newFolder && (
        <div className="overlay">
          <form
            className="modal"
            role="dialog"
            aria-modal="true"
            onSubmit={(e) => {
              e.preventDefault();
              if (folderUploading) return;
              try {
                saveRecord({
                  kind: "folder",
                  artwork: folderArtwork,
                  title: name,
                  folder,
                  dealership: root?.dealership || loc || "",
                  status: "Active",
                });
                Name("");
                N(false);
                setFolderArtwork("");
              } catch (e: any) {
                Error(e.message);
              }
            }}
          >
            <h2>Create project folder</h2>
            <p>Inside {root?.title || "Central library"}</p>
            <label>
              Folder name
              <input
                required
                maxLength={150}
                value={name}
                onChange={(e) => Name(e.target.value)}
              />
            </label>
            <FolderImagePicker
              value={folderArtwork}
              onChange={setFolderArtwork}
              onBusyChange={setFolderUploading}
              folder={{ dealership: root?.dealership || loc || "" }}
            />
            <div className="modalactions">
              <button
                type="button"
                disabled={folderUploading}
                onClick={() => N(false)}
              >
                Cancel
              </button>
              <button className="primary" disabled={folderUploading}>
                Create folder
              </button>
            </div>
          </form>
        </div>
      )}
      {bulk && (
        <div className="overlay">
          <section className="modal">
            <h2>Move selected assets</h2>
            <p>Folder placement is independent of campaign assignment.</p>
            <select
              aria-label="Destination folder"
              value={target}
              onChange={(e) => J(e.target.value)}
            >
              <option value="">Unfiled central library</option>
              {s.records
                .filter((r: any) => r.kind === "folder" && !r.archived)
                .map((r: any) => (
                  <option key={r.id} value={r.id}>
                    {r.dealership && r.title !== r.dealership
                      ? r.dealership + " / "
                      : ""}
                    {r.title}
                  </option>
                ))}
            </select>
            <div className="modalactions">
              <button onClick={() => K(false)}>Cancel</button>
              <button className="primary" onClick={() => bulkApply("move")}>
                Move files
              </button>
            </div>
          </section>
        </div>
      )}
      {assignAsset && (
        <AssetAssignment
          asset={assignAsset}
          onClose={() => AssignAsset(null)}
        />
      )}
      {edit && <RecordEditor record={edit} onClose={() => E(null)} />}
      {detail &&
        (() => {
          const a = s.records.find((r: any) => r.id === detail);
          return (
            <div className="overlay">
              <section className="modal wide" role="dialog" aria-modal="true">
                <div className="modalhead">
                  <h2>{a.title}</h2>
                  <button onClick={() => D(null)} aria-label="Close">
                    ×
                  </button>
                </div>
                <FilePreview id={a.id} type={a.type} />
                <p>Original: {a.originalName}</p>
                <p>{a.notes}</p>
                <h3>Chat history</h3>
                {(a.chatOrigins || []).map((o: any, i: number) => (
                  <p key={i}>
                    <b>{o.conversationTitle}</b> · {o.sentBy} ·{" "}
                    {new Date(o.sentAt).toLocaleString()}
                  </p>
                ))}
                <h3>Usage</h3>
                <p>
                  {a.project
                    ? "Campaign: " +
                      s.records.find((r: any) => r.id === a.project)?.title
                    : "Available for any campaign. No campaign assigned."}
                </p>
                <p>
                  Folder:{" "}
                  {s.records.find((r: any) => r.id === a.folder)?.title ||
                    "Unfiled"}
                </p>
                <div className="ops-actions">
                  <button
                    onClick={() => {
                      E(a);
                      D(null);
                    }}
                  >
                    Edit metadata
                  </button>
                  <button
                    onClick={() => saveRecord({ ...a, status: "Review" })}
                  >
                    Request review
                  </button>
                  <button
                    onClick={() => exportJSON(a, a.title + ".metadata.json")}
                  >
                    Export metadata
                  </button>
                </div>
              </section>
            </div>
          );
        })()}
    </>
  );
}
