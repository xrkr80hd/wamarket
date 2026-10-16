export const themePresets: any = {
  "Walker Default": {
    theme: "light",
    accent: "#c81927",
    appearance: {
      pageBg: "#f1f2f3",
      cardBg: "#ffffff",
      sidebarBg: "#121212",
      sidebarText: "#ffffff",
      headerBg: "#ffffff",
      primaryBg: "#c81927",
      primaryText: "#ffffff",
      highlight: "#c81927",
      linkText: "#ac1220",
    },
  },
  "McKenzie Default": {
    theme: "light",
    accent: "#cd315e",
    appearance: {
      primaryBg: "#cd315e",
      primaryText: "#ffffff",
      highlight: "#cd315e",
      linkText: "#a7234a",
    },
  },
  "Travis Default": {
    theme: "light",
    accent: "#a74400",
    appearance: {
      pageBg: "#eef0f2",
      cardBg: "#ffffff",
      sidebarBg: "#e3e6e9",
      sidebarText: "#20262b",
      headerBg: "#ffffff",
      primaryBg: "#a74400",
      primaryText: "#ffffff",
      highlight: "#a74400",
      linkText: "#923b00",
    },
  },
  "Walker After Hours": {
    theme: "dark",
    accent: "#e53945",
    appearance: {
      pageBg: "#0e1013",
      cardBg: "#191d22",
      sidebarBg: "#090b0e",
      headerBg: "#13171c",
      primaryBg: "#e53945",
      primaryText: "#111111",
      linkText: "#ff929a",
      highlight: "#ff929a",
    },
  },
  "Travis After Hours": {
    theme: "dark",
    accent: "#b94c08",
    appearance: {
      pageBg: "#111519",
      cardBg: "#20262d",
      sidebarBg: "#171c22",
      headerBg: "#171c22",
      primaryBg: "#b94c08",
      primaryText: "#ffffff",
      linkText: "#ffb66b",
      highlight: "#ffb66b",
    },
  },
  Graphite: {
    theme: "light",
    accent: "#37424d",
    appearance: {
      pageBg: "#eceff1",
      cardBg: "#ffffff",
      sidebarBg: "#29313a",
      sidebarText: "#f2f5f8",
      primaryBg: "#37424d",
      highlight: "#37424d",
      linkText: "#37424d",
    },
  },
  "Midnight Navy": {
    theme: "dark",
    accent: "#7cb4ee",
    appearance: {
      pageBg: "#0e1725",
      cardBg: "#1a293d",
      sidebarBg: "#101d30",
      headerBg: "#152237",
      primaryBg: "#7cb4ee",
      primaryText: "#0a1829",
      highlight: "#91c7ff",
      linkText: "#91c7ff",
    },
  },
  "Neutral Stone": {
    theme: "light",
    accent: "#555b52",
    appearance: {
      pageBg: "#f1f0eb",
      cardBg: "#ffffff",
      sidebarBg: "#e4e4dc",
      sidebarText: "#242b23",
      primaryBg: "#555b52",
      highlight: "#555b52",
      linkText: "#45503f",
    },
  },
  Carbon: {
    theme: "dark",
    accent: "#bdc6cf",
    appearance: {
      pageBg: "#111315",
      cardBg: "#22262a",
      sidebarBg: "#181b1e",
      headerBg: "#1b1e22",
      primaryBg: "#bdc6cf",
      primaryText: "#15191d",
      highlight: "#d4dde6",
      linkText: "#d4dde6",
    },
  },
};
export function defaultTheme(id: string) {
  return {
    ...themePresets[
      id === "travis"
        ? "Travis Default"
        : id === "mckenzie"
          ? "McKenzie Default"
          : "Walker Default"
    ],
    font: "Arial, Helvetica, sans-serif",
    radius: 9,
  };
}
