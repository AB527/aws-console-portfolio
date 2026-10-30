export function formatDate(dateStr: string): string {
  if (!dateStr) return ""
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

export function formatMonthYear(dateStr: string): string {
  if (!dateStr) return ""
  const [year, month] = dateStr.split("-").map(Number)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)))
}

export function formatDateBadge(dateStr: string): { month: string; day: string } {
  if (!dateStr) return { month: "", day: "" }
  const [year, month, day] = dateStr.split("-").map(Number)
  const d = new Date(Date.UTC(year, month - 1, day))
  const monthAbbr = new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "UTC",
  })
    .format(d)
    .toUpperCase()
  return { month: monthAbbr, day: String(day) }
}

export function formatPeriod(from: string, to: string): string {
  const start = formatMonthYear(from)
  const end = to ? formatMonthYear(to) : "Present"
  return `${start} – ${end}`
}
