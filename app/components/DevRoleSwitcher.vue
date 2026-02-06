<script setup lang="ts">
import { UserRole } from '~~/prisma/generated/enums'

defineProps<{
  collapsed?: boolean
}>()

const authStore = useAuthStore()
const { roleOverride, setRoleOverride, clearRoleOverride, isDev } = useRoleOverride()

const roleOptions = Object.values(UserRole).map((role) => ({
  value: role,
  label: role.replace('_', ' ')
}))

const selectedRole = computed({
  get: () => roleOverride.value,
  set: (value) => {
    setRoleOverride(value ?? null)
  }
})

const effectiveRole = computed(() => {
  return roleOverride.value ?? authStore.loggedUserProfile.value?.user?.role ?? null
})

const resetToActual = () => {
  clearRoleOverride()
}
</script>

<template>
  <div v-if="isDev" class="mt-4 border-t border-default pt-4">
    <div class="text-xs font-semibold uppercase text-muted mb-2" v-if="!collapsed">
      Dev Role
    </div>
    <div class="flex flex-col gap-2">
      <USelect
        v-model="selectedRole"
        :items="roleOptions"
        placeholder="Use actual role"
        class="w-full"
      />
      <div class="text-xs text-muted" v-if="!collapsed">
        Actual: <span class="font-medium">{{ effectiveRole ?? 'none' }}</span>
      </div>
      <UButton
        v-if="!collapsed"
        size="xs"
        color="neutral"
        variant="ghost"
        @click="resetToActual"
      >
        Reset to actual
      </UButton>
    </div>
  </div>
</template>
