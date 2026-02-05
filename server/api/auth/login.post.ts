import bcrypt from 'bcrypt'
import { prisma } from '../../utils/db'
import { signAuthToken, setAuthCookie } from '../../utils/auth'
import { Errors } from '../../utils/errors'
import { ErrorCodes } from '../../../shared/types/errorCodes'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const email = body.email?.toLowerCase().trim()
  const password = body.password

  if (!email || !password) {
    Errors.badRequest('Correo y contraseña requeridos', ErrorCodes.AUTH.MISSING_FIELDS)
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    Errors.unauthorized('Credenciales inválidas', ErrorCodes.AUTH.INVALID_CREDENTIALS)
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) {
    Errors.unauthorized('Credenciales inválidas', ErrorCodes.AUTH.INVALID_CREDENTIALS)
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
