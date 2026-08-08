export function formatNoteDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "utc",
  })
    .format(new Date(date))
    .toLowerCase();
}
