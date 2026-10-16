import { roleLabel } from "../lib/dashboard";
import DriveSettings from "./drive-settings";
import { useEffect, useState } from "react";
async function users(body?: any) {
  const r = await fetch("/api/accounts?route=users", {
    method: body ? "POST" : "GET",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const d = await r.json();
  if (!r.ok) throw Error(d.error || "Unable to manage users.");
  return d;
}
export default function CloudAccounts() {
  const [list, L] = useState<any[]>([]),
    [draft, D] = useState<any>(null),
    [error, E] = useState(""),
    [busy, B] = useState(false),
    [notice, N] = useState("");
  async function load() {
    try {
      const d = await users();
      L(d.users);
    } catch (e: any) {
      E(e.message);
    }
  }
  useEffect(() => {
    load();
  }, []);
  return (
    <>
      <DriveSettings />
      <section className="card panel">
        <div className="sectionhead">
          <div>
            <h2>Team members</h2>
            <p>Add people, choose their role, and manage workspace access.</p>
          </div>
          <button
            onClick={() => {
              D({
                name: "",
                email: "",
                password: "",
                role: "viewer",
                active: true,
              });
              E("");
              N("");
            }}
          >
            ＋ Add person
          </button>
        </div>
        {error && <p role="alert">{error}</p>}
        {notice && <p role="status">{notice}</p>}
        {list.map((p) => (
          <div className="cloud-user-row" key={p.id}>
            <div>
              <b>{p.name}</b>
              <small>
                {p.email} ·{" "}
                {p.isAdmin ? "Master administrator" : roleLabel(p.role)} ·{" "}
                {p.active ? "Active" : "Inactive"}
              </small>
            </div>
            {!p.isAdmin && (
              <button
                onClick={() => {
                  D({ ...p, password: "" });
                  E("");
                  N("");
                }}
              >
                Edit access
              </button>
            )}
          </div>
        ))}
        {draft && (
          <div className="overlay">
            <form
              className="modal cloud-user-form"
              role="dialog"
              aria-modal="true"
              aria-label={draft.id ? "Edit team member" : "Add team member"}
              onSubmit={async (e) => {
                e.preventDefault();
                B(true);
                E("");
                try {
                  await users(draft);
                  N(
                    draft.id
                      ? "Access updated."
                      : "Account created. Share the initial password with this person privately.",
                  );
                  D(null);
                  await load();
                } catch (e: any) {
                  E(e.message);
                } finally {
                  B(false);
                }
              }}
            >
              <h2>{draft.id ? "Edit team member" : "Add team member"}</h2>
              <label>
                Name
                <input
                  required
                  autoFocus
                  value={draft.name}
                  onChange={(e) => D({ ...draft, name: e.target.value })}
                />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  readOnly={!!draft.id}
                  value={draft.email}
                  onChange={(e) => D({ ...draft, email: e.target.value })}
                />
              </label>
              <label>
                {draft.id ? "New password (optional)" : "Initial password"}
                <input
                  type="password"
                  autoComplete="new-password"
                  required={!draft.id}
                  minLength={12}
                  value={draft.password}
                  onChange={(e) => D({ ...draft, password: e.target.value })}
                />
              </label>
              <label>
                Role
                <select
                  value={draft.role}
                  onChange={(e) => D({ ...draft, role: e.target.value })}
                >
                  <option value="viewer">Viewer</option>
                  <option value="qa">Q/A</option>
                  <option value="coordinator">
                    Marketing Media Coordinator
                  </option>
                  <option value="owner">Marketing Manager</option>
                  <option value="executive">Executive reviewer</option>
                </select>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(e) => D({ ...draft, active: e.target.checked })}
                />
                Active access
              </label>
              {error && <p role="alert">{error}</p>}
              <div className="modalactions">
                <button type="button" disabled={busy} onClick={() => D(null)}>
                  Cancel
                </button>
                <button disabled={busy}>
                  {busy
                    ? "Saving…"
                    : draft.id
                      ? "Save changes"
                      : "Create account"}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </>
  );
}
