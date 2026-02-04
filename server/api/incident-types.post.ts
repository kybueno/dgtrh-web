import { createError } from 'h3'
import { prisma } from '../utils/db'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const body = await readBody(event)
  if (!body?.code || !body?.name || !body?.classification) {
    throw createError({ statusCode: 400, statusMessage: 'code, name and classification are required' })
  }

  const incidentType = await prisma.incidentType.create({
    data: {
      code: body.code,
      name: body.name,
      classification: body.classification,
      description: body.description ?? null,
      pay_for: body.pay_for ?? null,
      time_classification: body.time_classification ?? null,
      deductible: body.deductible ?? null,
      incentive: body.incentive ?? false,
      avg: body.avg ?? false,
      sum: body.sum ?? false,
    },
  })

  return incidentType
})
