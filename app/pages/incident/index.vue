<script setup lang="ts">
import { incidents, loadIncidents, incidentsPending } from '~/stores/incidentStore'

definePageMeta({
  title: 'Incidencias'
})
useHead({
  title: 'Incidencias'
})

onMounted(() => { if (!incidentsPending.value && !incidents.value.length) loadIncidents() })

function handleReload() {
  if (!incidentsPending.value) loadIncidents()
}

const table = useTemplateRef('table')
const viewMode = ref<'table' | 'grid'>('table')

const columns = [
  { id: 'incident_code', accessorKey: 'incident_code', header: 'Código', cell: ({ row }: any) => row.original.incident_code },
  { id: 'worker_id', accessorKey: 'worker_id', header: 'Trabajador', cell: ({ row }: any) => row.original.worker_id },
  { id: 'start_date', accessorKey: 'start_date', header: 'Inicio', cell: ({ row }: any) => new Date(row.original.start_date).toLocaleDateString() },
  { id: 'end_date', accessorKey: 'end_date', header: 'Fin', cell: ({ row }: any) => row.original.end_date ? new Date(row.original.end_date).toLocaleDateString() : '-' },
  { id: 'description', accessorKey: 'description', header: 'Descripción', cell: ({ row }: any) => row.original.description ?? '' },
]
</script>

<template>
  <div class="flex flex-col w-full p-4">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-semibold text-lg">Incidencias</h3>
      <div class="flex items-center gap-2">
        <TableSearch v-if="viewMode === 'table'" :table="table" column-id="description" placeholder="Buscar incidencias..." input-class="max-w-lg" />
        <DataViewToggle v-model="viewMode" />
        <UButton @click="handleReload" variant="ghost" icon="mdi:refresh" title="Refrescar lista" :disabled="incidentsPending" :loading="incidentsPending" />
        <UButton icon="i-lucide-plus" to="/incident/new" variant="ghost">Añadir</UButton>
      </div>
    </div>

    <UTable v-if="viewMode === 'table'" ref="table" :columns="columns" :data="incidents" :loading="incidentsPending" />
    <DataGrid v-else :data="incidents" :columns="columns" />
  </div>
</template>
