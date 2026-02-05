import type { ErrorCode } from './errorCodes'

export type ApiErrorData = {
  statusCode: number
  message: string
  code?: ErrorCode
}

export type ApiError = {
  statusCode?: number
  statusMessage?: string
  message?: string
  data?: ApiErrorData
}
