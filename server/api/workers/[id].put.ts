import { createError } from 'h3'
import { prisma } from '../../utils/db'
import { requireUser } from '../../utils/auth'

function pickWorkerUpdate(body: any) {
  return {
    email: body.email ?? undefined,
    first_name: body.first_name ?? undefined,
    middle_name: body.middle_name ?? undefined,
    last_name: body.last_name ?? undefined,
    second_last_name: body.second_last_name ?? undefined,
    record_number: body.record_number ?? undefined,
    ci: body.ci ?? undefined,
    organizations_codes: Array.isArray(body.organizations_codes)
      ? body.organizations_codes
      : undefined,
    level: body.level ?? undefined,
    address: body.address ?? undefined,
    gender: body.gender ?? undefined,
    tel: body.tel ?? undefined,
    position_code: body.position_code ?? undefined,
    group_id: body.group_id ?? undefined,
    parent1_name: body.parent1_name ?? undefined,
    parent2_name: body.parent2_name ?? undefined,
    status: body.status ?? undefined,
  }
}

export default defineEventHandler(async (event) => {
  requireUser(event)
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Se requiere un ID de trabajador válido' })
  }

  const body = await readBody(event)

  const worker = await prisma.worker.update({
    where: { id },
    data: pickWorkerUpdate(body),
    include: { group: true, position: true },
  })

  return worker
})
