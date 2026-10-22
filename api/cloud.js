import { driveUpload, verifyDriveAsset } from "../lib/server-drive.js";
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const url = process.env.SUPABASE_URL,
    key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key)
    return res.status(503).json({ error: "Workspace service unavailable." });
  if (
    req.method !== "GET" &&
    req.headers.origin !== `https://${req.headers.host}`
  )
    return res.status(403).json({ error: "Invalid request origin" });
  const token = (req.headers.cookie || "")
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith("wam_cloud_session="))
    ?.slice(18);
  if (!token) return res.status(401).json({ error: "Sign in to continue." });
  const route = String(req.query?.route || "state");
  if (
    ![
      "state",
      "record",
      "personal",
      "media-upload",
      "media-read",
      "presence",
      "notifications",
    ].includes(route)
  )
    return res.status(404).json({ error: "Not found" });
  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const bearer = decodeURIComponent(token);
    if (route === "media-upload" && req.method === "POST" &&
        !String(body.type || "").startsWith("video/")) {
      // Video uploads use the team's Supabase bucket, not Drive OAuth.
      const drive = await driveUpload(bearer, body);
      if (drive) return res.json(drive);
    }
    if (route === "record" && body.record?.storage?.provider === "gdrive")
      await verifyDriveAsset(bearer, body.record);
    const r = await fetch(
      url + "/functions/v1/wamarket-workspace?route=" + route,
      {
        method: req.method,
        headers: {
          apikey: key,
          Authorization: "Bearer " + decodeURIComponent(token),
          "Content-Type": "application/json",
          "X-Wam-User": req.headers["x-wam-user"] || "",
          ...(body.record?.storage?.provider === "gdrive"
            ? { "X-Drive-Bridge": process.env.DRIVE_BRIDGE_SECRET || "" }
            : {}),
        },
        ...(req.method === "POST"
          ? {
              body:
                typeof req.body === "string"
                  ? req.body
                  : JSON.stringify(req.body),
            }
          : {}),
      },
    );
    const data = await r.json();
    if (route === "media-read" && data.provider === "gdrive")
      return res.json({
        url: "/api/drive?route=file&id=" + encodeURIComponent(body.id),
      });
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(e.status || 502).json({
      error: e.message || "Workspace service unavailable. Try again.",
    });
  }
}
