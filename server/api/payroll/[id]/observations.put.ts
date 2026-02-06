import { prisma } from '../../../utils/db'
import { requireUser } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)

  const idParam = getRouterParam(event, 'id')
  const payrollId = Number(idParam)
  if (!payrollId || Number.isNaN(payrollId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payroll id' })
  }

  const body = await readBody<{ workerId?: string; notes?: string }>(event)
  const workerId = body?.workerId
  const notes = body?.notes ?? ''

  if (!workerId) {
    throw createError({ statusCode: 400, statusMessage: 'Worker is required' })
  }

  const payroll = await prisma.payroll.findUnique({
    where: { id: payrollId },
    select: { id: true }
  })

  if (!payroll) {
    throw createError({ statusCode: 404, statusMessage: 'Payroll not found' })
  }

  if (!notes.trim()) {
    await prisma.payrollWorkerObservation.deleteMany({
      where: { payroll_id: payrollId, worker_id: workerId }
    })
    return { payrollId, workerId, notes: null }
  }

  const observation = await prisma.payrollWorkerObservation.upsert({
    where: {
      payroll_id_worker_id: {
        payroll_id: payrollId,
        worker_id: workerId
      }
    },
    update: { notes },
    create: {
      payroll_id: payrollId,
      worker_id: workerId,
      notes
    }
  })

  return observation
})
