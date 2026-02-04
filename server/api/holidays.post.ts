import { prisma } from '../utils/db'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  requireUser(event)
  const body = await readBody(event)

  const holiday = await prisma.holiday.create({
    data: {
      worker_id: body.worker_id ?? null,
      desde: body.desde ? new Date(body.desde) : null,
      hasta: body.hasta ? new Date(body.hasta) : null,
      incorporacion: body.incorporacion ? new Date(body.incorporacion) : null,
      motivo: body.motivo ?? null,
      tiempo: body.tiempo ?? null,
    },
  })

  return holiday
})
