export const locationBrands = [
  { match: /toyota/i, file: "toyota", accent: "#ec1832", secondary: "#f5f5f5" },
  { match: /gmc/i, file: "gmc", accent: "#d71d34", secondary: "#bfc5cc" },
  { match: /mazda/i, file: "mazda", accent: "#929eac", secondary: "#e5e9ef" },
  { match: /honda/i, file: "honda", accent: "#087eee", secondary: "#dcecff" },
  { match: /kia/i, file: "kia", accent: "#89939f", secondary: "#ffffff" },
  {
    match: /bmw|mercedes/i,
    file: "bmw-merc",
    accent: "#078ee9",
    secondary: "#bfc6d0",
  },
  {
    match: /cdjr|chrysler|dodge|jeep|ram/i,
    file: "cdjr",
    accent: "#e3212e",
    secondary: "#d9dfe5",
  },
  {
    match: /big.?lot/i,
    file: "big_lot",
    accent: "#df2333",
    secondary: "#1279e8",
  },
  {
    match: /used.?cars|pineville/i,
    file: "used_cars",
    accent: "#e42632",
    secondary: "#d8dce2",
  },
];
export function folderBrand(
  record: any,
  records: any[] = [],
): (typeof locationBrands)[number] | undefined {
  let r = record;
  const seen = new Set();
  while (r && !seen.has(r.id)) {
    seen.add(r.id);
    const name =
      r.dealership ||
      r.locationName ||
      (r.kind === "dealership" || r.locationRoot ? r.title : "");
    const brand = locationBrands.find((b) => b.match.test(name || ""));
    if (brand) return brand;
    r = records.find((x) => x.id === r.folder);
  }
  return undefined;
}
export function brandStyle(brand: any) {
  return brand
    ? { "--folder-accent": brand.accent, "--folder-secondary": brand.secondary }
    : undefined;
}
