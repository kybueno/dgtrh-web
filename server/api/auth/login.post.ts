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

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const worker = user.workerId
    ? await prisma.worker.findUnique({ where: { id: user.workerId } })
    : null

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
