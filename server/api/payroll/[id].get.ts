import { prisma } from '../../utils/db'
import { requireUser } from '../../utils/auth'
import { getExtraWorkHoursInMonth, getIncidentDaysInMonth, getMonthBoundsUtc } from '../../utils/payroll'
import { WorkerStatus } from '../../../prisma/generated/enums'

export default defineEventHandler(async (event) => {
  requireUser(event)

  const idParam = getRouterParam(event, 'id')
  const payrollId = Number(idParam)

  if (!payrollId || Number.isNaN(payrollId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid payroll id'
    })
  }

  const payroll = await prisma.payroll.findUnique({
    where: { id: payrollId },
    include: {
      creator: true,
      reviewer: true
    }
  })

  if (!payroll) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Payroll not found'
    })
  }

  const { monthStart, nextMonthStart } = getMonthBoundsUtc(payroll.year, payroll.month)

  const [workers, incidentTypes, incidents, extraWork] = await Promise.all([
    prisma.worker.findMany({
      where: {
        status: WorkerStatus.active
      },
      include: {
        position: true
      }
    }),
    prisma.incidentType.findMany(),
    prisma.incident.findMany({
      where: {
        start_date: {
          lt: nextMonthStart
        },
        OR: [
          { end_date: null },
          { end_date: { gte: monthStart } }
        ]
      },
      include: {
        incident_type: true
      }
    }),
    prisma.extraWork.findMany({
      where: {
        start_date: {
          lt: nextMonthStart
        },
        OR: [
          { end_date: null },
          { end_date: { gte: monthStart } }
        ]
      }
    })
  ])

  const incidentDaysByWorker = new Map<string, Map<number, number>>()
  const totalIncidentDaysByWorker = new Map<string, number>()

  for (const incident of incidents) {
    const days = getIncidentDaysInMonth(
      incident.start_date,
      incident.end_date,
      monthStart,
      nextMonthStart
    )

    if (days <= 0) continue

    const workerMap = incidentDaysByWorker.get(incident.worker_id) ?? new Map<number, number>()
    workerMap.set(incident.incident_code, (workerMap.get(incident.incident_code) ?? 0) + days)
    incidentDaysByWorker.set(incident.worker_id, workerMap)

    totalIncidentDaysByWorker.set(
      incident.worker_id,
      (totalIncidentDaysByWorker.get(incident.worker_id) ?? 0) + days
    )
  }

  const extraHoursByWorker = new Map<string, number>()
  for (const extra of extraWork) {
    const hours = getExtraWorkHoursInMonth(
      extra.start_date,
      extra.end_date,
      monthStart,
      nextMonthStart
    )
    if (hours <= 0) continue
    extraHoursByWorker.set(extra.worker_id, (extraHoursByWorker.get(extra.worker_id) ?? 0) + hours)
  }

  const workersWithSummary = workers.map((worker) => {
    const incidentDays = incidentDaysByWorker.get(worker.id) ?? new Map<number, number>()
    const incidentByType = Object.fromEntries(
      incidentTypes.map((type) => [type.code, incidentDays.get(type.code) ?? 0])
    )

    return {
      worker,
      incidentDaysByType: incidentByType,
      totalIncidentDays: totalIncidentDaysByWorker.get(worker.id) ?? 0,
      extraWorkHours: extraHoursByWorker.get(worker.id) ?? 0
    }
  })

  return {
    payroll,
    incidentTypes,
    workers: workersWithSummary
  }
})
