import bcrypt from 'bcrypt'
import { prisma } from '../../utils/db'
import { signAuthToken, setAuthCookie } from '../../utils/auth'
import { Errors } from '../../utils/errors'
import { ErrorCodes } from '../../../shared/types/errorCodes'
import { UserRole } from '../../../prisma/generated/enums'

const DIRECTOR_POSITION_CODE = 12
const HR_MANAGER_POSITION_CODE = 6330

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const email = body.email?.toLowerCase().trim()
  const password = body.password

  if (!email || !password) {
    Errors.badRequest('Correo y contraseña requeridos', ErrorCodes.AUTH.MISSING_FIELDS)
    return
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    Errors.badRequest('Este usuario ya existe', ErrorCodes.AUTH.USER_EXISTS)
    return
  }

  const worker = await prisma.worker.findFirst({ where: { email } })
  if (!worker) {
    Errors.badRequest('Trabajador no encontrado con este correo', ErrorCodes.AUTH.WORKER_NOT_FOUND)
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const role =
    worker.position_code === DIRECTOR_POSITION_CODE
      ? UserRole.director
      : worker.position_code === HR_MANAGER_POSITION_CODE
        ? UserRole.hr_manager
        : UserRole.employee
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
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
