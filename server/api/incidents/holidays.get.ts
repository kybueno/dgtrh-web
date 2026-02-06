import { prisma } from '../../utils/db'
import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)

  return prisma.incident.findMany({
    where: {
      incident_type: {
        OR: [
          { name: { contains: 'vacacion', mode: 'insensitive' } },
          { description: { contains: 'vacacion', mode: 'insensitive' } }
        ]
      }
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
