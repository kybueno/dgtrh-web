import { prisma } from '../../../utils/db'
import { requireUser } from '../../../utils/auth'
import { UserRole } from '../../../../prisma/generated/enums'

const allowedStatuses = new Set(['pending', 'approved', 'denied'])

export default defineEventHandler(async (event) => {
  const auth = requireUser(event)

  if (auth.role !== UserRole.director) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const idParam = getRouterParam(event, 'id')
  const payrollId = Number(idParam)
  if (!payrollId || Number.isNaN(payrollId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payroll id' })
  }

  const body = await readBody<{ status?: string }>(event)
  const status = body?.status
  if (!status || !allowedStatuses.has(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid status' })
  }

  const now = new Date()
  const isApproved = status === 'approved'
  const isDenied = status === 'denied'

  const payroll = await prisma.payroll.update({
    where: { id: payrollId },
    data: {
      status: status as 'pending' | 'approved' | 'denied',
      revised_by: auth.workerId ?? undefined,
      approved_by: isApproved ? auth.workerId : null,
      approved_at: isApproved ? now : null,
      denied_by: isDenied ? auth.workerId : null,
      denied_at: isDenied ? now : null
    }
  })

  return payroll
})
