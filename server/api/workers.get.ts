import { getQuery } from 'h3'
import { prisma } from '../utils/db'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const query = getQuery(event)
  const detailed = query.detailed === 'true'

  const workers = await prisma.worker.findMany({
    include: detailed
      ? {
          group: true,
          position: true,
        }
      : undefined,
  })

  return workers
})
