import { createError } from 'h3'
import { prisma } from '../../utils/db'
import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Se requiere un ID de incidencias válido' })
  }

  const incident = await prisma.incident.findUnique({ where: { id } })
  if (!incident) {
    throw createError({ statusCode: 404, statusMessage: 'Incidencia no encontrada' })
  }

  return incident
})
