export type LoggedUserProfile = {
  user: {
    id: string
    email: string
    role: string
    workerId: string | null
  } | null
  worker: WorkerInfo | null
}

export const useAuthStore = () => {
  const loggedUserProfile = useState<LoggedUserProfile | null>(
    'logged-user-profile',
    () => null
  )

  const fetchLoggedUserProfile = async () => {
    try {
      const data = await $fetch<LoggedUserProfile>('/api/auth/me')
      loggedUserProfile.value = data
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  const clearLoggedUser = () => {
    loggedUserProfile.value = null
  }

  return {
    loggedUserProfile: readonly(loggedUserProfile),
    fetchLoggedUserProfile,
    clearLoggedUser,
  }
}
