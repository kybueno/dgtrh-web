<template>
  <div class="flex flex-col w-full p-4">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-semibold text-lg">Trabajos Extraordinarios</h3>
      <div class="flex items-center gap-2">
        <TableSearch v-if="viewMode === 'table'" :table="table" column-id="description" placeholder="Buscar..."
          input-class="max-w-sm" />
        <DataViewToggle v-model="viewMode" />
        <UButton icon="mdi:refresh" variant="ghost" @click="handleReload" :disabled="pending" />
        <UButton icon="i-lucide-plus" to="/extra/new" variant="ghost">Registrar trabajo extra</UButton>
      </div>
    </div>

    <UTable v-if="viewMode === 'table'" ref="table" :columns="columns" :data="extraWorks || []" :loading="pending"
      class="w-full" />
    <DataGrid v-else :data="extraWorks || []" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import { UButton } from '#components'
import type { TableColumn } from '@nuxt/ui'
import { loadExtraWorks } from '~/stores/extraWorkStore'

const table = useTemplateRef('table')
const viewMode = ref<'table' | 'grid'>('table')

// Data fetching
const { data: extraWorks, pending, refresh } = await useAsyncData('extra-works', async () => {
  const response = await loadExtraWorks()
  if (response.error) throw response.error
  return response.data ?? []
})

function handleReload() {
  refresh()
}

// Table columns
const columns: TableColumn<any>[] = [
  { id: 'worker_id', accessorKey: 'worker_id', header: 'Trabajador', cell: ({ row }) => row.original.worker_id },
  { id: 'description', accessorKey: 'description', header: 'Descripción', cell: ({ row }) => row.original.description },
  { id: 'hours', accessorKey: 'hours', header: 'Horas', cell: ({ row }) => row.original.hours },
  { id: 'date', accessorKey: 'date', header: 'Fecha', cell: ({ row }) => row.original.date },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => h(UButton, {
      size: 'sm',
      icon: 'i-lucide-edit',
      color: 'neutral',
      variant: 'ghost',
      to: `/extra/edit/${row.original.id}`,
      title: 'Editar',
    }),
    enableSorting: false,
    enableHiding: false,
  },
]
</script>
