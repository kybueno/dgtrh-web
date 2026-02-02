import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting database seed...')

  // Create system roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'system_admin' },
    update: {},
    create: {
      name: 'system_admin',
      description: 'Administrador del sistema con acceso completo',
    },
  })

  const directorRole = await prisma.role.upsert({
    where: { name: 'director' },
    update: {},
    create: {
      name: 'director',
      description: 'Director con acceso a todas las funciones de gestión',
    },
  })

  const hrManagerRole = await prisma.role.upsert({
    where: { name: 'hr_manager' },
    update: {},
    create: {
      name: 'hr_manager',
      description: 'Gestor de RRHH con acceso a funciones de personal',
    },
  })

  const workerRole = await prisma.role.upsert({
    where: { name: 'worker' },
    update: {},
    create: {
      name: 'worker',
      description: 'Trabajador con acceso limitado a sus datos',
    },
  })

  // Create organizations
  const org1 = await prisma.organization.upsert({
    where: { code: 'ORG001' },
    update: {},
    create: {
      code: 'ORG001',
      name: 'Dirección General',
      description: 'Dirección principal de la organización',
    },
  })

  const org2 = await prisma.organization.upsert({
    where: { code: 'ORG002' },
    update: {},
    create: {
      code: 'ORG002',
      name: 'Departamento de RRHH',
      description: 'Departamento de recursos humanos',
    },
  })

  // Create positions
  const directorPosition = await prisma.position.upsert({
    where: { code: 1001 },
    update: {},
    create: {
      code: 1001,
      name: 'Director General',
      description: 'Cargo de dirección principal',
      category: 'Dirección',
      level: 'A1',
    },
  })

  const hrManagerPosition = await prisma.position.upsert({
    where: { code: 2001 },
    update: {},
    create: {
      code: 2001,
      name: 'Jefe de RRHH',
      description: 'Cargo de gestión de recursos humanos',
      category: 'Gestión',
      level: 'B1',
    },
  })

  const developerPosition = await prisma.position.upsert({
    where: { code: 3001 },
    update: {},
    create: {
      code: 3001,
      name: 'Desarrollador Senior',
      description: 'Cargo de desarrollo de software',
      category: 'Técnico',
      level: 'C2',
    },
  })

  // Create groups
  const group1 = await prisma.group.upsert({
    where: { id: 'default-group' },
    update: {},
    create: {
      id: 'default-group',
      name: 'Dirección',
      description: 'Grupo de dirección',
    },
  })

  // Create sample workers
  const hashedPassword = await bcrypt.hash('password123', 10)

  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@dgtrh.local',
      password: hashedPassword,
    },
  })

  const adminWorker = await prisma.worker.upsert({
    where: { recordNumber: 'ADMIN001' },
    update: {},
    create: {
      recordNumber: 'ADMIN001',
      firstName: 'Administrador',
      lastName: 'Sistema',
      email: 'admin@dgtrh.local',
      ci: '00000000000',
      gender: 'M',
      level: 'A1',
      positionCode: directorPosition.code,
      groupId: group1.id,
    },
  })

  // Create admin profile linking user to worker
  await prisma.profile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      workerId: adminWorker.id,
    },
  })

  // Assign admin role to admin worker
  await prisma.workerRole.upsert({
    where: { workerId_roleId: { workerId: adminWorker.id, roleId: adminRole.id } },
    update: {},
    create: {
      workerId: adminWorker.id,
      roleId: adminRole.id,
    },
  })

  // Create sample worker
  const workerUser = await prisma.user.upsert({
    where: { username: 'jdoe' },
    update: {},
    create: {
      username: 'jdoe',
      email: 'jdoe@dgtrh.local',
      password: hashedPassword,
    },
  })

  const workerWorker = await prisma.worker.upsert({
    where: { recordNumber: 'EMP001' },
    update: {},
    create: {
      recordNumber: 'EMP001',
      firstName: 'Juan',
      lastName: 'Pérez',
      middleName: 'Carlos',
      email: 'jdoe@dgtrh.local',
      ci: '12345678901',
      gender: 'M',
      level: 'C2',
      positionCode: developerPosition.code,
      groupId: group1.id,
    },
  })

  await prisma.profile.upsert({
    where: { userId: workerUser.id },
    update: {},
    create: {
      userId: workerUser.id,
      workerId: workerWorker.id,
    },
  })

  await prisma.workerRole.upsert({
    where: { workerId_roleId: { workerId: workerWorker.id, roleId: workerRole.id } },
    update: {},
    create: {
      workerId: workerWorker.id,
      roleId: workerRole.id,
    },
  })

  // Create incident types
  await prisma.incidentType.createMany({
    data: [
      {
        name: 'Ausencia injustificada',
        description: 'Falta no justificada al trabajo',
        code: 'AUSENCIA_01',
      },
      {
        name: 'Llegada tarde',
        description: 'Llegada después de la hora de inicio',
        code: 'TARDE_01',
      },
      {
        name: 'Salida temprano',
        description: 'Salida antes de la hora permitida',
        code: 'SALIDA_01',
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Database seed completed successfully!')
  console.log('🔐 Admin credentials:')
  console.log('   Username: admin')
  console.log('   Password: password123')
  console.log('')
  console.log('👤 Worker credentials:')
  console.log('   Username: jdoe')
  console.log('   Password: password123')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })