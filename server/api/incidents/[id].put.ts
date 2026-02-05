import { createError } from 'h3'
import { prisma } from '../../utils/db'
import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Se requiere un ID de incidencias válido' })
  }

  const body = await readBody(event)

  const incident = await prisma.incident.update({
    where: { id },
    data: {
      worker_id: body.worker_id ?? undefined,
      incident_code: body.incident_code ?? undefined,
      start_date: body.start_date ? new Date(body.start_date) : undefined,
      end_date: body.end_date === null ? null : body.end_date ? new Date(body.end_date) : undefined,
      description: body.description ?? undefined,
    },
  })

  return incident
})
