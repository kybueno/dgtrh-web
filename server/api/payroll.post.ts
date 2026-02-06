import { prisma } from '../utils/db'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const auth = requireUser(event)
  const body = await readBody<{ month?: number; year?: number }>(event).catch(() => ({}))

  const now = new Date()
  const month = body?.month ?? now.getMonth() + 1
  const year = body?.year ?? now.getFullYear()

  const existing = await prisma.payroll.findFirst({
    where: { month, year },
    include: {
      creator: true,
      reviewer: true
    }
  })

  if (existing) {
    return existing
  }

  return prisma.payroll.create({
    data: {
      month,
      year,
      created_by: auth.workerId ?? undefined
    },
    include: {
      creator: true,
      reviewer: true
    }
  })
})
