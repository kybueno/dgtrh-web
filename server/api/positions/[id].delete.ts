import { createError } from 'h3'
import { prisma } from '../../utils/db'
import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const idParam = event.context.params?.id
  const id = idParam ? Number(idParam) : NaN
  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Valid position id is required' })
  }

  await prisma.position.delete({ where: { id } })
  return { ok: true }
})
