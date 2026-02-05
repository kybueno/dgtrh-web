import { createError } from 'h3'
import { prisma } from '../../utils/db'
import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Se requiere un ID de trabajador válido' })
  }

  const worker = await prisma.worker.findUnique({
    where: { id },
    include: { group: true, position: true },
  })

  if (!worker) {
    throw createError({ statusCode: 404, statusMessage: 'Trabajador no encontrado' })
  }

  return worker
})
