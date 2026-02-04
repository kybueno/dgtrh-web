import { prisma } from '../../utils/db'
import { getAuthPayload } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = getAuthPayload(event)
  if (!payload) {
    return { user: null, worker: null }
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user) {
    return { user: null, worker: null }
  }

  const worker = user.workerId
    ? await prisma.worker.findUnique({ where: { id: user.workerId } })
    : null

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      workerId: user.workerId,
    },
    worker,
  }
})
