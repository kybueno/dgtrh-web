<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { UserRole } from '~~/prisma/generated/enums'
import { filterNavItemsByRole, getEffectiveRole } from '~/utils/role'

const route = useRoute()
const toast = useToast()

const open = ref(false)

const protectedLinks = [{
  label: 'Panel principal',
  icon: 'i-lucide-house',
  to: '/dashboard',
  onSelect: () => {
    open.value = false
  }
}, //{
  //label: 'Notificaciones',
 // icon: 'i-lucide-inbox',
 // to: '/inbox',
 // badge: '4',
 // onSelect: () => {
  //  open.value = false
 // }
//},
// { 
//   label: 'Perfiles',
//   icon: 'i-lucide',
//   to: '/profile',
//   onSelect: () => {
//     open.value = false
//   }
// },
{
  label: 'Salario',
  icon: 'mdi:attach-money',
  color: 'green',
  to: '/payroll',
  role: [UserRole.system_admin, UserRole.hr_manager],
  defaultOpen: true,
  type: 'trigger',
  children: [
    {
      label: 'Prenómina',
      icon: 'lucide:file-spreadsheet',
      to: '/payroll',
      role: [UserRole.director, UserRole.system_admin, UserRole.hr_manager],
      onSelect: () => {
        open.value = false
      }
    },{
      label: 'Incidencias',
      icon: 'lucide:file',
      to: '/incident',
      role: [UserRole.hr_manager],
      onSelect: () => {
        open.value = false
      }
    }, {
      label: 'Catálogo de claves',
      icon: 'lucide:file',
      to: '/incident/type',
      role: [UserRole.hr_manager],
      onSelect: () => {
        open.value = false
      }
    }, {
      label: 'Anexo 14',
      icon: 'lucide:file',
      to: '/positions',
      role: [UserRole.hr_manager, UserRole.system_admin],
      onSelect: () => {
        open.value = false
      }
    }, {
      label: 'Anexo 14-B',
      icon: 'lucide:file',
      to: '/people/14-B',
      role: [UserRole.hr_manager],
      onSelect: () => {
        open.value = false
      }
    },
  ]
}, {
  label: 'Personal',
  to: '/people',
  role: [UserRole.hr_manager, UserRole.system_admin],
  icon: 'lucide:users',
  color: 'blue',
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: 'Trabajadores',
    to: '/people',
    role: [UserRole.hr_manager, UserRole.system_admin, UserRole.director],
    exact: true,
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Grupos de trabajo',
    to: '/groups',
    role: [UserRole.hr_manager, UserRole.system_admin],
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Evaluación de desempeño',
    to: '/evaluations',
    role: [UserRole.director, UserRole.system_admin, UserRole.hr_manager],
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Organizaciones',
    to: '/organizations',
    role: [UserRole.hr_manager, UserRole.system_admin],
    onSelect: () => {
      open.value = false
    }
  },]
}, {
  label: 'Reportes',
  to: '/',
  role: [UserRole.hr_manager, UserRole.system_admin],
  icon: 'lucide:file',
  color: "amber",
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: 'Hojas de Firma',
    to: '/signsheets',
    role: [UserRole.hr_manager, UserRole.system_admin],
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Vacaciones',
    to: '/holidays',
    role: [UserRole.hr_manager, UserRole.system_admin],
    onSelect: () => {
      open.value = false
    }
  },]

}, {
  label: 'Modelos',
  to: '/',
  role: [UserRole.hr_manager, UserRole.system_admin],
  icon: 'lucide:users',
  color: 'teal',
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: 'Modelo de Vacaciones',
    to: '/model',
    role: [UserRole.hr_manager, UserRole.system_admin],
    exact: true,
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Modelo de certificado',
    to: '/model/certificado',
    role: [UserRole.hr_manager, UserRole.system_admin],
    exact: true,
    onSelect: () => {
      open.value = false
    }
  },]

}] satisfies NavigationMenuItem[]
const publicLinks = [{
  label: 'Directorio UCI',
  icon: 'lucide:book-user',
  to: 'https://directorio.uci.cu/',
  target: '_blank'
}, {
  label: 'Correo UCI',
  icon: 'lucide:mail',
  to: 'https://correo.uci.cu/',
  target: '_blank'
}, {
  label: 'Ayuda',
  icon: 'lucide:info',
  to: 'https://uci.cu',
  target: '_blank'
}] satisfies NavigationMenuItem[]


const authStore = useAuthStore()

onMounted(async () => {
  authStore.fetchLoggedUserProfile()

  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') {
    return
  }

  toast.add({
    title: 'Usamos cookies para mejorar su experiencia en el sistema.',
    duration: 0,
    close: false,
    actions: [{
      label: 'Aceptar',
      color: 'neutral',
      variant: 'outline',
      onClick: () => {
        cookie.value = 'accepted'
      }
    }, {
      label: 'Denegar',
      color: 'neutral',
      variant: 'ghost'
    }]
  })
})

const loggedUser = computed(() => authStore.loggedUserProfile.value?.user)
const { roleOverride, isDev } = useRoleOverride()

const effectiveRole = computed(() => {
  return getEffectiveRole(loggedUser.value?.role, roleOverride.value, isDev)
})

const filteredProtectedLinks = computed(() => {
  return filterNavItemsByRole(protectedLinks, effectiveRole.value)
})

const breadcrumbs = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  if (segments.length === 0) {
    return [{ label: 'Inicio', to: '/dashboard' }]
  }

  const items = [{ label: 'Inicio', to: '/dashboard' }]
  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const label = segment.replace(/-/g, ' ')
    items.push({
      label: index === segments.length - 1 && route.meta.title
        ? String(route.meta.title)
        : label,
      to: currentPath
    })
  })

  return items
})

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: filteredProtectedLinks.value
}, {
  id: 'code',
  label: 'Code',
  items: [{
    id: 'source',
    label: 'View page source',
    icon: 'i-simple-icons-github',
    to: `https://github.com/nuxt-ui-pro/dashboard/blob/main/app/pages${route.path === '/' ? '/index' : route.path}.vue`,
    target: '_blank'
  }]
}])


</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar id="default" v-model:open="open" collapsible resizable class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }">
      <template #header="{ collapsed }">
        <div class="flex items-center gap-6">
          <UAvatar class="bg-primary-50 text-primary-900">
            <UIcon name="game-icons:abstract-042" />
          </UAvatar>
          <h1 v-if="!collapsed" class="tracking-wider font-black">DGTRH</h1>
        </div>
        <!-- <TeamsMenu :collapsed="collapsed" /> -->
      </template>

      <template #default="{ collapsed }">

        <UDashboardSearchButton v-if="loggedUser" :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu v-if="loggedUser" :collapsed="collapsed" :items="filteredProtectedLinks" orientation="vertical" tooltip
          popover />

        <UNavigationMenu :collapsed="collapsed" :items="publicLinks" orientation="vertical" tooltip class="mt-auto" />
      </template>

      <template #footer="{ collapsed }">
        <DevRoleSwitcher v-if="isDev" :collapsed="collapsed" />
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />
    <UDashboardPanel>
      <template #header>
        <UBreadcrumb :items="breadcrumbs" class="mb-2" />
        <UDashboardNavbar
          :title="String(route.meta.title || protectedLinks.find(item => item.to === route.path)?.label || capitalizeFirstLetter(String(route.name)) || route.path)">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
        </UDashboardNavbar>
      </template>
      <template #body>
        <NuxtPage />
      </template>
    </UDashboardPanel>

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
