# Drive-linked video review

## Architecture audit

The deployed application is a Vite/React client with Vercel Node API handlers (`vercel.json`), not the older Next/Cloudflare routes still present in `app/api`. `app/video-review.tsx` renders a native HTML video element. `lib/review-actions.ts` manages revisions, per-version annotations, IN/OUT ranges, approvals, revision tasks, and Messenger annotation references. `lib/cloud-workspace.ts` synchronizes these records through `/api/cloud` to the Supabase workspace function, with optimistic record versions. Notifications derive from those existing record changes.

WAM's confirmed, active team membership is checked against Supabase Auth; private records are filtered using `privateMembers`. Uploaded originals use the existing Drive upload bridge when connected, with Supabase Storage fallback and IndexedDB in the local preview. Existing Drive uploads must match the workspace folder and WAM app properties. That upload verification remains unchanged.

The existing Google connection is **one workspace Google account**, connected by the master administrator, not an individual Google login for each reviewer. Its OAuth configuration and refresh token are encrypted on the server. The current connection already requests the Drive scope; this feature adds no OAuth scopes.

## Implementation

- Select/create a video project, choose **Paste Google Drive Link**, and **Save & review**. The new version belongs to that video and its existing campaign/project relationship. Upload remains available alongside the link option.
- Parse supported `drive.google.com/file/d/…`, `open?id=…`, and `uc?id=…` links. A link is never fetched directly; calls use only the fixed Google API origin. Resource keys and shared-drive files are supported.
- `POST /api/drive?route=review-link` checks WAM membership, readable video project, production role, request origin, Drive MIME type, trash state, and `capabilities.canDownload`. It returns only a filename and an encrypted reference bound to the project and original content checksum.
- Each version has its own UUID, annotations, reviews and status. The workspace function prevents changing a linked version's source in place or reusing version IDs. Add another revision for another cut.
- `GET /api/drive?route=review-file&videoId=…&versionId=…` resolves the saved, readable revision, checks Drive permission and checksum again, and streams `files.get?alt=media` with Range/206/416 support into the existing native player. There is no iframe timing API, public sharing requirement, duplicate upload, durable media cache, or Google token in the client.
- Native controls provide play/pause/seek; the existing speed control updates `playbackRate`. Timestamps read the media clock, carry correctly at minute boundaries, and seek through `currentTime`. Messenger jumps wait for metadata rather than assuming a fixed loading delay. Switching revisions clears prior draft timing. Annotations cannot be saved until metadata loads.

## Configuration and access

Retain the existing server variables `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `DRIVE_BRIDGE_SECRET`, and the existing encrypted Drive integration. The bridge secret must remain stable or existing encrypted references become unreadable. Connect Google Drive through Team & Settings. The callback remains `https://wamark.finishmylaunch.com/api/drive?route=callback`.

The linked video must be readable and downloadable by the **connected workspace Google account**. Share private files with that account; they do not need public access or to be moved into WAM's upload folder. Linking intentionally makes the video reviewable by WAM users who can read its video project. This does not implement reviewer-by-reviewer Google OAuth or claim that each reviewer's personal Drive permissions are checked.

The website API change and workspace function source validation must eventually be released together. No SQL migration, new bucket, or change to Drive file permissions is required. Nothing was committed, pushed, merged or deployed during implementation.

## Limits

- Original bytes must use a codec the reviewer's browser supports, preferably MP4 H.264/AAC or WebM. Drive's web preview may transcode formats the native player cannot decode; the API proxy does not transcode them.
- Existing linked revisions fail safely if a file is deleted, trashed, permission-restricted, or its bytes are overwritten. To keep older revisions playable, retain each cut as a separate Drive file. A new link to overwritten bytes creates a new review revision, but cannot recover deleted original bytes.
- Media is transferred through the authenticated website function. Drive quota, network speed, and hosting execution/bandwidth limits still apply; long streams can require a range retry. There is no additional stored copy.
- The player stores millisecond annotations; actual seek presentation depends on the media encoding/browser and has not been measured against live private Drive footage here.

## Verification

Passed: `npm run build`; `node checks/drive-review.mjs` (11 grouped API/security/streaming/timecode checks with mocked Google/WAM services); `node checks/cloud-drive.mjs` (16 existing OAuth/encryption checks); `node checks/cloud-auth.mjs` (15 existing authentication checks); `node checks/run.mjs` (25 workflow groups including linked revisions, timestamped feedback, per-cut approvals, Messenger sharing and preserving upload); `node checks/notifications.mjs` (notifications plus server-side source immutability); `node checks/notification-worker.mjs` (push/badge/logout regression); JavaScript syntax and whitespace checks.

The production build emits the existing large-chunk advisory. No dependency was added; `package-lock.json` records the dependency versions used for this build.

**Not verified:** live OAuth/Drive streaming, real-browser seek accuracy, mobile touch playback and responsive visual layout. An isolated local video fixture was prepared, but the available remote browser returned `ERR_CONNECTION_REFUSED` for the local development server. There was no supported forwarding tool, and no deployment was authorized. The mocked byte-range tests are not a substitute for these checks.

Before release, test a private browser-compatible video with the connected Google account on desktop and Android/iOS: link it, play/pause, seek to a known timestamp, change speed, save an IN/OUT annotation, jump via its timeline and Messenger, add a second cut, and confirm independent comments and approvals. Also verify a different WAM account, private project restrictions, revoked Drive download permission, a deleted file, and an overwritten source. Compare marker timestamps to the native player's `currentTime`; verify no horizontal overflow at mobile widths.

Google API reference: https://developers.google.com/workspace/drive/api/guides/manage-downloads
