import { createError } from 'h3'
import { prisma } from '../utils/db'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const body = await readBody(event)

  if (!body?.worker_id || !body?.start_date) {
    throw createError({ statusCode: 400, statusMessage: 'El id del trabajador y la fecha de inicio son obligatorios' })
  }

  const extraWork = await prisma.extraWork.create({
    data: {
      worker_id: body.worker_id,
      start_date: new Date(body.start_date),
      end_date: body.end_date ? new Date(body.end_date) : null,
    },
  })

  return extraWork
})
