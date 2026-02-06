<script setup lang="ts">
import IncidentForm from '~/components/incident/IncidentForm.vue'

definePageMeta({
  title: 'Actualizar Incidencia'
})
useHead({
  title: 'Actualizar Incidencia'
})

const route = useRoute()
const incidentId = computed(() =>
  Array.isArray(route.params.id) ? route.params.id[0] : (route.params.id as string)
)

const loading = ref(true)
const saving = ref(false)
const incident = ref<Incident | null>(null)

onMounted(async () => {
  try {
    if (incidentId.value) {
      const data = await getIncidentById(incidentId.value)
      incident.value = data
    }
  } finally {
    loading.value = false
  }
})

async function handleUpdate(payload: TablesUpdate<'incidents'>) {
  if (!incident.value?.id || saving.value) return
  saving.value = true
  const response = await updateIncident(incident.value.id, payload)
  saving.value = false

  if (!response.error) {
    notifySuccess({ title: 'Incidencia actualizada' })
    navigateTo('/incident')
  }
}
</script>

<template>
  <div class="p-4">
    <USkeleton v-if="loading" class="m-auto h-[90%] w-120" />
    <IncidentForm
      v-else-if="incident"
      :incident="incident"
      :loading="saving"
      @save="handleUpdate"
      @cancel="navigateTo('/incident')"
    />
    <div v-else class="text-center py-12 text-sm text-gray-500">Incidencia no encontrada.</div>
  </div>
</template>
