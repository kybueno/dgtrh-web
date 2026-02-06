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
  <div v-if="isDev" >
    <div class="text-xs text-muted mb-2" v-if="!collapsed">
      Dev only role control
    </div>
    <Flex>
      <UButton
        v-if="!collapsed"
        size="xs"
        color="neutral"
        variant="ghost"
        icon="lucide:rotate-ccw"
        @click="resetToActual"
      />
      <select
        v-model="uiSelectedRole"
        class="flex-1 rounded-md border border-default bg-transparent ps-2 text-xs"
      >
        <option value="">Use actual role</option>
        <option v-for="option in roleOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </Flex>
  </div>
</template>
