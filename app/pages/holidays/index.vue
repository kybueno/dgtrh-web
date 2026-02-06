<script setup lang="ts">
definePageMeta({
  title: 'Vacaciones'
})
useHead({
  title: 'Vacaciones'
})

import type { TableColumn } from '@nuxt/ui'
import { page } from '#build/ui'

type HolidayIncident = Incident & {
  worker: WorkerDetailed
  incident_type: IncidentType
}

const viewMode = ref<'table' | 'grid'>('table')
const sorting = ref([])

const { data, pending, error, refresh } = await useAsyncData<HolidayIncident[]>(
  'holiday-incidents',
  () => $fetch('/api/incidents/holidays')
)

const formatDate = (value?: string | Date | null) => {
  if (!value) return '-'
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleDateString('es-ES')
}

const columns: TableColumn<HolidayIncident>[] = [
  {
    id: 'record_number',
    header: 'No.Exp',
    cell: ({ row }) => row.original.worker?.record_number ?? '-'
  },
  {
    id: 'name',
    header: 'Nombre y Apellidos del trabajador',
    cell: ({ row }) => getDisplayName(row.original.worker)
  },
  {
    id: 'group',
    header: 'Área',
    cell: ({ row }) =>
      row.original.worker?.group?.name ||
      row.original.worker?.leaderAtGroup?.name ||
      row.original.worker?.group_id ||
      '-'
  },
  {
    id: 'start_date',
    header: 'Desde',
    cell: ({ row }) => formatDate(row.original.start_date)
  },
  {
    id: 'end_date',
    header: 'Hasta',
    cell: ({ row }) => formatDate(row.original.end_date ?? row.original.start_date)
  },
  {
    id: 'type',
    header: 'Tipo',
    cell: ({ row }) => row.original.incident_type?.description || row.original.incident_type?.name || '-'
  },
  {
    id: 'description',
    header: 'Motivo',
    cell: ({ row }) => row.original.description ?? '-'
  }
]

const table = useTemplateRef('table')
</script>

<template>
  <div class="flex flex-col w-full p-4">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-semibold text-lg">Registro de Vacaciones</h3>
      <div class="flex items-center gap-2">
        <DataViewToggle v-model="viewMode" />
        <UButton icon="mdi:refresh" variant="ghost" @click="refresh" :loading="pending" />
      </div>
    </div>

    <UAlert
      v-if="error"
      color="red"
      variant="subtle"
      title="No se pudieron cargar las vacaciones"
      :description="String(error)"
      class="mb-4"
    />

    <div class="border border-muted bg-muted/70 rounded-md">
      <Flex v-if="viewMode === 'table'" class="pt-2 px-2 justify-end">
        <TableSearch :table="table" column-id="name" placeholder="Buscar trabajador" input-class="max-w-sm" />
        <ColumnsControl :table="table" />
      </Flex>
      <UTable
        v-if="viewMode === 'table'"
        v-model:sorting="sorting"
        ref="table"
        :data="data ?? []"
        class="flex-1 w-full h-full"
        :columns="columns"
        :paginate="true"
        :page-size="10"
        sticky
        :loading="pending"
      />
      <DataGrid v-else class="p-4" :data="data ?? []" :columns="columns" />
      <div v-if="viewMode === 'table'" class="flex justify-center py-4">
        <UPagination v-model="page" :total="(data ?? []).length" :page-size="10" />
      </div>
    </div>
  </div>
</template>
