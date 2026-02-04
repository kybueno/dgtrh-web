import { prisma } from '../utils/db'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const groups = await prisma.group.findMany({
    include: {
      leader: true,
      workers: true,
    },
  })

  return groups
})
