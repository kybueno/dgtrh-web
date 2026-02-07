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

    <div v-if="viewMode === 'table'" class="flex flex-wrap gap-2 pb-2">
      <ClearableSelect v-model="selectedWorkerId" :items="workerOptions" placeholder="Filtrar trabajador" class="min-w-56" />
      <UInput v-model="dateFrom" type="date" placeholder="Desde" />
      <UInput v-model="dateTo" type="date" placeholder="Hasta" />
      <UButton variant="ghost" color="neutral" @click="() => { selectedWorkerId = null; dateFrom = ''; dateTo = ''; }">Limpiar</UButton>
    </div>

    <UTable v-if="viewMode === 'table'" ref="table" :columns="columns" :data="filteredExtraWorks" :loading="pending"
      class="w-full" />
    <DataGrid v-else :data="filteredExtraWorks" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import { UButton } from '#components'
import type { TableColumn } from '@nuxt/ui'
import { loadExtraWorks } from '~/stores/extraWorkStore'

const table = useTemplateRef('table')
const viewMode = useLocalStorage<'table' | 'grid'>('extra.viewMode', 'table')

const selectedWorkerId = ref<string | null>(null)
const dateFrom = ref<string>('')
const dateTo = ref<string>('')

// Data fetching
const { data: extraWorks, pending, refresh } = await useAsyncData('extra-works', async () => {
  const response = await loadExtraWorks()
  if (response.error) throw response.error
  return response.data ?? []
})

const { data: workersResponse } = await useAsyncData('workers-basic', async () => {
  return await $fetch<WorkerDetailed[]>('/api/workers')
}, { server: false })
const workers = computed(() => workersResponse.value || [])

function handleReload() {
  refresh()
}

const workerOptions = computed(() =>
  workers.value.map((worker) => ({ value: worker.id, label: getDisplayName(worker) }))
)

function toDateKey(value?: string | null) {
  if (!value) return ''
  return value.split('T')[0]
}

const filteredExtraWorks = computed(() => {
  const data = extraWorks.value ?? []
  return data.filter((item) => {
    if (selectedWorkerId.value && item.worker_id !== selectedWorkerId.value) return false
    const dateKey = toDateKey(item.date)
    if (dateFrom.value && dateKey < dateFrom.value) return false
    if (dateTo.value && dateKey > dateTo.value) return false
    return true
  })
})

// Table columns
const columns: TableColumn<any>[] = [
  { id: 'worker_id', accessorKey: 'worker_id', header: 'Trabajador', cell: ({ row }) => {
    const worker = workers.value.find((item) => item.id === row.original.worker_id)
    return worker ? getDisplayName(worker) : row.original.worker_id
  } },
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
