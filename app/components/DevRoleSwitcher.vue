<script setup lang="ts">
import { UserRole } from '~~/prisma/generated/enums'
import { getEffectiveRole } from '~/utils/role'

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

const uiSelectedRole = computed<string>({
  get: () => selectedRole.value ?? '',
  set: (value) => {
    selectedRole.value = value ? (value as UserRole) : null
  }
})

const effectiveRole = computed(() => {
  return getEffectiveRole(
    authStore.loggedUserProfile.value?.user?.role,
    roleOverride.value,
    isDev
  ) ?? null
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
      <select
        v-model="uiSelectedRole"
        class="w-full rounded-md border border-default bg-transparent px-3 py-2 text-sm"
      >
        <option value="">Use actual role</option>
        <option v-for="option in roleOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
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
