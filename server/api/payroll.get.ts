import { prisma } from '../utils/db'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  return prisma.payroll.findMany({
    include: {
      creator: true,
      reviewer: true
    },
    orderBy: [
      { year: 'desc' },
      { month: 'desc' }
    ]
  })
})
