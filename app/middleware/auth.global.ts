export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/auth')) return

  const authStore = useAuthStore()
  if (!authStore.loggedUserProfile.value) {
    await authStore.fetchLoggedUserProfile()
  }

  const loggedUser = authStore.loggedUserProfile.value?.user
  if (!loggedUser) {
    return navigateTo('/auth/login')
  }
})
