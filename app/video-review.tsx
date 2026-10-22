import TeamStatus from "./team-status";
import {
  addVideoVersion,
  addDriveVideoVersion,
  addAnnotation,
  updateAnnotation,
  archiveAnnotation,
  canManageAnnotation,
  setAnnotationStatus,
  reviewVersion,
} from "../lib/review-actions";
import { useState, useEffect, useRef } from "react";
import { useWorkspace, RecordEditor } from "./operations";
import {
  getState,
  user,
  mutate,
  saveRecord,
  addAsset,
  fileURL,
  exportJSON,
  conversation,
} from "../lib/preview-store";
const playbackRates = [0.25, 0.5, 1, 1.5, 2];
import { timecode, reviewPlaybackURL, publicDriveEmbedURL } from "../lib/drive-review.js";
export { timecode };
export default function VideoReview({ initial }: any) {
  const s = useWorkspace(),
    videos = s.records.filter((r: any) => r.kind === "video" && !r.archived),
    [id, ID] = useState(initial || videos[0]?.id || ""),
    [version, V] = useState(() => {
      try {
        return (
          JSON.parse(sessionStorage.getItem("wam-seek") || "null")?.versionId ||
          ""
        );
      } catch {
        return "";
      }
    }),
    [url, U] = useState(""),
    [driveOpen, DriveOpen] = useState(false),
    [driveLink, DriveLink] = useState(""),
    [ready, Ready] = useState(false),
    [speed, Speed] = useState(2),
    [draftMarker, Marker] = useState(false),
    [editingMarkerId, EditingMarker] = useState<string | null>(null),
    [now, N] = useState(0),
    [duration, Dur] = useState(0),
    [manualTiming, ManualTiming] = useState(false),
    [start, I] = useState(0),
    [end, O] = useState<number | null>(null),
    [type, T] = useState("GENERAL NOTE"),
    [text, Text] = useState(""),
    [priority, P] = useState("Normal"),
    [error, E] = useState(""),
    [busy, B] = useState(false),
    [refFile, RF] = useState<File | null>(null),
    [edit, Edit] = useState<any>(null),
    [query, Q] = useState(""),
    [noteFilter, NF] = useState("All"),
    [share, Share] = useState<any>(null),
    [dest, Dest] = useState("team");
  const player = useRef<HTMLVideoElement>(null);
  const video = s.records.find((r: any) => r.id === id),
    versions = video?.versions || [],
    current = versions.find((v: any) => v.id === version) || versions.at(-1),
    publicDrive = current?.source?.provider === "gdrive-public",
    publicDriveURL = publicDrive ? publicDriveEmbedURL(current.source) : "",
    annotations = s.annotations.filter(
      (a: any) =>
        !a.archived && a.videoId === id && a.versionId === current?.id,
    );
  const reviewer = ["owner", "executive"].includes(user().role);
  useEffect(() => {
    if (initial) ID(initial);
  }, [initial]);
  const pendingSeek = useRef<any>(null);
  useEffect(() => {
    let alive = true;
    U("");
    Ready(false);
    N(0);
    Dur(0);
    I(0);
    O(null);
    Marker(false);
    EditingMarker(null);
    ManualTiming(current?.source?.provider === "gdrive-public");
    Text("");
    RF(null);
    E("");
    if (current?.source?.provider === "gdrive-link") {
      U(reviewPlaybackURL(id, current.id));
    } else if (current?.assetId) {
      fileURL(current.assetId)
        .then((value) => {
          if (alive) U(value);
        })
        .catch((error) => {
          if (alive) E(error.message);
        });
    }
    return () => {
      alive = false;
    };
  }, [id, current?.id, current?.assetId, current?.source?.reference]);
  useEffect(() => {
    const jump = (e: any) => {
      const target = e.detail;
      sessionStorage.setItem("wam-seek", JSON.stringify(target));
      pendingSeek.current = target;
      ID(target.videoId);
      V(target.versionId);
      const element = player.current;
      if (
        element?.dataset.version === target.versionId &&
        element.readyState >= 1
      ) {
        element.currentTime = Math.max(
          0,
          Math.min(element.duration, target.time),
        );
        sessionStorage.removeItem("wam-seek");
        pendingSeek.current = null;
      }
    };
    window.addEventListener("wam-review-link", jump);
    return () => window.removeEventListener("wam-review-link", jump);
  }, []);
  function seek(t: number) {
    if (publicDrive) {
      I(t);
      ManualTiming(true);
      Marker(true);
      return;
    }
    const element = player.current;
    if (element && element.readyState >= 1 && Number.isFinite(t)) {
      element.currentTime = Math.min(
        element.duration || Infinity,
        Math.max(0, t),
      );
      N(element.currentTime);
    }
  }

  function beginMarker() {
    EditingMarker(null);
    I(publicDrive ? 0 : (player.current?.currentTime ?? now));
    O(null);
    T("GENERAL NOTE");
    P("Normal");
    Text("");
    RF(null);
    ManualTiming(true);
    Marker(true);
    E("");
    document.getElementById("video-review-note")?.scrollIntoView({
      behavior: "smooth", block: "center",
    });
  }
  function editMarker(marker: any) {
    EditingMarker(marker.id);
    I(marker.start);
    O(marker.end ?? null);
    T(marker.type);
    P(marker.priority);
    Text(marker.text);
    RF(null);
    ManualTiming(true);
    Marker(true);
    E("");
    document.getElementById("video-review-note")?.scrollIntoView({
      behavior: "smooth", block: "center",
    });
  }
  function deleteMarker(marker: any) {
    if (!window.confirm("Delete this review marker? The video and other reviews will remain.")) return;
    try {
      archiveAnnotation(marker.id);
      if (editingMarkerId === marker.id) cancelMarkerEdit();
    } catch (error: any) {
      E(error.message);
    }
  }
  function cancelMarkerEdit() {
    EditingMarker(null);
    Text("");
    RF(null);
    Marker(false);
    O(null);
  }
  async function linkDrive(e: any) {
    e.preventDefault();
    B(true);
    E("");
    try {
      const added = await addDriveVideoVersion(id, driveLink);
      V(added.id);
      DriveLink("");
      DriveOpen(false);
    } catch (error: any) {
      E(error.message);
    } finally {
      B(false);
    }
  }
  async function upload(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      E("Choose a video file");
      return;
    }
    B(true);
    E("");
    try {
      const v = await addVideoVersion(id, file);
      V(v.id);
    } catch (e: any) {
      E(e.message);
    } finally {
      B(false);
    }
  }
  function updateVersion(status: string) {
    try {
      if (status === "Approved" && !reviewer)
        throw Error("McKenzie or Lawrence must approve");
      if (
        status === "Approved" &&
        annotations.some((a: any) => a.status !== "Resolved")
      )
        throw Error("Resolve outstanding annotations before approval");
      reviewVersion(id, current.id, status);
    } catch (e: any) {
      E(e.message);
    }
  }
  async function annotate(e: any) {
    e.preventDefault();
    E("");
    try {
      if (!current || (!publicDrive && !ready))
        throw Error("Wait for video playback to load before annotating");
      if (
        start < 0 ||
        (duration && start > duration) ||
        (end !== null && (end < start || (duration && end > duration)))
      )
        throw Error("Choose a valid IN / OUT range within this video");
      const capturedTime = player.current?.currentTime ?? now;
      const reference = refFile ? await addAsset(refFile) : "";
      const changes = {
        start: publicDrive || manualTiming ? start : capturedTime,
        end: publicDrive || manualTiming ? end : null,
        type,
        text,
        priority,
        ...(reference ? { reference } : {}),
      };
      if (editingMarkerId) updateAnnotation(editingMarkerId, changes);
      else addAnnotation(id, current.id, changes);
      cancelMarkerEdit();
    } catch (e: any) {
      E(e.message);
    }
  }
  function annotationStatus(a: any, status: string) {
    setAnnotationStatus(a.id, status);
  }
  const conversations = s.conversations.filter((c: any) =>
    c.members.includes(user().id),
  );
  return (
    <>
      <div className="ops-toolbar">
        <select
          aria-label="Select video"
          disabled={busy}
          value={id}
          onChange={(e) => {
            ID(e.target.value);
            V("");
            N(0);
          }}
        >
          {videos.map((v: any) => (
            <option key={v.id} value={v.id}>
              {v.title}
            </option>
          ))}
        </select>
        <button
          disabled={busy}
          onClick={() =>
            Edit({
              id: crypto.randomUUID(),
              kind: "video",
              title: "",
              status: "Editing",
              versions: [],
              shots: [],
              owner: "Travis",
            })
          }
        >
          ＋ New video project
        </button>
      </div>
      {video ? (
        <>
          <div className="review-layout">
            <section className="card panel">
              <div className="sectionhead">
                <div>
                  <span className="eyebrow">VIDEO REVIEW</span>
                  <h2>{video.title}</h2>
                </div>
                <span className="badge">{current?.status || "No version"}</span>
              </div>
              <div className="ops-toolbar">
                <select
                  aria-label="Video version"
                  value={current?.id || ""}
                  disabled={busy}
                  onChange={(e) => V(e.target.value)}
                >
                  {versions.map((v: any) => (
                    <option key={v.id} value={v.id}>
                      {v.name} · {v.status}
                    </option>
                  ))}
                </select>
                <label className="button">
                  {busy ? "Saving video…" : "Upload new version"}
                  <input
                    type="file"
                    accept="video/*"
                    disabled={busy}
                    hidden
                    onChange={(e) => {
                      upload(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </label>
                <button disabled={busy} onClick={() => DriveOpen(!driveOpen)}>
                  Paste Google Drive Link
                </button>
              </div>
              {driveOpen && (
                <form className="annotation-form" onSubmit={linkDrive}>
                  <label>
                    Google Drive video link
                    <input
                      type="url"
                      required
                      value={driveLink}
                      disabled={busy}
                      placeholder="https://drive.google.com/file/d/…/view"
                      onChange={(e) => DriveLink(e.target.value)}
                    />
                  </label>
                  <p>
                    Set the video in Google Drive to "Anyone with the link"
                    and "Viewer". The video stays in Drive and plays below.
                    No Google account connection or duplicate upload is needed.
                    Anyone with the link can open the original on Drive.
                  </p>
                  <button className="primary" disabled={busy}>
                    {busy ? "Saving…" : "Save & review"}
                  </button>
                </form>
              )}
              {current && (
                <div className="ops-toolbar review-marker-toolbar" role="group" aria-label="Review marker controls">
                  <strong>Review markers ({annotations.length})</strong>
                  <button
                    type="button"
                    className="primary"
                    disabled={!publicDrive && !ready}
                    onClick={beginMarker}
                  >
                    ＋ Add marker
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById("video-review-markers")?.scrollIntoView({
                      behavior: "smooth", block: "start",
                    })}
                  >
                    View / edit markers
                  </button>
                </div>
              )}
              {publicDrive ? (
                publicDriveURL ? (
                  <>
                    <iframe
                      key={current?.id}
                      title={video.title + " shared Google Drive video"}
                      className="review-player"
                      src={publicDriveURL}
                      loading="lazy"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      referrerPolicy="no-referrer"
                      style={{ display: "block", border: 0 }}
                    />
                    <p className="review-drive-hint">
                      Play using the Google Drive controls. To leave a timed
                      review, enter the player's timestamp under Timing &amp;
                      extra details in seconds (90 means 01:30). Google does
                      not expose playback time or seeking to WAM.
                    </p>
                  </>
                ) : (
                  <p className="notice" role="alert">
                    Invalid linked video. Add a new revision with a valid
                    Google Drive share URL.
                  </p>
                )
              ) : url ? (
                <video
                  key={current?.id}
                  ref={player}
                  data-version={current?.id}
                  preload="metadata"
                  className="review-player"
                  src={url}
                  controls
                  playsInline
                  onTimeUpdate={(e) => N(e.currentTarget.currentTime)}
                  onSeeked={(e) => N(e.currentTarget.currentTime)}
                  onError={async (e) => {
                    Ready(false);
                    const element = e.currentTarget;
                    const failedVersion = element.dataset.version;
                    let message =
                      "This video cannot play in this browser. Use a browser-compatible MP4 (H.264/AAC) or WebM file.";
                    if (current?.source?.provider === "gdrive-link") {
                      try {
                        const response = await fetch(url, {
                          headers: { Range: "bytes=0-0" },
                        });
                        if (!response.ok)
                          message = (await response.json()).error || message;
                        else await response.body?.cancel();
                      } catch {
                        message =
                          "Unable to reach Drive. Check your connection and sign-in.";
                      }
                    }
                    if (player.current?.dataset.version === failedVersion)
                      E(message);
                  }}
                  onLoadedMetadata={(e) => {
                    Ready(true);
                    E("");
                    Dur(e.currentTarget.duration);
                    e.currentTarget.playbackRate = playbackRates[speed];
                    try {
                      const jump =
                        pendingSeek.current ||
                        JSON.parse(
                          sessionStorage.getItem("wam-seek") || "null",
                        );
                      if (
                        jump?.videoId === id &&
                        jump.versionId === current.id
                      ) {
                        e.currentTarget.currentTime = Math.max(
                          0,
                          Math.min(e.currentTarget.duration, jump.time),
                        );
                        sessionStorage.removeItem("wam-seek");
                        pendingSeek.current = null;
                      }
                    } catch {
                      sessionStorage.removeItem("wam-seek");
                    }
                  }}
                />
              ) : (
                <div className="review-empty">
                  <b>Upload a video or paste a Drive link to begin review</b>
                  <p>
                    Drive links keep the original in Drive. Each version keeps
                    its own feedback and approval history.
                  </p>
                </div>
              )}
              {!publicDrive && (
              <div className="review-player-controls">
                <output aria-label="Playback time">
                  {timecode(now)} / {timecode(duration)}
                </output>
                <div className="review-speed">
                  <label htmlFor="review-speed">
                    Speed <b>{playbackRates[speed]}×</b>
                  </label>
                  <input
                    id="review-speed"
                    aria-label="Playback speed"
                    aria-valuetext={playbackRates[speed] + " times"}
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={speed}
                    disabled={!ready}
                    onChange={(e) => {
                      const index = +e.target.value;
                      Speed(index);
                      if (player.current)
                        player.current.playbackRate = playbackRates[index];
                    }}
                  />
                  <div className="speed-markers" aria-hidden="true">
                    {playbackRates.map((rate, i) => (
                      <span
                        className={i === speed ? "selected" : ""}
                        key={rate}
                      >
                        {rate}×
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              )}
              {publicDrive ? (
                <div className="review-mark-actions">
                  <button onClick={beginMarker}>
                    ＋ Add timed marker
                  </button>
                </div>
              ) : (
              <div className="review-mark-actions">
                <button
                  disabled={!ready}
                  onClick={beginMarker}
                >
                  ＋ Add marker
                </button>
                <button
                  disabled={!ready}
                  onClick={() => {
                    I(player.current?.currentTime ?? now);
                    ManualTiming(true);
                    Marker(true);
                  }}
                >
                  Set IN
                </button>
                <button
                  disabled={!ready}
                  onClick={() => {
                    O(player.current?.currentTime ?? now);
                    ManualTiming(true);
                    Marker(true);
                  }}
                >
                  Set OUT
                </button>
              </div>
              )}
              {draftMarker && (
                <div className="review-range-readout">
                  IN {timecode(start)}
                  {end !== null ? " · OUT " + timecode(end) : ""}
                </div>
              )}
              {!publicDrive && (
              <div className="review-timeline" aria-label="Annotation timeline">
                {draftMarker && (
                  <span
                    className="draft-review-marker"
                    style={{
                      left:
                        Math.min(98, duration ? (start / duration) * 100 : 0) +
                        "%",
                    }}
                    title={"Current marker: " + timecode(start)}
                  >
                    ●
                  </span>
                )}
                {annotations.map((a: any) => (
                  <button
                    key={a.id}
                    style={{
                      left:
                        Math.min(
                          96,
                          duration ? (a.start / duration) * 100 : 0,
                        ) + "%",
                    }}
                    onClick={() => seek(a.start)}
                    title={`${timecode(a.start)} ${a.type}`}
                    aria-label={"Seek to " + timecode(a.start)}
                  >
                    ●
                  </button>
                ))}
              </div>
              )}
              <form
                id="video-review-note"
                className="annotation-form"
                onSubmit={annotate}
              >
                <h3>
                  {editingMarkerId ? "Edit review marker" : "Add review marker"}{" "}
                  <small>Shared with the team</small>
                </h3>
                <label>
                  What needs to change?{" "}
                  <small>At {timecode(publicDrive || manualTiming ? start : now)}</small>
                  <textarea
                    required
                    rows={2}
                    value={text}
                    onChange={(e) => Text(e.target.value)}
                    placeholder="Write a note about this part of the video…"
                  />
                </label>
                <details className="review-options" open={publicDrive}>
                  <summary>Timing & extra details</summary>
                  <label className="review-range-toggle">
                    <input
                      type="checkbox"
                      checked={manualTiming || publicDrive}
                      disabled={publicDrive}
                      onChange={(e) => {
                        ManualTiming(e.target.checked);
                        I(player.current?.currentTime ?? now);
                      }}
                    />
                    Use a custom time or range
                  </label>
                  <div className="ops-formgrid">
                    <label>
                      Type
                      <select value={type} onChange={(e) => T(e.target.value)}>
                        {[
                          "REMOVE",
                          "INSERT",
                          "REPLACE",
                          "TRIM",
                          "AUDIO FIX",
                          "GRAPHICS/TEXT",
                          "COLOR",
                          "GENERAL NOTE",
                        ].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Priority
                      <select
                        value={priority}
                        onChange={(e) => P(e.target.value)}
                      >
                        {["Low", "Normal", "High", "Urgent"].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      IN (seconds)
                      <input
                        type="number"
                        min="0"
                        step="0.001"
                        value={start}
                        onChange={(e) => {
                          ManualTiming(true);
                          I(+e.target.value);
                        }}
                      />
                    </label>
                    <label>
                      OUT (seconds, optional)
                      <input
                        type="number"
                        min="0"
                        step="0.001"
                        value={end ?? ""}
                        onChange={(e) => {
                          ManualTiming(true);
                          O(e.target.value === "" ? null : +e.target.value);
                        }}
                      />
                    </label>
                  </div>
                  <label>
                    Optional visual reference
                    <input
                      type="file"
                      onChange={(e) => RF(e.target.files?.[0] || null)}
                    />
                  </label>
                </details>
              </form>
              {error && (
                <p className="notice" role="alert">
                  {error}
                </p>
              )}
              <div className="ops-actions review-submit-actions">
                <button
                  type="submit"
                  form="video-review-note"
                  className="primary"
                  disabled={!current || (!ready && !publicDrive) || !text.trim() || busy}
                >
                  {editingMarkerId ? "Save changes" : "Save marker"}
                </button>
                {editingMarkerId && (
                  <button type="button" onClick={cancelMarkerEdit}>
                    Cancel edit
                  </button>
                )}
                <button
                  disabled={!current}
                  onClick={() => updateVersion("Submitted for Review")}
                >
                  Submit this version
                </button>
                {reviewer && (
                  <>
                    <button
                      className="primary"
                      disabled={!current}
                      onClick={() => updateVersion("Approved")}
                    >
                      Approve this version
                    </button>
                    <button
                      disabled={!current}
                      onClick={() => updateVersion("Revisions requested")}
                    >
                      Request revisions
                    </button>
                  </>
                )}
                <button
                  disabled={!current}
                  onClick={() =>
                    exportJSON(
                      { video: video.title, version: current, annotations },
                      "video-review.json",
                    )
                  }
                >
                  Export review
                </button>
              </div>
              <details>
                <summary>Version approval history</summary>
                {versions.map((v: any) => (
                  <div key={v.id}>
                    <h3>
                      {v.name} · {v.status}
                    </h3>
                    {v.reviews?.map((r: any, i: number) => (
                      <p key={i}>
                        {r.by} · {r.status} · {r.at}
                      </p>
                    ))}
                  </div>
                ))}
              </details>
            </section>
            <section className="card panel review-notes" id="video-review-markers">
              <h3>Saved markers ({annotations.length})</h3>
              {publicDrive && (
                <p>Drive playback runs in Google's player. Marker times are entered manually in seconds.</p>
              )}
              <div className="sectionhead">
                <h2>Review feedback</h2>
                <span className="badge">
                  {
                    annotations.filter((a: any) => a.status !== "Resolved")
                      .length
                  }{" "}
                  outstanding
                </span>
              </div>
              <div className="ops-toolbar">
                <input
                  aria-label="Search annotations"
                  placeholder="Search notes…"
                  value={query}
                  onChange={(e) => Q(e.target.value)}
                />
                <select
                  aria-label="Annotation status filter"
                  value={noteFilter}
                  onChange={(e) => NF(e.target.value)}
                >
                  {[
                    "All",
                    "Open",
                    "In Progress",
                    "Ready for Review",
                    "Resolved",
                    "Reopened",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
              {annotations
                .filter(
                  (a: any) =>
                    (noteFilter === "All" || a.status === noteFilter) &&
                    a.text.toLowerCase().includes(query.toLowerCase()),
                )
                .sort((a: any, b: any) => a.start - b.start)
                .map((a: any) => (
                  <article
                    className="annotation"
                    data-select-kind="annotation"
                    data-select-id={a.id}
                    key={a.id}
                  >
                    <button
                      className="timecode"
                      disabled={!ready && !publicDrive}
                      onClick={() => publicDrive ? editMarker(a) : seek(a.start)}
                    >
                      {timecode(a.start)}
                      {a.end !== null ? "–" + timecode(a.end) : ""}
                    </button>
                    <h3>
                      {a.type} <small>{a.priority}</small>
                    </h3>
                    <p>{a.text}</p>
                    <small>
                      {a.author} · {new Date(a.createdAt).toLocaleString()} ·
                      Shared review
                    </small>
                    {a.reference && (
                      <button
                        onClick={async () =>
                          window.open(await fileURL(a.reference), "_blank")
                        }
                      >
                        Open reference
                      </button>
                    )}
                    <label>
                      Status
                      <select
                        value={a.status}
                        onChange={(e) => annotationStatus(a, e.target.value)}
                      >
                        {[
                          "Open",
                          "In Progress",
                          "Ready for Review",
                          "Resolved",
                          "Reopened",
                        ].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
                    <div className="ops-toolbar">
                      {canManageAnnotation(a) && (
                        <>
                          <button type="button" onClick={() => editMarker(a)}>Edit marker</button>
                          <button type="button" onClick={() => deleteMarker(a)}>Delete marker</button>
                        </>
                      )}
                      <button type="button" onClick={() => Share(a)}>Share to Messenger</button>
                    </div>
                    <TeamStatus record={a} annotation />
                    <AnnotationThread annotation={a} />
                  </article>
                ))}
              {!annotations.length && <p>No markers for this version yet. Use “Add marker” above the video.</p>}
            </section>
          </div>
        </>
      ) : (
        <div className="card empty">Create a video project to start.</div>
      )}
      {edit && (
        <RecordEditor
          record={edit}
          onClose={() => {
            if (
              getState().records.some((record: any) => record.id === edit.id)
            ) {
              ID(edit.id);
              V("");
            }
            Edit(null);
          }}
        />
      )}
      {share && (
        <div className="overlay">
          <section className="modal">
            <h2>Share timestamped feedback</h2>
            <select
              value={dest}
              onChange={(e) => Dest(e.target.value)}
              aria-label="Conversation"
            >
              {conversations.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <div className="modalactions">
              <button onClick={() => Share(null)}>Cancel</button>
              <button
                className="primary"
                onClick={() => {
                  conversation(dest);
                  mutate(
                    (s) =>
                      s.messages.push({
                        id: crypto.randomUUID(),
                        conversationId: dest,
                        sender_id: user().id,
                        sender_name: user().name,
                        text:
                          share.type +
                          " " +
                          timecode(share.start) +
                          " — " +
                          share.text,
                        annotation: {
                          id: share.id,
                          videoId: id,
                          versionId: share.versionId,
                          time: share.start,
                        },
                        created_at: new Date().toISOString(),
                      }),
                    "Shared local review link",
                  );
                  Share(null);
                }}
              >
                Share locally
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
function AnnotationThread({ annotation: a }: any) {
  const [t, T] = useState("");
  return (
    <details>
      <summary>Discussion ({a.comments.length})</summary>
      {a.comments.map((c: any, i: number) => (
        <p
          hidden={c.archived}
          data-select-kind="annotation-comment"
          data-select-parent={a.id}
          data-select-id={String(i)}
          key={i}
        >
          <b>{c.by}</b> {c.text} <small>{c.at}</small>
        </p>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate((s) =>
            s.annotations
              .find((x: any) => x.id === a.id)
              .comments.push({
                text: t,
                by: user().name,
                at: new Date().toISOString(),
              }),
          );
          T("");
        }}
      >
        <input
          required
          aria-label="Reply to feedback"
          value={t}
          onChange={(e) => T(e.target.value)}
        />
        <button>Reply</button>
      </form>
    </details>
  );
}
