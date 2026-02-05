import 'dotenv/config'
import { PrismaClient, UserRole, WorkerStatus } from './generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'
import { organizationsSeedData } from './seed-data/organizations'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const passwordHash = await bcrypt.hash('ChangeMe123!', 10)

  await prisma.organization.createMany({
    data: organizationsSeedData,
    skipDuplicates: true,
  })

  const worker = await prisma.worker.upsert({
    where: { email: 'hr_manager@uci.cu' },
    update: {},
    create: {
      email: 'hr_manager@uci.cu',
      first_name: 'HR',
      last_name: 'Manager',
      second_last_name: 'User',
      record_number: 'HR-001',
      organizations_codes: [],
      status: WorkerStatus.active,
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'hr_manager@uci.cu' },
    update: { workerId: worker.id },
    create: {
      email: 'hr_manager@uci.cu',
      passwordHash,
      role: UserRole.hr_manager,
      workerId: worker.id,
    },
  })

  console.log(`✅ Seeded user: ${user.email}`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
