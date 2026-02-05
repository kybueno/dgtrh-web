<script lang="ts" setup>
definePageMeta({
  title: 'Editar Organización'
})
useHead({
  title: 'Editar Organización'
})

import OrganizationsForm from '~/components/organizations/OrganizationsForm.vue'

const route = useRoute()
const organizationId = computed(() => Number(route.params.id))
const loading = ref(true)

onMounted(async () => {
  if (!organizations.value.length) await loadOrganizations()
  loading.value = false
})

const organization = computed(() =>
  organizations.value.find((o) => o.id === organizationId.value)
)
</script>

<template>
  <div>
    <div v-if="loading" class="p-4 text-sm text-gray-500">Cargando...</div>
    <OrganizationsForm v-else-if="organization" :organization="organization" />
    <div v-else class="p-4 text-sm text-gray-500">Organización no encontrada.</div>
  </div>
</template>
