import type { UserRole } from '~~/prisma/generated/enums'

export const useRoleOverride = () => {
  const roleOverride = useState<UserRole | null>('dev-role-override', () => null)

  const setRoleOverride = (role: UserRole | null) => {
    roleOverride.value = role
  }

  const clearRoleOverride = () => {
    roleOverride.value = null
  }

  return {
    roleOverride,
    setRoleOverride,
    clearRoleOverride,
    isDev: import.meta.dev
  }
}
