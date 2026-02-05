import { createError } from 'h3'
import { prisma } from '../utils/db'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const body = await readBody(event)
  if (!body?.worker_id || !body?.incident_code || !body?.start_date) {
    throw createError({ statusCode: 400, statusMessage: 'El id del trabajador, codigo de incidencia y fecha de inicio son requeridos' })
  }

  const incident = await prisma.incident.create({
    data: {
      worker_id: body.worker_id,
      incident_code: body.incident_code,
      start_date: new Date(body.start_date),
      end_date: body.end_date ? new Date(body.end_date) : null,
      description: body.description ?? null,
    },
  })

  return incident
})
