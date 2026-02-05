export const ErrorCodes = {
  UNKNOWN:"UNKNOWN",
  AUTH: {
    MISSING_FIELDS: 'AUTH_MISSING_FIELDS',
    INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
    USER_EXISTS: 'AUTH_USER_EXISTS',
    WORKER_NOT_FOUND: 'AUTH_WORKER_NOT_FOUND',
  },
} as const

type ValueOf<T> = T[keyof T]
type NestedValueOf<T> = ValueOf<{ [K in keyof T]: ValueOf<T[K]> }>

export type ErrorCode = NestedValueOf<typeof ErrorCodes>
