<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const toast = useToast()

const open = ref(false)
const roles = ['director', 'system_admin', 'hr_manager', 'worker']

const links = [[{
  label: 'Panel principal',
  icon: 'i-lucide-house',
  to: '/dashboard',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Notificaciones',
  icon: 'i-lucide-inbox',
  to: '/inbox',
  badge: '4',
  onSelect: () => {
    open.value = false
  }
},
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
  role:"['director', 'system_admin', 'hr_manager']",
  defaultOpen: true,
  type: 'trigger',
  children: [
    {
      label: 'Prenómina',
      icon: 'lucide:file-spreadsheet',
      to: '/payroll',
      role:"['director', 'system_admin', 'hr_manager']",
      onSelect: () => {
        open.value = false
      }
    }, {
      label: 'Catálogo de claves',
      icon: 'lucide:file',
      to: '/incident-types',
      role:"['hr_manager']",
      onSelect: () => {
        open.value = false
      }
    },{
    label: 'Anexo 14',
    icon: 'lucide:file',
    to: '/positions',
    role:"['hr_manager', 'system_admin']",
    onSelect: () => {
      open.value = false
    }
  }, {
      label: 'Anexo 14-B',
      icon: 'lucide:file',
      to: '/people/14-B',
      role:"['hr_manager']",
      onSelect: () => {
        open.value = false
      }
    },
  ]
}, {
  label: 'Personal',
  to: '/people',
  role:"['hr_manager', 'system_admin']",
  icon: 'lucide:users',
  color: 'blue',
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: 'Trabajadores',
    to: '/people',
    role:"['hr_manager', 'system_admin']",
    exact: true,
    onSelect: () => {
      open.value = false
    }
  },{
    label: 'Grupos de trabajo',
    to: '/groups',
    role:"['hr_manager', 'system_admin']",
    onSelect: () => {
      open.value = false
    }
  },{
    label: 'Evaluación de desempeño',
    to: '/evaluations',
    role:"['director', 'system_admin', 'hr_manager']",
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Organizaciones',
    to: '/organizations',
    role:"['hr_manager', 'system_admin']",
    onSelect: () => {
      open.value = false
    }
  }, ]
}, {
  label: 'Reportes',
  to: '/',
  role:"['hr_manager', 'system_admin']",
  icon: 'lucide:file',
  color: "amber",
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: 'Hojas de Firma',
    to: '/signsheets',
    role:"['hr_manager', 'system_admin']",
    onSelect: () => {
      open.value = false
    }
  },{
    label: 'Vacaciones',
    to: '/holidays',
    role:"['hr_manager', 'system_admin']",
    onSelect: () => {
      open.value = false
    }
  },{
    label: 'Certificados Médicos',
    to: '/medical',
    role:"['hr_manager', 'system_admin']",
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Licencia sin sueldo',
    to: '/sin-sueldo',
    role:"['hr_manager', 'system_admin']",
    onSelect: () => {
      open.value = false
    }
  },{
    label: 'Licencia de maternidad',
    to: '/maternidad',
    role:"['hr_manager', 'system_admin']",
    onSelect: () => {
      open.value = false
    }
  }, ]

}, {
  label: 'Modelos',
  to: '/',
  role:"['hr_manager', 'system_admin']",
  icon: 'lucide:users',
  color: 'teal',
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: 'Modelo de Vacaciones',
    to: '/model',
    role:"['hr_manager', 'system_admin']",
    exact: true,
    onSelect: () => {
      open.value = false
    }
  },{
    label: 'Modelo de certificado',
    to: '/model/certificado',
    role:"['hr_manager', 'system_admin']",
    exact: true,
    onSelect: () => {
      open.value = false
    }
  }, ]

}], [{
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
}]] satisfies NavigationMenuItem[][]

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: links.flat()
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

onMounted(async () => {

  useAuthStore().fetchLoggedUserProfile()

  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') {
    return
  }

  toast.add({
    title: 'We use first-party cookies to enhance your experience on our website.',
    duration: 0,
    close: false,
    actions: [{
      label: 'Accept',
      color: 'neutral',
      variant: 'outline',
      onClick: () => {
        cookie.value = 'accepted'
      }
    }, {
      label: 'Opt out',
      color: 'neutral',
      variant: 'ghost'
    }]
  })
})

const loggedUser = useSupabaseUser()



</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar id="default" v-model:open="open" collapsible resizable class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }">
      <template #header="{ collapsed }">
        <div class="flex items-center gap-6">
          <UAvatar class="bg-primary-50 text-primary-900"><UIcon name="game-icons:abstract-042"/></UAvatar>
          <h1 class="tracking-wider font-black">DGTRH</h1>
        </div>
        <!-- <TeamsMenu :collapsed="collapsed" /> -->
      </template>

      <template #default="{ collapsed }">
        
        <UDashboardSearchButton v-if="loggedUser"  :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu v-if="loggedUser" :collapsed="collapsed" :items="links[0]" orientation="vertical" tooltip popover />

        <UNavigationMenu :collapsed="collapsed" :items="links[1]" orientation="vertical" tooltip class="mt-auto" />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <NuxtPage />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
