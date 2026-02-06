<script setup lang="ts">
import type { UserRole } from '~~/prisma/generated/enums'
import { getEffectiveRole, isRoleAllowed } from '~/utils/role'

const props = defineProps<{
  roles?: UserRole[]
}>()

const authStore = useAuthStore()
const { roleOverride, isDev } = useRoleOverride()

const effectiveRole = computed(() => {
  return getEffectiveRole(
    authStore.loggedUserProfile.value?.user?.role,
    roleOverride.value,
    isDev
  )
})

const isAllowed = computed(() => {
  return isRoleAllowed(props.roles, effectiveRole.value)
})
</script>

<template>
  <slot v-if="isAllowed" />
  <slot v-else name="fallback" />
</template>
