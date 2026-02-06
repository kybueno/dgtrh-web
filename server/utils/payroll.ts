const MS_PER_DAY = 24 * 60 * 60 * 1000
const MS_PER_HOUR = 60 * 60 * 1000

const toUTCDateOnly = (date: Date) => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

export const getMonthBoundsUtc = (year: number, month: number) => {
  const monthStart = new Date(Date.UTC(year, month - 1, 1))
  const nextMonthStart = new Date(Date.UTC(year, month, 1))
  return { monthStart, nextMonthStart }
}

export const getIncidentDaysInMonth = (
  startDate: Date,
  endDate: Date | null | undefined,
  monthStart: Date,
  nextMonthStart: Date
) => {
  const incidentStart = toUTCDateOnly(startDate)
  const incidentEnd = toUTCDateOnly(endDate ?? startDate)

  const rangeStart = incidentStart > monthStart ? incidentStart : monthStart
  const rangeEnd = incidentEnd < nextMonthStart ? incidentEnd : new Date(nextMonthStart.getTime() - MS_PER_DAY)

  if (rangeStart > rangeEnd) return 0
  return Math.floor((rangeEnd.getTime() - rangeStart.getTime()) / MS_PER_DAY) + 1
}

export const getExtraWorkHoursInMonth = (
  startDate: Date,
  endDate: Date | null | undefined,
  monthStart: Date,
  nextMonthStart: Date
) => {
  const start = startDate.getTime()
  const end = (endDate ?? startDate).getTime()
  const rangeStart = Math.max(start, monthStart.getTime())
  const rangeEnd = Math.min(end, nextMonthStart.getTime())

  if (rangeEnd <= rangeStart) return 0
  return (rangeEnd - rangeStart) / MS_PER_HOUR
}
