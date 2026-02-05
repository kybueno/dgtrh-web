import { createError } from 'h3'
import { prisma } from '../utils/db'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const body = await readBody(event)
  if (!body?.code || !body?.category || !body?.description || !body?.group_escale || !body?.level) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan campos obligatorios del puesto' })
  }

  const position = await prisma.position.create({
    data: {
      code: body.code,
      category: body.category,
      description: body.description,
      group_escale: body.group_escale,
      level: body.level,
      scale: body.scale ?? null,
      total: body.total ?? null,
    },
  })

  return position
})
