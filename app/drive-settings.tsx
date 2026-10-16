import { useEffect, useState } from "react";
export default function DriveSettings() {
  const [status, S] = useState<any>(null),
    [error, E] = useState(""),
    [busy, B] = useState(false);
  async function load() {
    try {
      const r = await fetch("/api/drive?route=status");
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      S(d);
    } catch (e: any) {
      E(e.message);
    }
  }
  useEffect(() => {
    load();
  }, []);
  return (
    <section className="card panel">
      <h2>Master media storage</h2>
      <p>
        {status?.connected
          ? "Google Drive is connected. New videos, images and audio go to your shared Drive folder."
          : "Videos, images and audio are currently stored in private Supabase buckets. Connect Drive to use it for new uploads."}
      </p>
      <a
        href="https://drive.google.com/drive/folders/1AqfV_gsrvA4ZF1JpESIMQ1EGuxMo6ifh"
        target="_blank"
        rel="noreferrer"
      >
        Open wamarketfolder ↗
      </a>
      <details>
        <summary>Google connection setup</summary>
        <p>
          Create a Web application OAuth client in Google Cloud and enable the
          Google Drive API. Use this exact authorized redirect URI:
        </p>
        <code>https://wamark.finishmylaunch.com/api/drive?route=callback</code>
        <p>
          Download the OAuth client JSON, then upload it here. The credentials
          are encrypted on the server.
        </p>
        <label>
          Google OAuth client JSON
          <input
            type="file"
            accept="application/json,.json"
            disabled={busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              B(true);
              E("");
              try {
                if (file.size > 20000)
                  throw Error("Choose the downloaded OAuth client JSON.");
                const data = JSON.parse(await file.text());
                const r = await fetch("/api/drive?route=configure", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                });
                const d = await r.json();
                if (!r.ok) throw Error(d.error);
                await load();
              } catch (e: any) {
                E(e.message);
              } finally {
                B(false);
                e.target.value = "";
              }
            }}
          />
        </label>
      </details>
      {status?.configured && (
        <p>
          <a className="button primary" href="/api/drive?route=connect">
            {status.connected
              ? "Reconnect Google Drive"
              : "Connect Google Drive"}
          </a>
        </p>
      )}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
