const MASTER = "xrkr80hd@gmail.com";
const publicUser = (u) => ({
  id: u.id,
  email: u.email,
  name:
    u.user_metadata?.name ||
    (u.email?.toLowerCase() === MASTER ? "Travis" : "Team member"),
  role:
    u.email?.toLowerCase() === MASTER
      ? "owner"
      : u.app_metadata?.wamarket_role || "viewer",
  isAdmin: u.email?.toLowerCase() === MASTER,
  active: u.app_metadata?.wamarket_active !== false,
});
export function createAccountHandler(env = process.env, fetcher = fetch) {
  const url = env.SUPABASE_URL,
    key = env.SUPABASE_PUBLISHABLE_KEY;
  async function call(path, method = "GET", body, token) {
    const r = await fetcher(url + path, {
      method,
      headers: {
        apikey: key,
        ...(token ? { Authorization: "Bearer " + token } : {}),
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const d = await r.json();
    if (!r.ok)
      throw Object.assign(
        Error(
          d.error_description ||
            d.msg ||
            d.message ||
            d.error ||
            "Account request failed",
        ),
        { status: r.status },
      );
    return d;
  }
  const authorized = (u) =>
    u?.email_confirmed_at &&
    (u.email?.toLowerCase() === MASTER ||
      u.app_metadata?.wamarket_access === true) &&
    u.app_metadata?.wamarket_active !== false;
  const cookie = (res, token = "", seconds = 0) =>
    res.setHeader(
      "Set-Cookie",
      `wam_cloud_session=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${seconds}`,
    );
  return async (req, res) => {
    const send = (status, data) => {
      res.setHeader("Cache-Control", "no-store");
      return res.status(status).json(data);
    };
    const route = req.query?.route || "me";
    try {
      if (!url || !key)
        return send(503, {
          error:
            "Sign-in service is unavailable. Please contact your administrator.",
        });
      if (
        req.method !== "GET" &&
        req.headers.origin !== `https://${req.headers.host}`
      )
        return send(403, { error: "Invalid request origin" });
      const b =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      if (JSON.stringify(b).length > 20000)
        return send(413, { error: "Request too large" });
      if (["bootstrap", "login"].includes(route) && req.method === "POST") {
        const email = String(b.email || "")
          .trim()
          .toLowerCase();
        if (route === "bootstrap")
          await call("/functions/v1/wamarket-admin", "POST", {
            action: "bootstrap",
            setupKey: b.setupKey,
            email,
            password: b.password,
          });
        const data = await call("/auth/v1/token?grant_type=password", "POST", {
          email,
          password: b.password,
        });
        if (!authorized(data.user))
          return send(403, {
            error: "This account does not have workspace access.",
          });
        cookie(res, data.access_token, Math.min(data.expires_in || 3600, 3600));
        return send(200, { user: publicUser(data.user) });
      }
      if (route === "logout" && req.method === "POST") {
        cookie(res);
        return send(200, { ok: true });
      }
      const token = (req.headers.cookie || "")
        .split(";")
        .map((s) => s.trim())
        .find((s) => s.startsWith("wam_cloud_session="))
        ?.slice(18);
      if (!token) return send(401, { error: "Sign in to continue." });
      const bearer = decodeURIComponent(token),
        me = await call("/auth/v1/user", "GET", undefined, bearer);
      if (!authorized(me))
        return send(403, { error: "Workspace access is unavailable." });
      if (route === "me" && req.method === "GET")
        return send(200, { user: publicUser(me) });
      if (route === "profile" && req.method === "POST") {
        const name = String(b.name || "").trim();
        if (!name || name.length > 100)
          return send(400, {
            error: "Enter your name (up to 100 characters).",
          });
        const updated = await call(
          "/auth/v1/user",
          "PUT",
          { data: { name } },
          bearer,
        );
        return send(200, { user: publicUser(updated) });
      }
      if (route !== "users") return send(404, { error: "Not found" });
      if (me.email?.toLowerCase() !== MASTER)
        return send(403, {
          error: "Only the master administrator can manage users.",
        });
      if (!["GET", "POST"].includes(req.method))
        return send(405, { error: "Method not allowed" });
      return send(
        200,
        await call(
          "/functions/v1/wamarket-admin",
          req.method,
          req.method === "POST" ? b : undefined,
          bearer,
        ),
      );
    } catch (e) {
      const status = [400, 401, 403, 422, 429].includes(e.status)
        ? e.status
        : 500;
      return send(status, {
        error:
          route === "login" && status === 400
            ? "Email or password not recognized. If you have not created your account, use your private setup link."
            : e.message || "Unable to complete account request.",
      });
    }
  };
}
export default createAccountHandler();
