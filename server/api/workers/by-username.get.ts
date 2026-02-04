import { createError, getQuery } from 'h3'
import { prisma } from '../../utils/db'
import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const query = getQuery(event)
  const username = typeof query.username === 'string' ? query.username : null
  if (!username) {
    throw createError({ statusCode: 400, statusMessage: 'username is required' })
  }

  const worker = await prisma.worker.findFirst({
    where: {
      email: {
        startsWith: `${username}@`,
        mode: 'insensitive',
      },
    },
    include: { group: true, position: true },
  })

  if (!worker) {
    throw createError({ statusCode: 404, statusMessage: 'Worker not found' })
  }

  return worker
})
