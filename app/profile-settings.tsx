import { useState } from "react";
import { user, people, setUser } from "../lib/preview-store";
import { roleLabel } from "../lib/dashboard";
export default function ProfileSettings() {
  const [name, N] = useState(user().name),
    [message, M] = useState(""),
    [busy, B] = useState(false);
  return (
    <section className="card panel">
      <h2>My profile</h2>
      <p>{roleLabel(user().role, user().isAdmin)}</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          B(true);
          try {
            const r = await fetch("/api/accounts?route=profile", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name }),
            });
            const d = await r.json();
            if (!r.ok) throw Error(d.error);
            const index = people.findIndex((p) => p.id === d.user.id);
            people[index] = d.user;
            setUser(d.user.id);
            window.dispatchEvent(new Event("wam-auth-refresh"));
            M("Saved");
          } catch (e: any) {
            M(e.message);
          } finally {
            B(false);
          }
        }}
      >
        <label>
          Display name
          <input
            required
            value={name}
            maxLength={100}
            onChange={(e) => N(e.target.value)}
          />
        </label>
        <button disabled={busy}>{busy ? "Saving…" : "Save"}</button>
        {message && <p role="status">{message}</p>}
      </form>
    </section>
  );
}
