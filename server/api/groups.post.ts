import { createError } from 'h3'
import { prisma } from '../utils/db'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const body = await readBody<{ leader_id?: string; name?: string | null }>(event)
  if (!body?.leader_id) {
    throw createError({ statusCode: 400, statusMessage: 'leader_id is required' })
  }

  const group = await prisma.group.create({
    data: {
      leader_id: body.leader_id,
      name: body.name ?? null,
    },
    include: { leader: true, workers: true },
  })

  return group
})
