<script setup lang="ts">
import { incidents, loadIncidents, incidentsPending } from '~/stores/incidentStore'

definePageMeta({
  title: 'Incidencias'
})
useHead({
  title: 'Incidencias'
})

const searchTerm = ref('')

onMounted(() => { if (!incidentsPending.value && !incidents.value.length) loadIncidents() })

function handleReload() {
  if (!incidentsPending.value) loadIncidents()
}

const filteredIncidents = computed(() => {
  const q = searchTerm.value.trim().toLowerCase()
  if (!q) return incidents.value
  return incidents.value.filter(i =>
    (i.description?.toLowerCase().includes(q)) ||
    String(i.incident_code).includes(q) ||
    i.worker_id.toLowerCase().includes(q)
  )
})

const columns = [
  { header: 'Código', cell: ({ row }: any) => row.original.incident_code },
  { header: 'Trabajador', cell: ({ row }: any) => row.original.worker_id },
  { header: 'Inicio', cell: ({ row }: any) => new Date(row.original.start_date).toLocaleDateString() },
  { header: 'Fin', cell: ({ row }: any) => row.original.end_date ? new Date(row.original.end_date).toLocaleDateString() : '-' },
  { header: 'Descripción', cell: ({ row }: any) => row.original.description ?? '' },
]
</script>

<template>
  <div class="space-y-8 mt-8">
    <div class="flex justify-between">
      <UInput v-model="searchTerm" class="max-w-lg" icon="i-lucide-search" placeholder="Buscar incidencias..." />
      <div class="flex gap-3">
        <UButton @click="handleReload" variant="ghost" icon="i-lucide-refresh-cw" title="Refrescar lista" :disabled="incidentsPending" :loading="incidentsPending" />
      </div>
    </div>

    <UCard class="border border-muted rounded-md overflow-auto max-w-full">
      <UTable :columns="columns" :data="filteredIncidents" :loading="incidentsPending" />
    </UCard>
  </div>
</template>
