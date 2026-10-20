import { randomBytes } from "node:crypto";
import { Readable } from "node:stream";
import {
  parseDriveLink,
  driveVideoMetadata,
  driveHeaders,
} from "../lib/drive-review.js";
import {
  SITE,
  CALLBACK,
  sessionToken,
  me,
  seal,
  unseal,
  driveConfig,
  saveDriveConfig,
  googleToken,
  edge,
  verifyDriveAsset,
} from "../lib/server-drive.js";
const MASTER = "xrkr80hd@gmail.com";
export const config = { maxDuration: 300 };
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  const route = req.query?.route || "status";
  try {
    let token = sessionToken(req);
    if (route === "callback") {
      const raw = (req.headers.cookie || "")
        .split(";")
        .map((x) => x.trim())
        .find((x) => x.startsWith("wam_drive_oauth="))
        ?.slice(16);
      if (!raw) throw Error("Google connection expired. Start again.");
      const state = unseal(decodeURIComponent(raw));
      if (state.nonce !== req.query.state || Date.now() > state.expires)
        throw Error("Invalid Google authorization state.");
      token = state.token;
      const u = await me(token);
      if (u.email?.toLowerCase() !== MASTER)
        throw Error("Master administrator required.");
      const c = await driveConfig(token);
      const r = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: String(req.query.code || ""),
          client_id: c.clientId,
          client_secret: c.clientSecret,
          redirect_uri: CALLBACK,
          grant_type: "authorization_code",
        }),
      });
      const d = await r.json();
      if (!r.ok || !d.refresh_token)
        throw Error(
          "Google did not grant ongoing access. Reconnect and approve access.",
        );
      await saveDriveConfig(token, {
        ...c,
        refreshToken: d.refresh_token,
        connectedAt: new Date().toISOString(),
      });
      res.setHeader(
        "Set-Cookie",
        "wam_drive_oauth=; Path=/api/drive; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
      );
      return res.redirect(303, SITE + "/?drive=connected");
    }
    const u = await me(token),
      admin = u.email?.toLowerCase() === MASTER;
    if (route === "review-link" || route === "review-file") {
      if (req.method !== (route === "review-link" ? "POST" : "GET"))
        return res.status(405).json({ error: "Method not allowed" });
      if (route === "review-link" && req.headers.origin !== SITE)
        return res.status(403).json({ error: "Invalid request origin" });
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const videoId = String(
        route === "review-link" ? body.videoId || "" : req.query.videoId || "",
      );
      // The existing state endpoint applies team membership and privateMembers ACLs.
      const state = await edge(token, "state");
      const video = state.records.find((row) => row.id === videoId)?.data;
      if (!video || video.kind !== "video" || video.archived)
        return res.status(404).json({ error: "Video project not found." });
      if (
        route === "review-link" &&
        !admin &&
        !["owner", "executive", "coordinator"].includes(
          u.app_metadata?.wamarket_role,
        )
      )
        return res
          .status(403)
          .json({ error: "Only the production team can add video revisions." });
      const access = await googleToken(await driveConfig(token));
      if (route === "review-link") {
        const source = parseDriveLink(String(body.link || ""));
        const file = await driveVideoMetadata(access, source);
        return res.json({
          name: file.name,
          source: {
            provider: "gdrive-link",
            reference: seal({ ...source, videoId, checksum: file.md5Checksum }),
          },
        });
      }
      const version = video.versions?.find((v) => v.id === req.query.versionId);
      if (version?.source?.provider !== "gdrive-link")
        return res.status(404).json({ error: "Drive revision not found." });
      const source = unseal(version.source.reference);
      if (source.videoId !== videoId)
        return res.status(403).json({ error: "Invalid Drive revision." });
      const file = await driveVideoMetadata(access, source);
      if (file.md5Checksum !== source.checksum)
        return res
          .status(409)
          .json({
            error:
              "The Drive video contents changed. Add its link as a new revision to preserve existing timestamps.",
          });
      const range = req.headers.range;
      if (range && !/^bytes=\d*-\d*$/.test(range))
        return res.status(416).json({ error: "Invalid video byte range." });
      const controller = new AbortController();
      res.on?.("close", () => controller.abort());
      const upstream = await fetch(
        "https://www.googleapis.com/drive/v3/files/" +
          encodeURIComponent(source.fileId) +
          "?alt=media&supportsAllDrives=true",
        {
          headers: {
            ...driveHeaders(access, source),
            ...(range ? { Range: range } : {}),
          },
          redirect: "error",
          signal: controller.signal,
        },
      );
      if (upstream.status === 416) {
        if (upstream.headers.get("content-range"))
          res.setHeader("Content-Range", upstream.headers.get("content-range"));
        return res.status(416).end();
      }
      if (!upstream.ok)
        return res
          .status(upstream.status === 429 ? 429 : 403)
          .json({
            error:
              "Drive could not stream this video. Check its permissions or try again shortly.",
          });
      res.status(upstream.status);
      res.setHeader("Content-Type", file.mimeType);
      res.setHeader("X-Content-Type-Options", "nosniff");
      for (const name of ["content-length", "content-range", "accept-ranges"]) {
        const value = upstream.headers.get(name);
        if (value) res.setHeader(name, value);
      }
      // No buffering, upload, public URL, or Google credential reaches the client.
      Readable.fromWeb(upstream.body)
        .on("error", () => res.destroy())
        .pipe(res);
      return;
    }
    if (route === "status") {
      const c = await driveConfig(token);
      return res.json({
        configured: !!c?.clientId,
        connected: !!c?.refreshToken,
        folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
        callback: CALLBACK,
      });
    }
    if (route === "file") {
      const d = await edge(token, "media-read", {
        id: String(req.query.id || ""),
      });
      if (d.provider !== "gdrive") throw Error("File not found.");
      await verifyDriveAsset(token, {
        id: d.assetId,
        storage: { fileId: d.fileId },
      });
      const c = await driveConfig(token),
        access = await googleToken(c);
      const upstream = await fetch(
        "https://www.googleapis.com/drive/v3/files/" +
          encodeURIComponent(d.fileId) +
          "?alt=media",
        {
          headers: {
            Authorization: "Bearer " + access,
            ...(req.headers.range ? { Range: req.headers.range } : {}),
          },
        },
      );
      if (!upstream.ok) throw Error("Unable to open Drive file.");
      res.status(upstream.status);
      for (const h of [
        "content-type",
        "content-length",
        "content-range",
        "accept-ranges",
      ]) {
        const v = upstream.headers.get(h);
        if (v) res.setHeader(h, v);
      }
      Readable.fromWeb(upstream.body).pipe(res);
      return;
    }
    if (!admin)
      return res
        .status(403)
        .json({ error: "Only the master administrator can connect storage." });
    if (route === "configure" && req.method === "POST") {
      if (req.headers.origin !== SITE)
        return res.status(403).json({ error: "Invalid request origin" });
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const c = body?.web;
      if (
        !c?.client_id ||
        !c.client_secret ||
        !c.redirect_uris?.includes(CALLBACK)
      )
        throw Error(
          "Upload the Web application OAuth JSON with this site’s callback configured.",
        );
      await saveDriveConfig(token, {
        clientId: c.client_id,
        clientSecret: c.client_secret,
        folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
      });
      return res.json({ ok: true });
    }
    if (route === "connect" && req.method === "GET") {
      const c = await driveConfig(token);
      if (!c?.clientId)
        throw Error("Upload your Google OAuth JSON in Team & Settings first.");
      const nonce = randomBytes(32).toString("hex");
      res.setHeader(
        "Set-Cookie",
        "wam_drive_oauth=" +
          encodeURIComponent(
            seal({ nonce, token, expires: Date.now() + 600000 }),
          ) +
          "; Path=/api/drive; HttpOnly; Secure; SameSite=Lax; Max-Age=600",
      );
      const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      auth.search = new URLSearchParams({
        client_id: c.clientId,
        redirect_uri: CALLBACK,
        response_type: "code",
        scope: "https://www.googleapis.com/auth/drive",
        access_type: "offline",
        prompt: "consent",
        state: nonce,
      }).toString();
      return res.redirect(302, auth.toString());
    }
    return res.status(404).json({ error: "Not found" });
  } catch (e) {
    if (res.headersSent) {
      res.destroy();
      return;
    }
    return res
      .status(e.status || 400)
      .json({ error: e.message || "Google Drive connection failed." });
  }
}
