"use client";
import { useEffect, useState } from "react";
import { Palette, Upload, X } from "lucide-react";
import { appearance, appearanceFields } from "../lib/appearance";
import { apiFetch, apiJSON } from "../lib/api-response";
export default function PageEditor({ preferences, onSave, onReload }: any) {
  const [draft, setDraft] = useState<any>(preferences),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => setDraft(preferences), [JSON.stringify(preferences)]);
  const colors = appearance(draft);
  async function upload(files: FileList | null) {
    if (!files) return;
    setBusy(true);
    setError("");
    let images = draft.heroImages || [];
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const r = await apiJSON(
          await apiFetch("/api/hero-images", { method: "POST", body: form }),
        );
        images = r.images;
      }
      await onReload();
      setDraft((d: any) => ({ ...d, heroImages: images }));
    } catch (e: any) {
      setError(e.message);
      await onReload();
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page-editor">
      <section className="card panel">
        <h2>
          <Palette size={19} /> Your appearance
        </h2>
        <p>
          These choices change only your account. Text contrast is adjusted
          automatically to keep it readable.
        </p>
        <label>
          Mode
          <select
            value={draft.theme || "light"}
            onChange={(e) =>
              setDraft({ ...draft, theme: e.target.value, appearance: {} })
            }
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <div className="color-editor-grid">
          {appearanceFields.map(([key, label]) => (
            <label key={key}>
              {label}
              <div className="color-editor-control">
                <input
                  type="color"
                  value={draft.appearance?.[key] || colors[key]}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      appearance: {
                        ...draft.appearance,
                        [key]: e.target.value,
                      },
                    })
                  }
                />
                <input
                  aria-label={label + " hex"}
                  type="text"
                  pattern="#[0-9a-fA-F]{6}"
                  maxLength={7}
                  value={draft.appearance?.[key] || colors[key]}
                  onChange={(e) => {
                    setDraft({
                      ...draft,
                      appearance: {
                        ...draft.appearance,
                        [key]: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </label>
          ))}
        </div>
        <div
          className="appearance-preview"
          style={{
            background: colors.cardBg,
            color: colors.bodyText,
            borderColor: colors.borderColor,
          }}
        >
          <h3 style={{ color: colors.headingText }}>Preview your page</h3>
          <p style={{ color: colors.mutedText }}>
            Readable text, clear controls, your colors.
          </p>
          <div>
            <button
              style={{ background: colors.buttonBg, color: colors.buttonText }}
            >
              Standard button
            </button>
            <button
              style={{
                background: colors.primaryBg,
                color: colors.primaryText,
              }}
            >
              Primary button
            </button>
          </div>
          <a style={{ color: colors.linkText }}>Link preview</a>
        </div>
        <div className="editor-actions">
          <button
            disabled={busy}
            onClick={() => setDraft({ ...draft, appearance: {} })}
          >
            Reset colors
          </button>
          <button
            className="primary"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              if (await onSave({ action: "preferences", preferences: draft }))
                setError("");
              setBusy(false);
            }}
          >
            Save my appearance
          </button>
        </div>
      </section>
      <section className="card panel">
        <h2>Your hero photos</h2>
        <p>
          Upload one photo or several for a carousel. These photos are private
          to your dashboard.
        </p>
        <label className="button">
          <Upload size={17} /> Upload photos
          <input
            disabled={busy}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={(e) => {
              upload(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        <small>Up to 8 photos · 5 MB each</small>
        <div className="hero-editor-photos">
          {(draft.heroImages || []).map((id: string) => (
            <div key={id}>
              <img
                src={"/api/hero-images?image=" + id}
                alt="Personal hero photo"
              />
              <button
                disabled={busy}
                aria-label="Remove hero photo"
                onClick={async () => {
                  setBusy(true);
                  try {
                    const r = await apiJSON(
                      await apiFetch("/api/hero-images?image=" + id, {
                        method: "DELETE",
                      }),
                    );
                    await onReload();
                    setDraft((d: any) => ({ ...d, heroImages: r.images }));
                  } catch (e: any) {
                    setError(e.message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        {!draft.heroImages?.length && (
          <div className="hero-default-preview">
            <img src="/walker-hero.jpg" alt="Default Walker 100 emblem" />
            <p>No custom photos · Walker 100 is your default.</p>
          </div>
        )}
        {error && (
          <p className="notice" role="alert">
            {error}
          </p>
        )}
      </section>
    </div>
  );
}
