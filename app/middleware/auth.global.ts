import { AUTH_COOKIE } from '#shared/constants/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/auth')) return
  const authStore = useAuthStore()
  const isServer = import.meta.server
  const cookieHeader = isServer ? useRequestHeaders(['cookie']).cookie : undefined
  const hasAuthCookie = isServer
    ? cookieHeader?.includes(`${AUTH_COOKIE}=`)
    : false

  if (!authStore.loggedUserProfile.value && isServer && !hasAuthCookie) {
    return navigateTo('/auth/login')
  }

  if (!authStore.loggedUserProfile.value) {
    const headers = isServer ? useRequestHeaders(['cookie']) : undefined
    await authStore.fetchLoggedUserProfile({ headers })
  }

  const loggedUser = authStore.loggedUserProfile.value?.user
  if (!loggedUser) {
    return navigateTo('/auth/login')
  }
})
