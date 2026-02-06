import 'dotenv/config'
import { PrismaClient, UserRole, WorkerStatus } from './generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'
import { organizationsSeedData } from './seed-data/organizations'
import { EXAMPLE_WORKERS_INFO, WorkerSeedInfo } from './seed-data/workers'
import { incidentTypesSeedData } from './seed-data/incidents'
import { positionsSeedData } from './seed-data/positions'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const passwordHash = await bcrypt.hash('dgt.123', 10)

  const assertRequiredWorkerInfo = (workerInfo: WorkerSeedInfo) => {
    const missingFields = []

    if (!workerInfo.email) missingFields.push('email')
    if (!workerInfo.first_name) missingFields.push('first_name')
    if (!workerInfo.last_name) missingFields.push('last_name')
    if (!workerInfo.second_last_name) missingFields.push('second_last_name')
    if (!workerInfo.record_number) missingFields.push('record_number')

    if (missingFields.length > 0) {
      throw new Error(`Missing required worker info: ${missingFields.join(', ')}`)
    }
  }

  const upsertWorker = async (workerInfo: WorkerSeedInfo) => {
    assertRequiredWorkerInfo(workerInfo)

    let positionCode:typeof workerInfo.position_code | null = workerInfo.position_code ?? null

    if (positionCode !== null) {
      const positionExists = await prisma.position.findUnique({
        where: { code: positionCode },
        select: { code: true },
      })

      if (!positionExists) {
        console.warn(
          `⚠️  Position code ${positionCode} not found. Setting position_code to null for ${workerInfo.email}.`,
        )
        positionCode = null
      }
    }

    const workerData = {
      email: workerInfo.email,
      first_name: workerInfo.first_name,
      middle_name: workerInfo.middle_name ?? null,
      last_name: workerInfo.last_name,
      second_last_name: workerInfo.second_last_name,
      record_number: workerInfo.record_number,
      organizations_codes: workerInfo.organizations_codes ?? [],
      position_code: positionCode,
      ci: workerInfo.ci ?? null,
      address: workerInfo.address ?? null,
      parent1_name: workerInfo.parent1_name ?? null,
      parent2_name: workerInfo.parent2_name ?? null,
      tel: workerInfo.tel ?? null,
      gender: workerInfo.gender ?? null,
      level: workerInfo.level ?? null,
      status: workerInfo.status ?? WorkerStatus.active,
    }

    return prisma.worker.upsert({
      where: { email: workerInfo.email },
      update: workerData,
      create: workerData,
    })
  }

  const upsertWorkerUser = async (workerInfo: WorkerSeedInfo, role: UserRole) => {
    const createdWorker = await upsertWorker(workerInfo)

    const user = await prisma.user.upsert({
      where: { email: workerInfo.email },
      update: {
        role,
        workerId: createdWorker.id,
      },
      create: {
        email: workerInfo.email,
        passwordHash,
        role,
        workerId: createdWorker.id,
      },
    })

    return { worker: createdWorker, user }
  }

  await prisma.organization.createMany({
    data: organizationsSeedData,
    skipDuplicates: true,
  })

  await prisma.position.createMany({
    data: positionsSeedData,
    skipDuplicates: true,
  })

  await prisma.incidentType.createMany({
    data: incidentTypesSeedData,
    skipDuplicates: true,
  })

  const workerRoles: Record<string, UserRole> = {
    director: UserRole.director,
    hrmanager: UserRole.hr_manager,
    workerm: UserRole.employee,
    workers: UserRole.employee,
  }

  const workerEntries = Object.entries(EXAMPLE_WORKERS_INFO)

  for (const [workerKey, workerInfo] of workerEntries) {
    const role = workerRoles[workerKey] ?? UserRole.employee
    const { user } = await upsertWorkerUser(workerInfo, role)
    console.log(`✅ Seeded worker user: ${user.email}`)
  }

  const superUserEmail = 'admin@dgtrh.local'
  const superUser = await prisma.user.upsert({
    where: { email: superUserEmail },
    update: {
      role: UserRole.system_admin,
      workerId: null,
    },
    create: {
      email: superUserEmail,
      passwordHash,
      role: UserRole.system_admin,
      workerId: null,
    },
  })
  console.log(`✅ Seeded system admin user: ${superUser.email}`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
