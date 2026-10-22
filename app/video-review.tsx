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
export function formatReviewRuntimeInput(raw: string): string {
 const digits=raw.replace(/\D/g,"").slice(0,6);
 if(digits.length<=2)return digits;
 if(digits.length<=4)return digits.slice(0,-2)+":"+digits.slice(-2);
 return digits.slice(0,-4)+":"+digits.slice(-4,-2)+":"+digits.slice(-2);
}
export function parseReviewRuntime(input: string): number {
 const digits=input.replace(/\D/g,"");
 if(!digits||digits.length>6)return 0;
 const ss=digits.length<=2?Number(digits):Number(digits.slice(-2));
 const mm=digits.length<=2?0:Number(digits.length<=4?digits.slice(0,-2):digits.slice(-4,-2));
 const hh=digits.length>4?Number(digits.slice(0,-4)):0;
 const seconds=hh*3600+mm*60+ss;
 return ss<60&&mm<60&&seconds>0&&seconds<=86400?seconds:0;
}
function shortTime(t: number): string {
  const s = Math.max(0, Math.floor(Number.isFinite(t) ? t : 0));
  return (s >= 3600 ? Math.floor(s / 3600) + ":" : "") +
    String(Math.floor(s / 60) % 60).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
}
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
    [driveRuntime, DriveRuntime] = useState(""),
    [runtimeDraft, RuntimeDraft] = useState(""),
    [selectedNoteId, SelectedNoteId] = useState<string | null>(null),
    [playing, Playing] = useState(false),
    [ready, Ready] = useState(false),
    [speed, Speed] = useState(2),
    [draftMarker, Marker] = useState(false),
    [expandedPlayer, ExpandedPlayer] = useState(false),
    [videoDisplayMode, VideoDisplayMode] = useState<"desktop" | "mobile">("desktop"),
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
  const playerStage = useRef<HTMLDivElement>(null);
  const video = s.records.find((r: any) => r.id === id),
    versions = video?.versions || [],
    current = versions.find((v: any) => v.id === version) || versions.at(-1),
    publicDrive = current?.source?.provider === "gdrive-public",
    publicDriveURL = publicDrive ? publicDriveEmbedURL(current.source) : "",
    timelineDuration = publicDrive ? Number(current?.durationSeconds || 0) : duration,
    selectedNote = s.annotations.find((a: any) => a.id === selectedNoteId && !a.archived && a.videoId === id && a.versionId === current?.id),
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
    Playing(false);
    SelectedNoteId(null);
    RuntimeDraft("");
    Dur(0);
    I(0);
    O(null);
    Marker(false);
    ExpandedPlayer(false);
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

  useEffect(() => {
    if (!expandedPlayer) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePlayer();
    };
    const onFullscreenChange = () => {
      // Back gesture/native exit restores the normal embedded player.
      if (!document.fullscreenElement) ExpandedPlayer(false);
    };
    document.addEventListener("keydown", onEscape);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [expandedPlayer]);

  function expandPlayer() {
    const stage = playerStage.current;
    if (!stage) return;
    ExpandedPlayer(true);
    // Fullscreen API keeps the same iframe/video mounted and playback position intact.
    // If the browser/PWA rejects it, the fixed in-app mobile viewer remains usable.
    if (stage.requestFullscreen) {
      void stage.requestFullscreen().catch(() => {});
    }
  }
  function closePlayer() {
    ExpandedPlayer(false);
    if (document.fullscreenElement === playerStage.current) {
      void document.exitFullscreen().catch(() => {});
    }
  }
  function playerControls() {
    return (
      <div className="review-viewer-controls" role="group" aria-label="Video viewing options">
        <span className="review-viewer-controls-label">View:</span>
        <div className="review-view-toggle" role="group" aria-label="Video preview format">
          <button
            type="button"
            aria-label="Desktop video view"
            aria-pressed={videoDisplayMode === "desktop"}
            className={videoDisplayMode === "desktop" ? "selected" : ""}
            onClick={() => VideoDisplayMode("desktop")}
          >
            Desktop
          </button>
          <button
            type="button"
            aria-label="Mobile video view"
            aria-pressed={videoDisplayMode === "mobile"}
            className={videoDisplayMode === "mobile" ? "selected" : ""}
            onClick={() => VideoDisplayMode("mobile")}
          >
            Mobile
          </button>
        </div>
        <button
          type="button"
          className="review-fullscreen-control"
          aria-label={expandedPlayer ? "Exit full screen video" : "Expand video to full screen"}
          aria-pressed={expandedPlayer}
          onClick={expandedPlayer ? closePlayer : expandPlayer}
        >
          {expandedPlayer ? "Exit full screen" : "Full screen"}
        </button>
      </div>
    );
  }
  function reviewTimeline() {
    return (
      <div className="review-simple-timeline" aria-label="Video review timeline">
        <div className="review-time-labels">
          <strong>{shortTime(now)} / {timelineDuration > 0 ? shortTime(timelineDuration) : "--:--"}</strong>
          <span>{annotations.length} {annotations.length === 1 ? "note" : "notes"}</span>
        </div>
        {publicDrive && timelineDuration <= 0 && (
          <form className="review-runtime-form" onSubmit={saveDriveRuntime}>
            <div className="review-runtime-field">
              <div className="review-runtime-heading">
                <label htmlFor="current-video-length">Video length</label>
                <details className="review-runtime-tip">
                  <summary aria-label="How to enter video length">ⓘ</summary>
                  <p>Type numbers only. 20 = 00:20, 3000 = 30:00, 013000 = 01:30:00. Colons appear automatically.</p>
                </details>
              </div>
              <input id="current-video-length" type="text" inputMode="numeric" required placeholder="00:00"
                value={runtimeDraft} onChange={(e) => RuntimeDraft(formatReviewRuntimeInput(e.target.value))} />
            </div>
            <button type="submit" disabled={busy}>Save time</button>
          </form>
        )}
        <div className="review-timeline-track">
          <input type="range" min="0" max={timelineDuration || 1} step="0.1"
            disabled={timelineDuration <= 0} aria-label="Choose a time to leave a note"
            value={Math.min(now, timelineDuration || 1)}
            onChange={(e) => seek(Number(e.target.value))}
            onPointerUp={(e) => {if(timelineDuration>0)prepareMarkerAt(Number(e.currentTarget.value));}}
            onKeyUp={(e) => {if(e.key==="Enter"&&timelineDuration>0)prepareMarkerAt(Number(e.currentTarget.value));}}
          />
          {timelineDuration>0 && annotations.map((a: any) => (
            <button key={a.id} type="button"
              className={"review-timeline-note"+(selectedNoteId===a.id?" active":"")}
              style={{left:Math.max(1,Math.min(99,a.start/timelineDuration*100))+"%"}}
              title={shortTime(a.start)+": "+a.text}
              aria-label={"Read note at "+shortTime(a.start)} onClick={()=>openMarker(a)}>●</button>
          ))}
        </div>
        <div className="review-timeline-ticks" aria-hidden="true">
          <span>00:00</span><span>{timelineDuration?shortTime(timelineDuration/2):"--:--"}</span>
          <span>{timelineDuration?shortTime(timelineDuration):"--:--"}</span>
        </div>
        <div className="review-transport">
          {!publicDrive ? (
            <>
              <button type="button" aria-label="Stop video" onClick={stopPlayback} disabled={!ready}>■ Stop</button>
              <button type="button" aria-label="Rewind ten seconds" onClick={()=>skipBy(-10)} disabled={!ready}>↶ 10s</button>
              <button type="button" aria-label={playing?"Pause video":"Play video"}
                onClick={togglePlayback} disabled={!ready}>{playing?"Ⅱ Pause":"▶ Play"}</button>
              <button type="button" aria-label="Skip forward ten seconds" onClick={()=>skipBy(10)} disabled={!ready}>10s ↷</button>
            </>
          ) : (
            <small>Use Google's play controls inside the video.</small>
          )}
          <button type="button" className="review-new-note" onClick={beginMarker}
            disabled={timelineDuration<=0||(!publicDrive&&!ready)}>＋ Note</button>
        </div>
        {selectedNote && (
          <div className="review-selected-note" role="region" aria-label="Selected video note">
            <strong>{shortTime(selectedNote.start)} · {selectedNote.author}</strong>
            <p>{selectedNote.text}</p>
            {canManageAnnotation(selectedNote) && (
              <div className="review-note-actions">
                <button type="button" onClick={()=>editMarker(selectedNote)}>Edit</button>
                <button type="button" onClick={()=>deleteMarker(selectedNote)}>Delete</button>
              </div>
            )}
            <button type="button" onClick={()=>SelectedNoteId(null)}>Close</button>
          </div>
        )}
        {!publicDrive && <small className="review-keyboard-hint">← / →: 5s · Shift + arrow: 10s</small>}
      </div>
    );
  }

  // Native video is synchronized; public Google Drive iframes do not expose a seeking API.
  function seek(t: number) {
    if (!Number.isFinite(t)) return;
    const clamped = Math.max(0, Math.min(timelineDuration || 0, t));
    if (!publicDrive && player.current?.readyState) player.current.currentTime = clamped;
    N(clamped);
  }
  function skipBy(delta: number) { seek((player.current?.currentTime ?? now) + delta); }
  async function togglePlayback() {
    const p = player.current;
    if (!p || !ready || publicDrive) return;
    if (!p.paused) { p.pause(); Playing(false); return; }
    try { await p.play(); Playing(true); }
    catch { E("Playback was blocked. Tap Play to try again."); }
  }
  function stopPlayback() {
    player.current?.pause();
    Playing(false);
    seek(0);
  }
  function prepareMarkerAt(at: number) {
    if (!current || (!publicDrive && !ready) || timelineDuration <= 0) return;
    seek(at);
    SelectedNoteId(null);
    EditingMarker(null);
    I(Math.max(0, Math.min(timelineDuration, at)));
    O(null);
    T("GENERAL NOTE");
    P("Normal");
    Text("");
    RF(null);
    ManualTiming(true);
    Marker(true);
    E("");
  }
  function openMarker(a: any) {
    seek(a.start);
    SelectedNoteId(a.id);
    Marker(false);
    EditingMarker(null);
  }
  function beginMarker() {
    prepareMarkerAt(publicDrive ? now : (player.current?.currentTime ?? now));
  }
  function editMarker(marker: any) {
    SelectedNoteId(null);
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
      const seconds = parseReviewRuntime(driveRuntime);
      if (!seconds) throw Error("Type the video length using numbers, like 0732.");
      const added = await addDriveVideoVersion(id, driveLink, seconds);
      V(added.id);
      DriveLink("");
      DriveRuntime("");
      DriveOpen(false);
    } catch (error: any) {
      E(error.message);
    } finally {
      B(false);
    }
  }
  async function saveDriveRuntime(e: any) {
    e.preventDefault();
    const seconds = parseReviewRuntime(runtimeDraft);
    if (!seconds || !current) { E("Type the video length using numbers, like 0732."); return; }
    B(true);
    try {
      const latest = getState().records.find((record: any) => record.id === id);
      if (!latest?.versions?.some((v: any) => v.id === current.id)) throw Error("Version not found");
      saveRecord({...latest, versions: latest.versions.map((v: any) => v.id === current.id ? {...v, durationSeconds: seconds} : v)});
      RuntimeDraft("");
      E("");
    } catch (e: any) { E(e.message); }
    finally { B(false); }
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
      SelectedNoteId(null);
    } catch (e: any) {
      E(e.message);
    }
  }
  function annotationStatus(a: any, status: string) {
    setAnnotationStatus(a.id, status);
  }
  useEffect(() => {
    const onArrow = (e: KeyboardEvent) => {
      if (!timelineDuration || !current || !["ArrowLeft","ArrowRight"].includes(e.key)) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input,textarea,select,[contenteditable=true],[role=dialog]")) return;
      e.preventDefault();
      seek((player.current?.currentTime ?? now) + (e.key === "ArrowLeft" ? -1 : 1) * (e.shiftKey ? 10 : 5));
    };
    window.addEventListener("keydown", onArrow);
    return () => window.removeEventListener("keydown", onArrow);
  }, [id, current?.id, now, duration, timelineDuration, publicDrive]);
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
                <form className="annotation-form review-link-form" onSubmit={linkDrive}>
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
                  <div className="review-runtime-field">
                    <div className="review-runtime-heading">
                      <label htmlFor="drive-video-length">Video length</label>
                      <details className="review-runtime-tip">
                        <summary aria-label="How to enter video length">ⓘ</summary>
                        <p>Type numbers only. 20 = 00:20, 3000 = 30:00, 013000 = 01:30:00. Colons appear automatically.</p>
                      </details>
                    </div>
                    <input id="drive-video-length" type="text" inputMode="numeric" placeholder="00:00" required
                      value={driveRuntime} onChange={(e) => DriveRuntime(formatReviewRuntimeInput(e.target.value))} />
                  </div>
                  <p className="review-link-help">
                    In Drive, set access to "Anyone with the link" and "Viewer".
                    Your video stays in Drive.
                  </p>
                  <button className="primary" disabled={busy}>
                    {busy ? "Saving…" : "Save & review"}
                  </button>
                </form>
              )}
              {publicDrive ? (
                publicDriveURL ? (
                  <>
                    <div
                      ref={playerStage}
                      className={"review-viewer review-viewer-" + videoDisplayMode + (expandedPlayer ? " review-viewer-expanded" : "")}
                      aria-label="Google Drive video player"
                    >
                    <div className="review-player-stage">
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
                    </div>
                    <a className="review-drive-link-preview" href={publicDriveURL}
                       target="_blank" rel="noopener noreferrer"
                       aria-label="Open linked video on Google Drive">
                      <span className="review-drive-link-icon" aria-hidden="true">↗</span>
                      <span className="review-drive-link-copy">
                        <strong>Google Drive video</strong>
                        <small>drive.google.com</small>
                      </span>
                      <span className="review-drive-link-status">Linked</span>
                    </a>
                    {reviewTimeline()}
                    {playerControls()}
                    </div>
                  </>
                ) : (
                  <p className="notice" role="alert">
                    Invalid linked video. Add a new revision with a valid
                    Google Drive share URL.
                  </p>
                )
              ) : url ? (
                <div
                  ref={playerStage}
                  className={"review-viewer review-viewer-" + videoDisplayMode + (expandedPlayer ? " review-viewer-expanded" : "")}
                  aria-label="Uploaded video player"
                >
                <div className="review-player-stage">
                <video
                  key={current?.id}
                  ref={player}
                  data-version={current?.id}
                  preload="metadata"
                  className="review-player"
                  src={url}
                  playsInline
                  onPlay={() => Playing(true)}
                  onPause={() => Playing(false)}
                  onEnded={() => Playing(false)}
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
                </div>
                {reviewTimeline()}
                {playerControls()}
                </div>
              ) : (
                <div className="review-empty">
                  <b>Upload a video or paste a Drive link to begin review</b>
                  <p>
                    Drive links keep the original in Drive. Each version keeps
                    its own feedback and approval history.
                  </p>
                </div>
              )}
              {draftMarker && (
              <form
                id="video-review-note"
                className="annotation-form review-note-form"
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
                <details className="review-options">
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
              )}
              {error && (
                <p className="notice" role="alert">
                  {error}
                </p>
              )}
              <div className="ops-actions review-submit-actions">
                {draftMarker && (
                <button
                  type="submit"
                  form="video-review-note"
                  className="primary"
                  disabled={!current || (!ready && !publicDrive) || !text.trim() || busy}
                >
                  {editingMarkerId ? "Save changes" : "Save note"}
                </button>
                )}
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
                      onClick={() => openMarker(a)}
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
              {!annotations.length && <p>No notes yet. Tap the timeline to add one.</p>}
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
