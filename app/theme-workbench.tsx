import { useState, useEffect } from "react";
import { appearance, appearanceFields, contrast } from "../lib/appearance";
import { themePresets, defaultTheme } from "../lib/theme-presets";
import { getState, user, mutate, addAsset } from "../lib/preview-store";
import { useWorkspace, FilePreview } from "./operations";
export { BrandImage } from "./theme-studio";
const colorGroups = [
  ["Surfaces", ["pageBg", "cardBg", "headerBg", "sidebarBg", "inputBg"]],
  [
    "Text & links",
    [
      "bodyText",
      "headingText",
      "mutedText",
      "linkText",
      "inputText",
      "sidebarText",
      "headerText",
    ],
  ],
  [
    "Buttons, borders & highlights",
    [
      "buttonBg",
      "buttonText",
      "primaryBg",
      "primaryText",
      "borderColor",
      "highlight",
    ],
  ],
] as const;
export default function ThemeWorkbench({ preferences, onSave }: any) {
  const [draft, D] = useState<any>(preferences),
    [message, M] = useState(""),
    [presetName, P] = useState(""),
    [busy, B] = useState(false);
  const s = useWorkspace(),
    colors = appearance(draft);
  const patch = (p: any) => D((d: any) => ({ ...d, ...p }));
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("wam-theme-preview", { detail: draft }),
    );
  }, [draft]);
  useEffect(() => {
    const mode = (e: any) => D(e.detail);
    window.addEventListener("wam-theme-mode", mode);
    return () => {
      window.removeEventListener("wam-theme-mode", mode);
      window.dispatchEvent(
        new CustomEvent("wam-theme-preview", {
          detail: getState().preferences[user().id] || defaultTheme(user().id),
        }),
      );
    };
  }, []);
  function preset(name: string, value: any) {
    D({
      ...draft,
      ...structuredClone(value),
      presetName: name,
      appearance: { ...value.appearance },
    });
    M(name + " selected — previewing now");
  }
  async function save(asPreset = false) {
    B(true);
    M("");
    try {
      if (asPreset && !presetName.trim())
        throw Error("Enter a name for your custom preset");
      if (await onSave({ action: "preferences", preferences: draft })) {
        if (asPreset) {
          mutate((s) => {
            s.themePresets ||= {};
            s.themePresets[presetName.trim()] = draft;
          });
          P("");
        }
        M(asPreset ? "Custom preset and appearance saved" : "Appearance saved");
      }
    } catch (e: any) {
      M(e.message);
    } finally {
      B(false);
    }
  }
  const pairs = [
    ["Body text", colors.bodyText, colors.cardBg],
    ["Page text", colors.pageText, colors.pageBg],
    ["Secondary text", colors.mutedText, colors.cardBg],
    ["Sidebar", colors.sidebarText, colors.sidebarBg],
    ["Header", colors.headerText, colors.headerBg],
    ["Inputs", colors.inputText, colors.inputBg],
    ["Buttons", colors.buttonText, colors.buttonBg],
    ["Primary action", colors.primaryText, colors.primaryBg],
  ];
  return (
    <div className="theme-workbench">
      <div className="theme-intro">
        <h2>Your workspace, your way.</h2>
        <p>
          Choose a template, then open only the settings you need. Changes
          preview immediately.
        </p>
      </div>
      <details className="theme-section" open>
        <summary>
          <span>01</span>
          <div>
            <b>Theme templates</b>
            <small>Walker, McKenzie, Travis, neutral and dark options</small>
          </div>
        </summary>
        <div className="theme-section-body">
          <div className="theme-template-grid">
            {Object.entries(themePresets).map(([name, p]: any) => {
              const c = appearance(p);
              return (
                <button
                  className="theme-template"
                  key={name}
                  aria-pressed={draft.presetName === name}
                  onClick={() => preset(name, p)}
                >
                  <div className="theme-mini" style={{ background: c.pageBg }}>
                    <i style={{ background: c.sidebarBg }} />
                    <div style={{ background: c.cardBg }}>
                      <span style={{ background: c.primaryBg }} />
                      <hr style={{ borderColor: c.bodyText }} />
                      <hr style={{ borderColor: c.mutedText }} />
                    </div>
                  </div>
                  <b>{name}</b>
                  <small>
                    {p.theme === "dark" ? "Dark" : "Light"} ·{" "}
                    <span style={{ color: c.primaryBg }}>●</span>
                  </small>
                </button>
              );
            })}
          </div>
          {!!Object.keys(s.themePresets || {}).length && (
            <>
              <h3>Saved custom presets</h3>
              <div className="saved-presets">
                {Object.entries(s.themePresets || {}).map(([name, p]: any) => (
                  <div key={name}>
                    <button onClick={() => preset(name, p)}>{name}</button>
                    <button
                      aria-label={"Remove " + name}
                      onClick={() => {
                        if (confirm("Remove this saved preset?"))
                          mutate((s) => delete s.themePresets[name]);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </details>
      <details className="theme-section">
        <summary>
          <span>02</span>
          <div>
            <b>Appearance & typography</b>
            <small>Light/dark, font, accent and corners</small>
          </div>
        </summary>
        <div className="theme-section-body theme-fields">
          <label>
            Appearance
            <select
              value={draft.theme || "light"}
              onChange={(e) =>
                patch({ theme: e.target.value, appearance: {}, presetName: "" })
              }
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
              <option value="Verdana, sans-serif">Verdana</option>
              <option value="Georgia, serif">Georgia</option>
            </select>
          </label>
          <label>
            Accent
            <input
              type="color"
              value={draft.accent || "#c81927"}
              onChange={(e) =>
                patch({
                  accent: e.target.value,
                  appearance: {
                    ...draft.appearance,
                    primaryBg: e.target.value,
                    highlight: e.target.value,
                  },
                  presetName: "",
                })
              }
            />
          </label>
          <label>
            Corners · {draft.radius ?? 9}px
            <input
              type="range"
              min="0"
              max="22"
              value={draft.radius ?? 9}
              onChange={(e) => patch({ radius: +e.target.value })}
            />
          </label>
        </div>
      </details>
      <details className="theme-section">
        <summary>
          <span>03</span>
          <div>
            <b>Colors by category</b>
            <small>Surfaces, readable text, navigation and controls</small>
          </div>
        </summary>
        <div className="theme-section-body">
          {colorGroups.map(([name, keys]) => (
            <details className="theme-subsection" key={name}>
              <summary>{name}</summary>
              <div className="theme-fields">
                {keys.map((key) => (
                  <label key={key}>
                    {appearanceFields.find(([k]) => k === key)?.[1]}
                    <div className="color-editor-control">
                      <input
                        aria-label={key + " color"}
                        type="color"
                        value={draft.appearance?.[key] || colors[key]}
                        onChange={(e) =>
                          patch({
                            appearance: {
                              ...draft.appearance,
                              [key]: e.target.value,
                            },
                            presetName: "",
                          })
                        }
                      />
                      <input
                        aria-label={key + " hex"}
                        value={draft.appearance?.[key] || colors[key]}
                        maxLength={7}
                        onChange={(e) => {
                          if (/^#[0-9a-fA-F]{6}$/.test(e.target.value))
                            patch({
                              appearance: {
                                ...draft.appearance,
                                [key]: e.target.value,
                              },
                              presetName: "",
                            });
                        }}
                      />
                    </div>
                  </label>
                ))}
              </div>
            </details>
          ))}
        </div>
      </details>
      <details className="theme-section">
        <summary>
          <span>04</span>
          <div>
            <b>Logo & branding</b>
            <small>Walker default or a custom workspace logo</small>
          </div>
        </summary>
        <div className="theme-section-body">
          <label>
            Upload logo
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file)
                  try {
                    patch({
                      logo: await addAsset(file, { category: "Branding" }),
                    });
                  } catch (e: any) {
                    M(e.message);
                  }
              }}
            />
          </label>
          {draft.logo ? (
            <>
              <FilePreview id={draft.logo} type="image/" />
              <button onClick={() => patch({ logo: "" })}>
                Restore Walker logo
              </button>
            </>
          ) : (
            <img
              className="theme-logo-preview"
              src="/walker-suite-logo.png"
              alt="Walker Automotive logo"
            />
          )}
        </div>
      </details>
      <details className="theme-section">
        <summary>
          <span>05</span>
          <div>
            <b>Dashboard artwork</b>
            <small>Personal hero images and the Walker graphic</small>
          </div>
        </summary>
        <div className="theme-section-body">
          <label>
            Add photo
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file)
                  try {
                    patch({
                      heroImages: [
                        ...(draft.heroImages || []),
                        await addAsset(file, { category: "Branding" }),
                      ],
                    });
                  } catch (e: any) {
                    M(e.message);
                  }
              }}
            />
          </label>
          <div className="theme-photo-grid">
            {(draft.heroImages || []).map((id: string) => (
              <div key={id}>
                <FilePreview id={id} type="image/" />
                <button
                  onClick={() =>
                    patch({
                      heroImages: draft.heroImages.filter(
                        (x: string) => x !== id,
                      ),
                    })
                  }
                >
                  Remove image
                </button>
              </div>
            ))}
          </div>
          <p>
            {!draft.heroImages?.length
              ? "Using the Walker seasonal graphic."
              : "Photos remain private to this browser profile."}
          </p>
        </div>
      </details>
      <details className="theme-section">
        <summary>
          <span>06</span>
          <div>
            <b>Readability check</b>
            <small>Text contrast across each major surface</small>
          </div>
        </summary>
        <div className="theme-section-body">
          <div className="contrast-grid">
            {pairs.map(([name, fg, bg]) => (
              <div key={name} style={{ color: fg, background: bg }}>
                <b>{name}</b>
                <span>Readable sample text</span>
                <small style={{ color: fg }}>
                  {contrast(fg, bg).toFixed(2)}:1 ·{" "}
                  {contrast(fg, bg) >= 4.5 ? "Pass" : "Needs adjustment"}
                </small>
              </div>
            ))}
          </div>
          <p>
            Colors are corrected to a minimum 4.5:1 for these text pairs.
            Browser visual verification is still pending.
          </p>
        </div>
      </details>
      <section className="theme-save-panel">
        <div>
          <h3>Save your appearance</h3>
          <p>Keep your current setup or save it as a reusable preset.</p>
        </div>
        <label>
          Custom preset name (optional)
          <input
            value={presetName}
            maxLength={80}
            placeholder="e.g. Travis — Studio Night"
            onChange={(e) => P(e.target.value)}
          />
        </label>
        <div className="theme-save-actions">
          <button
            disabled={busy}
            onClick={() => {
              D(getState().preferences[user().id] || defaultTheme(user().id));
              M("Reverted to saved appearance");
            }}
          >
            Cancel / revert
          </button>
          <button
            disabled={busy || !presetName.trim()}
            onClick={() => save(true)}
          >
            Save named preset
          </button>
          <button className="primary" disabled={busy} onClick={() => save()}>
            {busy ? "Saving…" : "Save appearance"}
          </button>
        </div>
        <p role="status">{message}</p>
      </section>
    </div>
  );
}
