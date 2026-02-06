import type { NavigationMenuItem } from '@nuxt/ui'
import type { UserRole } from '~~/prisma/generated/enums'

export const ROLES_UI:Record<UserRole, {icon?: string, label: string, description: string}> = {
  director: { icon: 'lucide:building', label: 'Director', description: 'Director de Gestión Tecnológica' },
  hr_manager: { icon: 'lucide:users', label: 'Gestor RH', description: 'Gestor de Recursos Humanos' },
  employee: { icon: 'lucide:user', label: 'Trabajador', description: 'Trabajador de DGT' },
  system_admin: { icon: 'lucide:shield', label: 'Administrador', description: 'Administrador del sistema' }
}

export const isRoleAllowed = (allowedRoles: UserRole[] | undefined, role?: UserRole) => {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true
  }
  if (!role) {
    return false
  }
  return allowedRoles.includes(role)
}

export const getEffectiveRole = (
  role: UserRole | undefined,
  override: UserRole | null,
  isDev: boolean
) => {
  if (isDev && override) {
    return override
  }
  return role
}

export const filterNavItemsByRole = (items: NavigationMenuItem[], role?: UserRole) => {
  return items.reduce<NavigationMenuItem[]>((acc, item) => {
    const children = item.children
      ? filterNavItemsByRole(item.children, role)
      : undefined

    const hasRoleAccess = isRoleAllowed(item.role as UserRole[] | undefined, role)
    const hasChildAccess = Boolean(children && children.length > 0)

    if (!hasRoleAccess && !hasChildAccess) {
      return acc
    }

    acc.push({
      ...item,
      children
    })

    return acc
  }, [])
}
