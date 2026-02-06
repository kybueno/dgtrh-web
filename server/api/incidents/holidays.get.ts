import { prisma } from '../../utils/db'
import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)

  const vacationCodes = [12, 36]

  return prisma.incident.findMany({
    where: {
      incident_code: { in: vacationCodes }
    },
    include: {
      worker: {
        include: {
          group: true,
          position: true
        }
      },
      incident_type: true
    },
    orderBy: {
      start_date: 'desc'
    }
  })
})
