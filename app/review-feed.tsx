import TeamStatus from "./team-status";
import { useState } from "react";
import { useWorkspace } from "./operations";
import { user } from "../lib/preview-store";
import { setAnnotationStatus } from "../lib/review-actions";
export default function ReviewFeedbackFeed({ onReview }: any) {
  const s = useWorkspace(),
    [showDone, Done] = useState(false);
  const notes = s.annotations
    .filter((a: any) => !a.archived && (showDone || a.status !== "Resolved"))
    .sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt));
  const open = s.annotations.filter(
    (a: any) => !a.archived && a.status !== "Resolved",
  ).length;
  return (
    <details className="shared-review-feed" open={open > 0}>
      <summary>
        <b>Review feedback</b>
        <span>{open} open</span>
        <small>Shared with the marketing team</small>
      </summary>
      <div className="shared-review-body">
        <label className="review-completed-toggle">
          <input
            type="checkbox"
            checked={showDone}
            onChange={(e) => Done(e.target.checked)}
          />
          Show completed
        </label>
        {notes.map((a: any) => {
          const video = s.records.find((r: any) => r.id === a.videoId),
            v = video?.versions?.find((v: any) => v.id === a.versionId);
          return (
            <article
              className="review-feed-row"
              data-select-kind="annotation"
              data-select-id={a.id}
              key={a.id}
            >
              <button
                className="review-feed-link"
                onClick={() => {
                  sessionStorage.setItem(
                    "wam-seek",
                    JSON.stringify({
                      videoId: a.videoId,
                      versionId: a.versionId,
                      time: a.start,
                    }),
                  );
                  onReview(a.videoId);
                }}
              >
                <b>{a.text}</b>
                <small>
                  {video?.title} · {v?.name} · {Math.floor(a.start / 60)}:
                  {String(Math.floor(a.start % 60)).padStart(2, "0")} ·{" "}
                  {a.author}
                </small>
              </button>
              <select
                aria-label={"Status for review " + a.text}
                disabled={user().role === "viewer"}
                value={a.status}
                onChange={(e) => setAnnotationStatus(a.id, e.target.value)}
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
              <TeamStatus record={a} annotation />
            </article>
          );
        })}
        {!notes.length && (
          <p className="compact-empty">
            No {showDone ? "saved" : "open"} review feedback.
          </p>
        )}
      </div>
    </details>
  );
}
