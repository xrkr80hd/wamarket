import TeamStatus from "./team-status";
import {
  addVideoVersion,
  addAnnotation,
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
export const timecode = (t: number) => {
  const n = Math.max(0, t || 0);
  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(Math.floor(n % 60)).padStart(2, "0")}.${String(Math.round((n % 1) * 1000)).padStart(3, "0")}`;
};
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
    [speed, Speed] = useState(2),
    [draftMarker, Marker] = useState(false),
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
    annotations = s.annotations.filter(
      (a: any) =>
        !a.archived && a.videoId === id && a.versionId === current?.id,
    );
  const reviewer = ["owner", "executive"].includes(user().role);
  useEffect(() => {
    if (initial) ID(initial);
  }, [initial]);
  useEffect(() => {
    if (!current) {
      U("");
      return;
    }
    let alive = true;
    fileURL(current.assetId).then((u) => {
      if (alive) U(u);
    });
    return () => {
      alive = false;
    };
  }, [current?.assetId]);
  useEffect(() => {
    const jump = (e: any) => {
      ID(e.detail.videoId);
      V(e.detail.versionId);
      setTimeout(() => seek(e.detail.time), 300);
    };
    window.addEventListener("wam-review-link", jump);
    return () => window.removeEventListener("wam-review-link", jump);
  }, []);
  function seek(t: number) {
    if (player.current) {
      player.current.currentTime = Math.min(
        duration || Infinity,
        Math.max(0, t),
      );
      N(t);
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
      if (!current) throw Error("Upload a version first");
      if (
        start < 0 ||
        (duration && start > duration) ||
        (end !== null && (end < start || (duration && end > duration)))
      )
        throw Error("Choose a valid IN / OUT range within this video");
      const reference = refFile ? await addAsset(refFile) : "";
      addAnnotation(id, current.id, {
        start: manualTiming ? start : now,
        end: manualTiming ? end : null,
        type,
        text,
        priority,
        reference,
      });
      Text("");
      RF(null);
      Marker(false);
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
          onClick={() =>
            Edit({
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
              </div>
              {url ? (
                <video
                  key={current?.id}
                  ref={player}
                  className="review-player"
                  src={url}
                  controls
                  playsInline
                  onTimeUpdate={(e) => N(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => {
                    Dur(e.currentTarget.duration);
                    e.currentTarget.playbackRate = playbackRates[speed];
                    const jump = sessionStorage.getItem("wam-seek");
                    if (jump) {
                      const j = JSON.parse(jump);
                      if (j.videoId === id && j.versionId === current.id) {
                        e.currentTarget.currentTime = j.time;
                        sessionStorage.removeItem("wam-seek");
                      }
                    }
                  }}
                />
              ) : (
                <div className="review-empty">
                  <b>Upload a video to begin review</b>
                  <p>
                    Your original file stays in this browser. Each version keeps
                    its own feedback.
                  </p>
                </div>
              )}
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
                    disabled={!url}
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
              <div className="review-mark-actions">
                <button
                  disabled={!url}
                  onClick={() => {
                    I(now);
                    O(null);
                    ManualTiming(true);
                    Marker(true);
                  }}
                >
                  Add marker
                </button>
                <button
                  disabled={!url}
                  onClick={() => {
                    I(now);
                    ManualTiming(true);
                    Marker(true);
                  }}
                >
                  Set IN
                </button>
                <button
                  disabled={!url}
                  onClick={() => {
                    O(now);
                    ManualTiming(true);
                    Marker(true);
                  }}
                >
                  Set OUT
                </button>
              </div>
              {draftMarker && (
                <div className="review-range-readout">
                  IN {timecode(start)}
                  {end !== null ? " · OUT " + timecode(end) : ""}
                </div>
              )}
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
              <form
                id="video-review-note"
                className="annotation-form"
                onSubmit={annotate}
              >
                <h3>
                  Leave a review <small>Shared with the team</small>
                </h3>
                <label>
                  What needs to change?{" "}
                  <small>At {timecode(manualTiming ? start : now)}</small>
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
                      checked={manualTiming}
                      onChange={(e) => {
                        ManualTiming(e.target.checked);
                        I(now);
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
                  disabled={!current || !text.trim() || busy}
                >
                  Save review
                </button>
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
            <details className="card panel review-notes">
              <summary>
                Review feedback ·{" "}
                {annotations.filter((a: any) => a.status !== "Resolved").length}{" "}
                open
              </summary>
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
                    <button className="timecode" onClick={() => seek(a.start)}>
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
                    <button onClick={() => Share(a)}>Share to Messenger</button>
                    <TeamStatus record={a} annotation />
                    <AnnotationThread annotation={a} />
                  </article>
                ))}
              {!annotations.length && <p>No feedback for this version yet.</p>}
            </details>
          </div>
        </>
      ) : (
        <div className="card empty">Create a video project to start.</div>
      )}
      {edit && <RecordEditor record={edit} onClose={() => Edit(null)} />}
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
