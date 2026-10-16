import { randomBytes } from "node:crypto";
import { Readable } from "node:stream";
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
    return res
      .status(e.status || 400)
      .json({ error: e.message || "Google Drive connection failed." });
  }
}
