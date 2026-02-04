import { prisma } from '../utils/db'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const body = await readBody(event)

  const organization = await prisma.organization.create({
    data: {
      acronym: body.acronym ?? null,
      code: body.code ?? null,
      description: body.description ?? null,
      img: body.img ?? null,
      name: body.name ?? null,
    },
  })

  return organization
})
