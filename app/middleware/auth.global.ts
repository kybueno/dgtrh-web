export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/auth')) return

  const authStore = useAuthStore()
  if (!authStore.loggedUserProfile.value) {
    const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
    await authStore.fetchLoggedUserProfile({ headers })
  }

  const loggedUser = authStore.loggedUserProfile.value?.user
  if (!loggedUser) {
    return navigateTo('/auth/login')
  }
})
