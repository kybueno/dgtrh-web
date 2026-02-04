import { createError } from 'h3'
import { prisma } from '../../utils/db'
import { requireUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const idParam = event.context.params?.id
  const id = idParam ? Number(idParam) : NaN
  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Valid organization id is required' })
  }

  const body = await readBody(event)

  const organization = await prisma.organization.update({
    where: { id },
    data: {
      acronym: body.acronym ?? undefined,
      code: body.code ?? undefined,
      description: body.description ?? undefined,
      img: body.img ?? undefined,
      name: body.name ?? undefined,
    },
  })

  return organization
})
