<template>
  <UDropdown :items="userMenuItems" :popper="{ placement: 'bottom-start' }" :ui="{ width: 'w-48' }">
    <UButton color="neutral" variant="ghost" class="flex items-center space-x-2">
      <UAvatar v-if="user" :alt="user.name" />
      <span class="hidden md:inline-flex text-sm font-medium">
        {{ user?.name || 'Usuario' }}
      </span>
      <UIcon name="i-heroicons-chevron-down-20-solid" class="w-4 h-4" />
    </UButton>

    <template #account="{ item }">
      <div class="text-left">
        <p class="font-medium">{{ item.label }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.description }}</p>
      </div>
    </template>
  </UDropdown>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore';

const authStore = useAuthStore();
const user = computed(() => authStore.loggedUserProfile.value);

const userMenuItems = computed(() => [
  [{
    label: user.value?.name || 'Usuario',
    slot: 'account',
    disabled: true
  }],
  [{
    label: 'Perfil',
    icon: 'i-heroicons-user-circle',
    to: '/profile'
  }, {
    label: 'Configuración',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/settings'
  }],
  [{
    label: 'Cerrar sesión',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: () => authStore.logout()
  }]
]);
</script>
