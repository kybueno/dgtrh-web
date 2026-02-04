import 'dotenv/config'
import { PrismaClient } from './generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@prisma.io' },
    update: {},
    create: {
      email: 'test@prisma.io',
      name: 'Test User',
    },
  })
  console.log(`✅ Created/updated user: ${user.name} (${user.email})`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })