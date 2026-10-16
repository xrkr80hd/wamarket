const MASTER = "xrkr80hd@gmail.com";
const BOOTSTRAP_HASH =
  "2c6553e5d345fd28ee66970fe6348c9324d6d3979ddfd78aea82bb664ed2bb17";
const BOOTSTRAP_EXPIRES = 1792257379938;
const publicUser = (u) => ({
  id: u.id,
  email: u.email,
  name: u.user_metadata?.name || u.email,
  role:
    u.email?.toLowerCase() === MASTER
      ? "coordinator"
      : u.app_metadata?.wamarket_role || "viewer",
  isAdmin: u.email?.toLowerCase() === MASTER,
  active: u.app_metadata?.wamarket_active !== false,
});
export function createAdminHandler(env, fetcher = fetch) {
  const url = env.SUPABASE_URL,
    key = env.SUPABASE_SERVICE_ROLE_KEY;
  async function auth(path, method = "GET", body, token = key) {
    const r = await fetcher(url + "/auth/v1/" + path, {
      method,
      headers: {
        apikey: key,
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const d = await r.json();
    if (!r.ok)
      throw Object.assign(
        Error(d.msg || d.message || "Account request failed"),
        { status: r.status },
      );
    return d;
  }
  return async (req) => {
    const send = (status, data) =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      });
    try {
      if (!url || !key)
        return send(503, { error: "Account service unavailable." });
      if (!["GET", "POST"].includes(req.method))
        return send(405, { error: "Method not allowed" });
      const raw = req.method === "POST" ? await req.text() : "";
      if (raw.length > 20000) return send(413, { error: "Request too large" });
      const b = raw ? JSON.parse(raw) : {};
      if (b.action === "bootstrap") {
        const digest = Array.from(
          new Uint8Array(
            await crypto.subtle.digest(
              "SHA-256",
              new TextEncoder().encode(String(b.setupKey || "")),
            ),
          ),
        )
          .map((x) => x.toString(16).padStart(2, "0"))
          .join("");
        if (digest !== BOOTSTRAP_HASH || Date.now() > BOOTSTRAP_EXPIRES)
          return send(403, { error: "This setup link is invalid or expired." });
        if (
          String(b.email || "")
            .trim()
            .toLowerCase() !== MASTER
        )
          return send(403, {
            error: "This setup link is for the master administrator.",
          });
        if (typeof b.password !== "string" || b.password.length < 12)
          return send(400, {
            error: "Use a password of at least 12 characters.",
          });
        // Auth enforces unique emails: replay can never reset an existing account.
        const u = await auth("admin/users", "POST", {
          email: MASTER,
          password: b.password,
          email_confirm: true,
          user_metadata: { name: "Travis" },
          app_metadata: {
            wamarket_access: true,
            wamarket_role: "coordinator",
            wamarket_active: true,
          },
        });
        return send(201, { user: publicUser(u) });
      }
      const token = (req.headers.get("Authorization") || "").replace(
        /^Bearer /,
        "",
      );
      if (!token) return send(401, { error: "Sign in to continue." });
      const me = await auth("user", "GET", undefined, token);
      if (
        !me.email_confirmed_at ||
        me.email?.toLowerCase() !== MASTER ||
        me.app_metadata?.wamarket_active === false
      )
        return send(403, {
          error: "Only the master administrator can manage users.",
        });
      if (req.method === "GET") {
        let users = [];
        for (let page = 1; page <= 100; page++) {
          const d = await auth("admin/users?page=" + page + "&per_page=100");
          users.push(...d.users);
          if (d.users.length < 100) break;
        }
        return send(200, {
          users: users
            .filter(
              (u) =>
                u.email?.toLowerCase() === MASTER ||
                u.app_metadata?.wamarket_access === true,
            )
            .map(publicUser),
        });
      }
      if (
        !["owner", "coordinator", "executive", "viewer", "qa"].includes(
          b.role,
        ) ||
        !String(b.name || "").trim() ||
        !/^\S+@\S+\.\S+$/.test(b.email || "")
      )
        return send(400, { error: "Enter a name, valid email and role." });
      if (
        (!b.id || b.password) &&
        (typeof b.password !== "string" || b.password.length < 12)
      )
        return send(400, {
          error: "Use a password of at least 12 characters.",
        });
      let prior;
      if (b.id) {
        prior = await auth("admin/users/" + encodeURIComponent(b.id));
        if (prior.email?.toLowerCase() === MASTER)
          return send(403, {
            error: "The master administrator cannot be modified here.",
          });
        if (prior.app_metadata?.wamarket_access !== true)
          return send(403, { error: "This account is outside Walker Suite." });
        if (prior.email.toLowerCase() !== b.email.trim().toLowerCase())
          return send(400, { error: "Email changes are not supported." });
      }
      const payload = {
        email: b.email.trim().toLowerCase(),
        ...(b.password ? { password: b.password } : {}),
        user_metadata: { ...prior?.user_metadata, name: b.name.trim() },
        app_metadata: {
          ...prior?.app_metadata,
          wamarket_access: true,
          wamarket_role: b.role,
          wamarket_active: b.active !== false,
        },
        ...(!prior ? { email_confirm: true } : {}),
      };
      const u = await auth(
        prior ? "admin/users/" + encodeURIComponent(b.id) : "admin/users",
        prior ? "PUT" : "POST",
        payload,
      );
      return send(prior ? 200 : 201, { user: publicUser(u) });
    } catch (e) {
      return send(
        [400, 401, 403, 422, 429].includes(e.status) ? e.status : 500,
        { error: e.message || "Account service failed." },
      );
    }
  };
}
