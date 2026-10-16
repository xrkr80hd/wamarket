import { useState, useEffect } from "react";
import { appearance, appearanceFields, contrast } from "../lib/appearance";
import {
  getState,
  user,
  mutate,
  addAsset,
  fileURL,
} from "../lib/preview-store";
import { useWorkspace, FilePreview } from "./operations";
export default function ThemeStudio({ preferences, onSave }: any) {
  const [draft, D] = useState<any>(preferences),
    [error, E] = useState(""),
    [preset, P] = useState(""),
    [busy, B] = useState(false);
  const s = useWorkspace(),
    colors = appearance(draft);
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("wam-theme-preview", { detail: draft }),
    );
  }, [draft]);
  useEffect(
    () => () => {
      window.dispatchEvent(
        new CustomEvent("wam-theme-preview", {
          detail: getState().preferences[user().id] || {
            theme: "light",
            accent: "#cd315e",
          },
        }),
      );
    },
    [],
  );
  const patch = (p: any) => D((d: any) => ({ ...d, ...p }));
  async function save() {
    B(true);
    try {
      if (await onSave({ action: "preferences", preferences: draft }))
        E("Saved");
    } catch (e: any) {
      E(e.message);
    } finally {
      B(false);
    }
  }
  return (
    <div className="page-editor">
      <section className="card panel">
        <h2>Theme studio</h2>
        <p>
          Live across the entire suite. Readable text colors are adjusted
          automatically for contrast.
        </p>
        <div className="ops-formgrid">
          <label>
            Mode
            <select
              value={draft.theme || "light"}
              onChange={(e) => patch({ theme: e.target.value, appearance: {} })}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label>
            Typography
            <select
              value={draft.font || "Arial, Helvetica, sans-serif"}
              onChange={(e) => patch({ font: e.target.value })}
            >
              <option value="Arial, Helvetica, sans-serif">
                Walker · Arial
              </option>
              <option value="'Segoe UI', sans-serif">Segoe UI</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Verdana, sans-serif">Verdana</option>
            </select>
          </label>
          <label>
            Card & button corners
            <input
              type="range"
              min="0"
              max="22"
              value={draft.radius ?? 9}
              onChange={(e) => patch({ radius: +e.target.value })}
            />
          </label>
          <label>
            Accent
            <input
              type="color"
              value={draft.accent || "#cd315e"}
              onChange={(e) => patch({ accent: e.target.value })}
            />
          </label>
        </div>
        <div className="color-editor-grid">
          {appearanceFields.map(([key, label]) => (
            <label key={key}>
              {label}
              <div className="color-editor-control">
                <input
                  type="color"
                  value={draft.appearance?.[key] || colors[key]}
                  onChange={(e) =>
                    patch({
                      appearance: {
                        ...draft.appearance,
                        [key]: e.target.value,
                      },
                    })
                  }
                />
                <input
                  aria-label={label + " hex"}
                  pattern="#[0-9a-fA-F]{6}"
                  maxLength={7}
                  value={draft.appearance?.[key] || colors[key]}
                  onChange={(e) => {
                    if (/^#[0-9a-fA-F]{6}$/.test(e.target.value))
                      patch({
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
        <div className="appearance-preview">
          <h3>Live preview</h3>
          <p>
            Body / surface contrast:{" "}
            {contrast(colors.bodyText, colors.cardBg).toFixed(1)}:1
          </p>
          <p>
            Primary button contrast:{" "}
            {contrast(colors.primaryText, colors.primaryBg).toFixed(1)}:1
          </p>
          <button onClick={() => E("Theme preview button is working")}>
            Test standard button
          </button>
          <button
            className="primary"
            onClick={() => E("Primary theme preview is working")}
          >
            Test primary action
          </button>
        </div>
        <div className="ops-actions">
          <button
            onClick={() =>
              D({
                theme: "light",
                accent: "#cd315e",
                radius: 9,
                font: "Arial, Helvetica, sans-serif",
              })
            }
          >
            Walker default
          </button>
          <button
            onClick={() =>
              D(
                getState().preferences[user().id] || {
                  theme: "light",
                  accent: "#cd315e",
                },
              )
            }
          >
            Cancel / revert
          </button>
          <button disabled={busy} className="primary" onClick={save}>
            Save appearance
          </button>
        </div>
        <p role="status">{error}</p>
      </section>
      <section className="card panel">
        <h2>Presets & branding</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate((s) => {
              s.themePresets ||= {};
              s.themePresets[preset] = draft;
            });
            P("");
          }}
        >
          <label>
            Preset name
            <input
              required
              value={preset}
              onChange={(e) => P(e.target.value)}
            />
          </label>
          <button>Save custom preset</button>
        </form>
        {Object.entries(s.themePresets || {}).map(([name, value]: any) => (
          <div className="report-row" key={name}>
            <button onClick={() => D(value)}>{name}</button>
            <button
              onClick={() => {
                if (confirm("Remove this theme preset?"))
                  mutate((s) => delete s.themePresets[name]);
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <h3>Sidebar logo</h3>
        <label>
          Upload branding
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f)
                try {
                  patch({ logo: await addAsset(f, { category: "Branding" }) });
                } catch (e: any) {
                  E(e.message);
                }
            }}
          />
        </label>
        {draft.logo && (
          <>
            <FilePreview id={draft.logo} type="image/" />
            <button onClick={() => patch({ logo: "" })}>Use Walker logo</button>
          </>
        )}
        <h3>Dashboard hero photos</h3>
        <label>
          Add hero photo
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f)
                try {
                  patch({
                    heroImages: [
                      ...(draft.heroImages || []),
                      await addAsset(f, { category: "Branding" }),
                    ],
                  });
                } catch (e: any) {
                  E(e.message);
                }
            }}
          />
        </label>
        {(draft.heroImages || []).map((id: string) => (
          <div key={id}>
            <FilePreview id={id} type="image/" />
            <button
              onClick={() =>
                patch({
                  heroImages: draft.heroImages.filter((x: string) => x !== id),
                })
              }
            >
              Remove from hero
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
export function BrandImage({ id }: any) {
  const [url, U] = useState("");
  useEffect(() => {
    if (!id) {
      U("");
      return;
    }
    fileURL(id).then(U);
  }, [id]);
  return (
    <img
      className="suite-logo"
      src={url || "/walker-suite-logo.png"}
      alt="Walker Automotive Marketing Suite"
    />
  );
}
