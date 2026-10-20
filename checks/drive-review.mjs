import assert from "node:assert/strict";
import { Writable } from "node:stream";
import { once } from "node:events";
import { parseDriveLink, timecode } from "../lib/drive-review.js";
import { seal, unseal } from "../lib/server-drive.js";
import handler from "../api/drive.js";

process.env.DRIVE_BRIDGE_SECRET = "test-bridge-secret-at-least-32-characters";
process.env.SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_PUBLISHABLE_KEY = "test";
const fileId = "private_video_123";
let file = { id: fileId, name: "cut.mp4", mimeType: "video/mp4", md5Checksum: "abc", capabilities: { canDownload: true } };
let metadataStatus = 200, streamStatus = 206, visible = true, mediaCalls = 0, calls = [];
let video = { id: "project", kind: "video", versions: [] };
globalThis.fetch = async (value, options = {}) => {
  const url = String(value); calls.push({ url, options });
  if (url.endsWith("/auth/v1/user")) {
    const token = options.headers.Authorization.slice(7);
    return Response.json(token === "bad" ? {} : { id: token, email: "member@example.com", email_confirmed_at: "2026-10-20", app_metadata: { wamarket_access: true, wamarket_role: token } });
  }
  if (url.includes("route=state")) return Response.json({ records: visible ? [{ id: video.id, data: video }] : [] });
  if (url.includes("route=drive-config")) return Response.json({ data: { encrypted: seal({ refreshToken: "refresh-secret", clientId: "client", clientSecret: "client-secret" }) } });
  if (url.includes("oauth2.googleapis.com")) return Response.json({ access_token: "google-secret" });
  if (url.includes("alt=media")) {
    mediaCalls++;
    return new Response(streamStatus === 416 ? null : "abc", { status: streamStatus, headers: { "content-range": streamStatus === 416 ? "bytes */3" : "bytes 0-2/3", "content-length": "3", "accept-ranges": "bytes" } });
  }
  if (url.startsWith("https://www.googleapis.com/drive/v3/files/")) return Response.json(file, { status: metadataStatus });
  throw Error("Unexpected outbound URL: " + url);
};
async function run(route, { body, role = "coordinator", query = {}, headers = {}, method } = {}) {
  const chunks = [];
  const res = new Writable({ write(chunk, _, cb) { chunks.push(chunk); cb(); } });
  res.code = 200; res.headers = {};
  res.setHeader = (key, value) => { res.headers[key.toLowerCase()] = value; };
  res.status = (code) => { res.code = code; return res; };
  res.json = (data) => { res.data = data; res.end(); return res; };
  await handler({ query: { route, videoId: "project", versionId: "v1", ...query }, body,
    method: method || (body ? "POST" : "GET"), headers: { cookie: "wam_cloud_session=" + role, origin: "https://wamark.finishmylaunch.com", ...headers } }, res);
  if (!res.writableFinished) await once(res, "finish");
  res.bytes = Buffer.concat(chunks).toString();
  return res;
}
let passed = 0;
async function check(name, fn) { await fn(); passed++; console.log("PASS " + name); }
const link = "https://drive.google.com/file/d/" + fileId + "/view?resourcekey=key_123";
await check("Drive share URL variants retain resource keys", () => {
  for (const url of [link, `https://drive.google.com/open?id=${fileId}`, `https://drive.google.com/uc?id=${fileId}`, `https://drive.google.com/file/d/${fileId}/preview`]) assert.equal(parseDriveLink(url).fileId, fileId);
  assert.equal(parseDriveLink(link).resourceKey, "key_123");
});
await check("Reject arbitrary URLs, spoofed hosts, folders and malformed IDs", () => {
  for (const url of ["http://drive.google.com/file/d/1234567890/view", "https://drive.google.com.evil.test/file/d/1234567890/view", "https://evil.test", "https://drive.google.com/drive/folders/1234567890", "https://drive.google.com/open?id=../x", "https://user@drive.google.com/open?id=1234567890"]) assert.throws(() => parseDriveLink(url));
});
await check("Millisecond timecodes carry correctly across minute/hour boundaries", () => {
  assert.equal(timecode(59.9996), "01:00.000"); assert.equal(timecode(3599.9996), "60:00.000"); assert.equal(timecode(42.125), "00:42.125"); assert.equal(timecode(Infinity), "00:00.000");
});
let source;
await check("Link returns a project-bound encrypted reference without uploading", async () => {
  const res = await run("review-link", { body: { videoId: "project", link } });
  assert.equal(res.code, 200); source = res.data.source;
  assert.equal(unseal(source.reference).videoId, "project");
  assert.equal(unseal(source.reference).checksum, "abc");
  assert(!JSON.stringify(res.data).includes("secret")); assert.equal(mediaCalls, 0);
  assert(calls.every((call) => !call.url.includes("upload")));
  video.versions.push({ id: "v1", source });
});
await check("Private native playback streams exact byte ranges without credentials", async () => {
  const res = await run("review-file", { headers: { range: "bytes=0-2" } });
  assert.equal(res.code, 206); assert.equal(res.bytes, "abc");
  assert.equal(res.headers["content-range"], "bytes 0-2/3"); assert.equal(res.headers["cache-control"], "no-store");
  const call = calls.findLast((x) => x.url.includes("alt=media"));
  assert.equal(call.options.headers.Range, "bytes=0-2");
  assert.equal(call.options.headers["X-Goog-Drive-Resource-Keys"], fileId + "/key_123");
  assert(!JSON.stringify(res.headers).includes("google-secret"));
});
await check("Unauthenticated, viewer, QA and cross-origin linking are blocked", async () => {
  assert.equal((await run("review-file", { role: "bad" })).code, 401);
  for (const role of ["viewer", "qa"]) assert.equal((await run("review-link", { role, body: { videoId: "project", link } })).code, 403);
  assert.equal((await run("review-link", { body: { videoId: "project", link }, headers: { origin: "https://evil.test" } })).code, 403);
  assert.equal((await run("review-link", { method: "GET" })).code, 405);
});
await check("Private project visibility is enforced before any Drive lookup", async () => {
  visible = false; const before = calls.length;
  assert.equal((await run("review-file")).code, 404);
  assert(!calls.slice(before).some((c) => c.url.includes("googleapis")));
  visible = true;
});
await check("Changed contents are blocked while old annotations stay tied to original revision", async () => {
  file.md5Checksum = "new"; const before = mediaCalls;
  assert.equal((await run("review-file")).code, 409); assert.equal(mediaCalls, before);
  const revised = await run("review-link", { body: { videoId: "project", link } });
  assert.equal(unseal(revised.data.source.reference).checksum, "new");
  assert.equal(unseal(source.reference).checksum, "abc"); file.md5Checksum = "abc";
});
await check("Tampered references, wrong projects and missing versions cannot stream", async () => {
  video.versions[0].source = { provider: "gdrive-link", reference: seal({ fileId, videoId: "other", checksum: "abc" }) };
  assert.equal((await run("review-file")).code, 403);
  video.versions[0].source.reference = "invalid";
  assert.equal((await run("review-file")).code, 400);
  video.versions[0].source = source;
  assert.equal((await run("review-file", { query: { versionId: "missing" } })).code, 404);
});
await check("Deleted, restricted, non-video and missing Drive files fail gracefully", async () => {
  file.trashed = true; assert.equal((await run("review-file")).code, 410); delete file.trashed;
  file.capabilities.canDownload = false; assert.equal((await run("review-file")).code, 403); file.capabilities.canDownload = true;
  file.mimeType = "image/png"; assert.equal((await run("review-file")).code, 400); file.mimeType = "video/mp4";
  metadataStatus = 404; assert.equal((await run("review-file")).code, 403); metadataStatus = 200;
});
await check("Invalid ranges and upstream 416/429 preserve appropriate status", async () => {
  assert.equal((await run("review-file", { headers: { range: "bytes=1-2,4-5" } })).code, 416);
  streamStatus = 416; const res = await run("review-file"); assert.equal(res.code, 416); assert.equal(res.headers["content-range"], "bytes */3");
  streamStatus = 429; assert.equal((await run("review-file")).code, 429); streamStatus = 206;
});
console.log(`${passed} Drive review integration checks passed (mocked Google and WAM services).`);
