import type { UserRole } from '~~/prisma/generated/enums'

export type LoggedUserProfile = {
  user: {
    id: string
    email: string
    role: UserRole
    workerId: string | null
  } | null
  worker: WorkerInfo | null
}

export const useAuthStore = () => {
  const loggedUserProfile = useState<LoggedUserProfile | null>(
    'logged-user-profile',
    () => null
  )

  const fetchLoggedUserProfile = async (options?: {
    headers?: HeadersInit
  }) => {
    try {
      const data = await $fetch<LoggedUserProfile>('/api/auth/me', {
        headers: options?.headers,
      })
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
