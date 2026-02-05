import { createError, getQuery } from 'h3'
import { prisma } from '../../utils/db'
import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const query = getQuery(event)
  const recordNumber = typeof query.record_number === 'string' ? query.record_number : null
  if (!recordNumber) {
    throw createError({ statusCode: 400, statusMessage: 'El número de expediente es requerido' })
  }

  const worker = await prisma.worker.findFirst({
    where: { record_number: recordNumber },
    include: { group: true, position: true },
  })

  if (!worker) {
    throw createError({ statusCode: 404, statusMessage: 'Trabajador no encontrado' })
  }

  return worker
})
