import jwt from 'jsonwebtoken'
import { getCookie, setCookie, deleteCookie, createError } from 'h3'

const AUTH_COOKIE = 'dgtrh_token'
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7

export type AuthPayload = {
  userId: string
  workerId: string | null
  role: string
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not set')
  return secret
}

export function signAuthToken(payload: AuthPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_TTL_SECONDS })
}

export function setAuthCookie(event: any, token: string) {
  setCookie(event, AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TOKEN_TTL_SECONDS,
  })
}

export function clearAuthCookie(event: any) {
  deleteCookie(event, AUTH_COOKIE, { path: '/' })
}

export function getAuthPayload(event: any): AuthPayload | null {
  const token = getCookie(event, AUTH_COOKIE)
  if (!token) return null

  try {
    return jwt.verify(token, getJwtSecret()) as AuthPayload
  } catch {
    return null
  }
}

export function requireUser(event: any): AuthPayload {
  const payload = getAuthPayload(event)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return payload
}
