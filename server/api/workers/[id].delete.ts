import { createError } from 'h3'
import { prisma } from '../../utils/db'
import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Se requiere un ID de trabajador válido' })
  }

  await prisma.worker.delete({ where: { id } })
  return { ok: true }
})
