import { getQuery } from 'h3'
import { prisma } from '../utils/db'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const query = getQuery(event)
  const workerId = typeof query.worker_id === 'string' ? query.worker_id : null

  return prisma.extraWork.findMany({
    where: workerId ? { worker_id: workerId } : undefined,
  })
})
