<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { ROLES_UI } from '../utils/role';

defineProps<{
  collapsed?: boolean
}>()
const colorMode = useColorMode()
const appConfig = useAppConfig()

const colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']
const neutrals = ['slate', 'gray', 'zinc', 'neutral', 'stone']
const authStore = useAuthStore()
const worker = computed(() => authStore.loggedUserProfile.value?.worker)
const items = computed<DropdownMenuItem[][]>(() => ([

  authStore.loggedUserProfile.value?.user ? [{
    type: 'label',
    label: getDisplayName(worker.value),
    description: authStore.loggedUserProfile.value?.user?.email,
    avatar: {
      alt: getDisplayName(worker.value)
    },
  }, {
    type: 'label',
    icon: 'lucide:badge-check',
    // label: ROLES_UI[authStore.loggedUserProfile.value?.user?.role || 'employee'].label,
    description: ROLES_UI[authStore.loggedUserProfile.value?.user?.role || 'employee'].label,
  }] : [],
  //[
  //   {
  //   label: 'Profile',
  //   icon: 'i-lucide-user'
  // },
  //  {
  //   label: 'Ajustes',
  //   icon: 'i-lucide-settings',
  //   to: '/settings'
  // }
  //],
  [{
    label: 'Tema',
    icon: 'i-lucide-palette',
    children: [{
      label: 'Primario',
      slot: 'chip',
      chip: appConfig.ui.colors.primary,
      content: {
        align: 'center',
        collisionPadding: 16
      },
      children: colors.map(color => ({
        label: color,
        chip: color,
        slot: 'chip',
        checked: appConfig.ui.colors.primary === color,
        type: 'checkbox',
        onSelect: (e) => {
          e.preventDefault()

          appConfig.ui.colors.primary = color
        }
      }))
    }, {
      label: 'Neutral',
      slot: 'chip',
      chip: appConfig.ui.colors.neutral === 'neutral' ? 'old-neutral' : appConfig.ui.colors.neutral,
      content: {
        align: 'end',
        collisionPadding: 16
      },
      children: neutrals.map(color => ({
        label: color,
        chip: color === 'neutral' ? 'old-neutral' : color,
        slot: 'chip',
        type: 'checkbox',
        checked: appConfig.ui.colors.neutral === color,
        onSelect: (e) => {
          e.preventDefault()

          appConfig.ui.colors.neutral = color
        }
      }))
    }]
  }, {
    label: 'Apariencia',
    icon: 'i-lucide-sun-moon',
    children: [{
      label: 'Clara',
      icon: 'i-lucide-sun',
      type: 'checkbox',
      checked: colorMode.value === 'light',
      onSelect(e: Event) {
        e.preventDefault()

        colorMode.preference = 'light'
      }
    }, {
      label: 'Oscura',
      icon: 'i-lucide-moon',
      type: 'checkbox',
      checked: colorMode.value === 'dark',
      onUpdateChecked(checked: boolean) {
        if (checked) {
          colorMode.preference = 'dark'
        }
      },
      onSelect(e: Event) {
        e.preventDefault()
      }
    }]
  }]
  ,
  authStore.loggedUserProfile.value?.user ? [{
    label: 'Cerrar sesión',
    icon: 'i-lucide-log-out',
    onSelect: async () => {
      await $fetch('/api/auth/logout', { method: 'POST' })
      authStore.clearLoggedUser()
      navigateTo('/auth/login')
    }
  }] : []
]))
</script>

<template>
  <UDropdownMenu :items="items" :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }">
    <UButton :avatar="{
      alt: getDisplayName(authStore.loggedUserProfile.value?.worker)
    }" :label="collapsed ? undefined : getDisplayName(authStore.loggedUserProfile.value?.worker) || 'Ajustes'" ,
      :trailingIcon="collapsed ? undefined : 'i-lucide-chevrons-up-down'" color="neutral" variant="ghost" block
      :square="collapsed" class="data-[state=open]:bg-elevated" :ui="{
        trailingIcon: 'text-dimmed'
      }" />

    <template #chip-leading="{ item }">
      <span :style="{
        '--chip-light': `var(--color-${(item as any).chip}-500)`,
        '--chip-dark': `var(--color-${(item as any).chip}-400)`
      }" class="ms-0.5 size-2 rounded-full bg-(--chip-light) dark:bg-(--chip-dark)" />
    </template>
  </UDropdownMenu>
</template>
