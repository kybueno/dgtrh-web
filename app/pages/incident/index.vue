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

const columns = [
  { id: 'incident_code', accessorKey: 'incident_code', header: 'Código', cell: ({ row }: any) => row.original.incident_code },
  { id: 'worker_id', accessorKey: 'worker_id', header: 'Trabajador', cell: ({ row }: any) => row.original.worker_id },
  { id: 'start_date', accessorKey: 'start_date', header: 'Inicio', cell: ({ row }: any) => new Date(row.original.start_date).toLocaleDateString() },
  { id: 'end_date', accessorKey: 'end_date', header: 'Fin', cell: ({ row }: any) => row.original.end_date ? new Date(row.original.end_date).toLocaleDateString() : '-' },
  { id: 'description', accessorKey: 'description', header: 'Descripción', cell: ({ row }: any) => row.original.description ?? '' },
]
</script>

<template>
  <div class="space-y-8 mt-8">
    <div class="flex justify-between">
      <TableSearch :table="table" column-id="description" placeholder="Buscar incidencias..." input-class="max-w-lg" />
      <div class="flex gap-3">
        <UButton @click="handleReload" variant="ghost" icon="i-lucide-refresh-cw" title="Refrescar lista" :disabled="incidentsPending" :loading="incidentsPending" />
      </div>
    </div>

    <UCard class="border border-muted rounded-md overflow-auto max-w-full">
      <UTable ref="table" :columns="columns" :data="incidents" :loading="incidentsPending" />
    </UCard>
  </div>
</template>
