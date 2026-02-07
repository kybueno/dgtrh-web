import { createError } from 'h3'
import { prisma } from '../utils/db'
import { requireUser } from '../utils/auth'
import { WorkerStatus } from '../../prisma/generated/client'

function pickWorkerData(body: any) {
  return {
    email: body.email ?? null,
    first_name: body.first_name,
    middle_name: body.middle_name ?? null,
    last_name: body.last_name,
    second_last_name: body.second_last_name,
    record_number: body.record_number,
    ci: body.ci ?? null,
    organizations_codes: Array.isArray(body.organizations_codes) ? body.organizations_codes : [],
    level: body.level ?? null,
    address: body.address ?? null,
    gender: body.gender ?? null,
    tel: body.tel ?? null,
    position_code: body.position_code ?? null,
    group_id: body.group_id ?? null,
    parent1_name: body.parent1_name ?? null,
    parent2_name: body.parent2_name ?? null,
    status: body.status ?? WorkerStatus.active,
  }
}

export default defineEventHandler(async (event) => {
  requireUser(event)
  const body = await readBody(event)

  if (!body?.first_name || !body?.last_name || !body?.second_last_name || !body?.record_number) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan campos obligatorios del Trabajador' })
  }

  const worker = await prisma.worker.create({
    data: pickWorkerData(body),
    include: { group: true, position: true, led_groups: true },
  })

  return worker
})
