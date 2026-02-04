import { createError } from 'h3'
import { prisma } from '../../utils/db'
import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Extra work id is required' })
  }

  const body = await readBody(event)

  const extraWork = await prisma.extraWork.update({
    where: { id },
    data: {
      worker_id: body.worker_id ?? undefined,
      start_date: body.start_date ? new Date(body.start_date) : undefined,
      end_date: body.end_date === null ? null : body.end_date ? new Date(body.end_date) : undefined,
    },
  })

  return extraWork
})
