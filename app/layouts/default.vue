<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const toast = useToast()

const open = ref(false)

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
{
  label: 'Salario',
  icon: 'mdi:attach-money',
  to: '/payroll',
  defaultOpen: true,
  type: 'trigger',
  children: [
    {
      label: 'Prenómina',
      icon: 'lucide:file-spreadsheet',
      to: '/payroll',
      onSelect: () => {
        open.value = false
      }
    }, {
      label: 'Catálogo de claves',
      icon: 'lucide:file',
      to: '/incident-types',
      onSelect: () => {
        open.value = false
      }
    }, {
      label: 'Anexo 14-B',
      icon: 'lucide:file',
      to: '/people/14-B',
      onSelect: () => {
        open.value = false
      }
    },
  ]
}, {
  label: 'Personal',
  to: '/people',
  icon: 'lucide:users',
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: 'Trabajadores',
    to: '/people',
    exact: true,
    onSelect: () => {
      open.value = false
    }
  },{
    label: 'Grupos de trabajo',
    to: '/groups',
    onSelect: () => {
      open.value = false
    }
  },{
    label: 'Evaluación de anual',
    to: '/evaluations',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Hojas de Firma',
    to: '/signsheets',
    onSelect: () => {
      open.value = false
    }
  }, ]
}, {
  label: 'Reportes',
  to: '/',
  icon: 'lucide:users',
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: 'Vacaciones',
    to: '/holidays',
    onSelect: () => {
      open.value = false
    }
  },{
    label: 'Certificados Médicos',
    to: '/medical',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Licencia sin sueldo',
    to: '/sin-sueldo',
    onSelect: () => {
      open.value = false
    }
  },{
    label: 'Licencia de maternidad',
    to: '/maternidad',
    onSelect: () => {
      open.value = false
    }
  }, ]

}, {
  label: 'Modelos',
  to: '/',
  icon: 'lucide:users',
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: 'Modelo de Vacaciones',
    to: '/model',
    exact: true,
    onSelect: () => {
      open.value = false
    }
  },{
    label: 'Modelo de certificado',
    to: '/model/certificado',
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
      <!-- <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
      </template> -->

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
