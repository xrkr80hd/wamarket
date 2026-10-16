export const plannerChannels = [
  "YouTube",
  "Facebook",
  "Instagram",
  "TikTok",
  "Other",
];
export function shiftDate(date: string, days: number) {
  const d = new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function weekStart(date: string) {
  const d = new Date(date + "T12:00:00Z");
  return shiftDate(date, -((d.getUTCDay() + 6) % 7));
}
export function availableOn(record: any, person: string, date: string) {
  return (
    record.kind === "availability" &&
    !record.archived &&
    record.person === person &&
    record.date <= date &&
    (record.endDate || record.date) >= date
  );
}
export function contentOn(record: any, channel: string, date: string) {
  const channels = record.channels?.length
    ? record.channels
    : [record.platform || record.channel || "Other"];
  return (
    record.kind === "content" &&
    !record.archived &&
    record.date === date &&
    (channel === "Other"
      ? channels.some((c: string) => !plannerChannels.slice(0, 4).includes(c))
      : channels.includes(channel))
  );
}
