import { createError } from 'h3'
import { prisma } from '../../utils/db'
import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Se requiere el ID de trabajo adicional' })
  }

  const extraWork = await prisma.extraWork.findUnique({ where: { id } })
  if (!extraWork) {
    throw createError({ statusCode: 404, statusMessage: 'Trabajo adicional no encontrado' })
  }

  return extraWork
})
