<script setup lang="ts">
import IncidentForm from '~/components/incident/IncidentForm.vue'

definePageMeta({
  title: 'Nueva Incidencia'
})
useHead({
  title: 'Nueva Incidencia'
})

const loading = ref(false)

async function handleCreate(payload: TablesInsert<'incidents'>) {
  if (loading.value) return
  loading.value = true
  const response = await createIncident(payload)
  loading.value = false

  if (response.data) {
    notifySuccess({ title: 'Incidencia creada' })
    navigateTo('/incident')
  }
}
</script>

<template>
  <div class="p-4">
    <IncidentForm :loading="loading" @save="handleCreate" @cancel="navigateTo('/incident')" />
  </div>
</template>
