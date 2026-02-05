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
      email: 'anairis@uci.cu',
      first_name: 'Ana',
      middle_name:'Iris',
      last_name: 'Valdes',
      second_last_name: 'Rodríguez',
      record_number: '08154',
      organizations_codes: ["cdr","fmc", "ctc" ],
      position_code: 6330,
      ci: '78012302018',
      address: 'AVENIDA 191, NRO. 29608, ENTRE: CALLE 300 Y CALLE 296, LOCALIDAD: PUEBLO EL CHICO, MUNICIPIO: BOYEROS',
      parent1_name:'Juan de D.',
      parent2_name:'Isabel',
      gender:'F',
      level:'MED',
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
