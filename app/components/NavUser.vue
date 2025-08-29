<script setup lang="ts">

const props = defineProps<{
  user: Tables<'profiles_with_worker'> | null
  workerInfo: WorkerInfo
}>()

const supabase = useSupabaseClient()
const handleSignOut = async () => {
  await supabase.auth.signOut()
  const router = useRouter()
  router.replace('/auth/login')
}
</script>

<template>
  <div class="w-full">
    <UDropdownMenu :items="[
      [
        {
          label: getProfileDisplayName(workerInfo),
          slot: 'account',
          disabled: true
        }
      ],
      [
        {
          label: 'Tareas',
          icon: 'i-heroicons-check-badge',
          click: () => console.log('Tareas clicked')
        },
        {
          label: 'Mi actividad',
          icon: 'i-heroicons-credit-card',
          click: () => console.log('Actividad clicked')
        },
        {
          label: 'Notificaciones',
          icon: 'i-heroicons-bell',
          click: () => console.log('Notificaciones clicked')
        }
      ],
      [
        {
          label: 'Cerrar sesión',
          icon: 'i-heroicons-arrow-left-on-rectangle',
          click: handleSignOut
        }
      ]
    ]">
      <UButton color="neutral" variant="ghost" class="w-full justify-start">
        <UAvatar :src="`https://seccdn.libravatar.org/avatar/${btoa(workerInfo.email)}?s=64`" size="sm"
          class="flex-shrink-0" rounded :alt="getProfileDisplayName(workerInfo)">

        </UAvatar>

        <span class="truncate text-left ml-3">
          <span class="truncate block font-medium text-sm">{{ getProfileDisplayName(workerInfo) }}</span>
          <span v-if="workerInfo?.email" class="truncate block text-xs text-gray-500">{{ workerInfo.email }}</span>
        </span>

        <UIcon name="i-heroicons-chevron-up-down" class="w-4 h-4 ml-auto text-gray-400" />
      </UButton>

      <template #account="{ item }">
        <div class="text-left">
          <p class="truncate font-medium text-gray-900">{{ workerInfo.first_name }}{{ getProfileDisplayName(workerInfo)
            }}
          </p>
          <p v-if="workerInfo?.email" class="truncate text-xs text-gray-500">{{ workerInfo.email }}</p>
        </div>
      </template>
    </UDropdownMenu>
  </div>
</template>