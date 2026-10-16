export const appearanceFields = [
  ["pageBg", "Page background"],
  ["cardBg", "Cards and panels"],
  ["headerBg", "Header background"],
  ["sidebarBg", "Sidebar background"],
  ["inputBg", "Input background"],
  ["bodyText", "Body text"],
  ["inputText", "Input text"],
  ["sidebarText", "Sidebar text"],
  ["headerText", "Header text"],
  ["headingText", "Headings"],
  ["mutedText", "Secondary text"],
  ["linkText", "Links"],
  ["buttonBg", "Button background"],
  ["buttonText", "Button text"],
  ["primaryBg", "Primary button background"],
  ["primaryText", "Primary button text"],
  ["borderColor", "Borders"],
  ["highlight", "Highlights"],
] as const;
const hex = (v: any) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);
export function luminance(color: string) {
  const values = [1, 3, 5]
    .map((i) => parseInt(color.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
export function contrast(a: string, b: string) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function readable(fg: string, bg: string) {
  return contrast(fg, bg) >= 4.5
    ? fg
    : contrast("#ffffff", bg) > contrast("#000000", bg)
      ? "#ffffff"
      : "#000000";
}
export function appearance(prefs: any) {
  const dark = prefs?.theme === "dark";
  const accent = hex(prefs?.accent) ? prefs.accent : "#c81927";
  const defaults: any = dark
    ? {
        pageBg: "#171f27",
        cardBg: "#25313b",
        headerBg: "#26333e",
        sidebarBg: "#202c36",
        inputBg: "#1d2831",
        bodyText: "#edf2f7",
        headingText: "#ffffff",
        mutedText: "#c0cad5",
        linkText: accent,
        buttonBg: "#344555",
        buttonText: "#f5f8fc",
        primaryBg: accent,
        primaryText: "#ffffff",
        borderColor: "#536374",
        highlight: accent,
      }
    : {
        pageBg: "#f5f5f3",
        cardBg: "#ffffff",
        headerBg: "#ffffff",
        sidebarBg: "#ffffff",
        inputBg: "#ffffff",
        bodyText: "#28323c",
        headingText: "#19232d",
        mutedText: "#5e6873",
        linkText: accent,
        buttonBg: "#f3f5f7",
        buttonText: "#27313b",
        primaryBg: accent,
        primaryText: "#ffffff",
        borderColor: "#d2d8de",
        highlight: accent,
      };
  const value = { ...defaults };
  for (const [key] of appearanceFields)
    if (hex(prefs?.appearance?.[key])) value[key] = prefs.appearance[key];
  for (const key of ["bodyText", "headingText", "mutedText", "linkText"])
    value[key] = readable(value[key], value.cardBg);
  value.inputText = readable(value.inputText || value.bodyText, value.inputBg);
  value.headerText = readable(
    value.headerText || value.bodyText,
    value.headerBg,
  );
  value.sidebarText = readable(
    value.sidebarText || value.bodyText,
    value.sidebarBg,
  );
  value.pageText = readable(value.bodyText, value.pageBg);
  value.pageHeading = readable(value.headingText, value.pageBg);
  value.pageMuted = readable(value.mutedText, value.pageBg);
  value.pageLink = readable(value.linkText, value.pageBg);
  value.buttonText = readable(value.buttonText, value.buttonBg);
  value.primaryText = readable(value.primaryText, value.primaryBg);
  return value;
}
export function appearanceVariables(prefs: any) {
  return Object.fromEntries(
    Object.entries(appearance(prefs)).map(([k, v]) => ["--ui-" + k, v]),
  );
}
