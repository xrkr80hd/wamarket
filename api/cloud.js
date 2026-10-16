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
    ].includes(route)
  )
    return res.status(404).json({ error: "Not found" });
  try {
    const r = await fetch(
      url + "/functions/v1/wamarket-workspace?route=" + route,
      {
        method: req.method,
        headers: {
          apikey: key,
          Authorization: "Bearer " + decodeURIComponent(token),
          "Content-Type": "application/json",
          "X-Wam-User": req.headers["x-wam-user"] || "",
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
    return res.status(r.status).json(await r.json());
  } catch {
    return res
      .status(502)
      .json({ error: "Workspace service unavailable. Try again." });
  }
}
