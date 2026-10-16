export const seasonThemes = [
  {
    name: "Winter white",
    hue: 0,
    saturation: 0.05,
    brightness: 1.75,
    contrast: 0.78,
    background: "#e6e8e6",
  },
  {
    name: "Valentine red",
    hue: 25,
    saturation: 0.9,
    brightness: 0.95,
    contrast: 1,
    background: "#8d152f",
  },
  {
    name: "Spring green",
    hue: 145,
    saturation: 0.8,
    brightness: 1.08,
    contrast: 1,
    background: "#426c48",
  },
  {
    name: "Spring lavender",
    hue: 310,
    saturation: 0.65,
    brightness: 1.25,
    contrast: 0.95,
    background: "#746b95",
  },
  {
    name: "Late spring gold",
    hue: 65,
    saturation: 0.75,
    brightness: 1.18,
    contrast: 1,
    background: "#9b793e",
  },
  {
    name: "Summer blue",
    hue: 225,
    saturation: 0.8,
    brightness: 1.1,
    contrast: 1,
    background: "#346b93",
  },
  {
    name: "Summer red",
    hue: 25,
    saturation: 0.95,
    brightness: 1.02,
    contrast: 1,
    background: "#962d31",
  },
  {
    name: "Late summer teal",
    hue: 190,
    saturation: 0.75,
    brightness: 1.08,
    contrast: 1,
    background: "#327b7b",
  },
  {
    name: "Autumn gold",
    hue: 65,
    saturation: 0.7,
    brightness: 0.92,
    contrast: 1,
    background: "#956626",
  },
  {
    name: "Pink October",
    hue: 335,
    saturation: 1,
    brightness: 1,
    contrast: 1,
    background: "#990537",
  },
  {
    name: "November brown",
    hue: 30,
    saturation: 0.55,
    brightness: 0.72,
    contrast: 1,
    background: "#684c33",
  },
  {
    name: "Christmas green",
    hue: 135,
    saturation: 0.8,
    brightness: 1.05,
    contrast: 1,
    background: "#275f3e",
  },
];
export function seasonForDate(date: string) {
  const month = Number(date.slice(5, 7));
  return seasonThemes[(month >= 1 && month <= 12 ? month : 10) - 1];
}
export function heroFilter(theme: {
  hue: number;
  saturation: number;
  brightness: number;
  contrast: number;
}) {
  return `hue-rotate(${theme.hue - 335}deg) saturate(${theme.saturation}) brightness(${theme.brightness}) contrast(${theme.contrast})`;
}
export function dashboardDate(date: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date + "T12:00:00Z"));
}
