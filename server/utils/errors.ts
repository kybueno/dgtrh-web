import { createError } from 'h3'
import type { ApiErrorData } from '../../shared/types/http'
import { ErrorCodes } from '~~/shared/types/errorCodes'

export function throwApiError(statusCode: number, message: string, code?: string): never {
  const data: ApiErrorData = { statusCode, message, code: code || ErrorCodes.UNKNOWN }
  throw createError({
    statusCode,
    statusMessage: statusCode >= 500 ? 'Server Error' : 'Bad Request',
    message,
    data,
  })
}

export function badRequest(message: string, code?: string): never {
  return throwApiError(400, message, code)
}

export function unauthorized(message: string, code?: string): never {
  return throwApiError(401, message, code)
}

export function forbidden(message: string, code?: string): never {
  return throwApiError(403, message, code)
}

export function notFound(message: string, code?: string): never {
  return throwApiError(404, message, code)
}

export function conflict(message: string, code?: string): never {
  return throwApiError(409, message, code)
}

export function unprocessable(message: string, code?: string): never {
  return throwApiError(422, message, code)
}

export function serverError(message: string, code?: string): never {
  return throwApiError(500, message, code)
}

export const Errors = {
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessable,
  serverError,
} as const
