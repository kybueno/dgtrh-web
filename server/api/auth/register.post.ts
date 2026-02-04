import bcrypt from 'bcrypt'
import { createError } from 'h3'
import { prisma } from '../../utils/db'
import { signAuthToken, setAuthCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const email = body.email?.toLowerCase().trim()
  const password = body.password

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw createError({ statusCode: 400, statusMessage: 'User already exists' })
  }

  const worker = await prisma.worker.findFirst({ where: { email } })
  if (!worker) {
    throw createError({ statusCode: 400, statusMessage: 'Worker not found for this email' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      workerId: worker.id,
    },
  })

  const token = signAuthToken({ userId: user.id, workerId: user.workerId ?? null, role: user.role })
  setAuthCookie(event, token)

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      workerId: user.workerId,
    },
    worker,
  }
})
