<script setup lang="ts">
import { incidents, loadIncidents, incidentsPending, deleteIncident } from '~/stores/incidentStore'
import { storeToRefs } from 'pinia'
import { UButton } from '#components'
import { page } from '#build/ui'

definePageMeta({
  title: 'Incidencias'
})
useHead({
  title: 'Incidencias'
})

const incidentTypeStore = useIncidentTypeStore()
const { incidentTypes } = storeToRefs(incidentTypeStore)

const { data: workersResponse } = await useAsyncData('workers-basic', async () => {
  return await $fetch<WorkerDetailed[]>('/api/workers')
}, { server: false })

onMounted(() => {
  if (!incidentsPending.value && !incidents.value.length) loadIncidents()
  if (!incidentTypes.value.length) incidentTypeStore.loadIncidentTypes()
})

const workers = computed(() => workersResponse.value || [])

const selectedWorkerId = ref<string | null>(null)
const selectedIncidentCode = ref<number | null>(null)
const startDateFrom = ref<string>('')
const startDateTo = ref<string>('')

function getWorkerLabel(workerId: string) {
  const worker = workers.value.find((item) => item.id === workerId)
  return worker ? getDisplayName(worker) : workerId
}

function getIncidentTypeLabel(code: number) {
  const type = incidentTypes.value.find((item) => item.code === code)
  return type ? `${type.code} - ${type.name}` : String(code)
}

function toDateKey(value?: string | null) {
  if (!value) return ''
  return value.split('T')[0]
}

const filteredIncidents = computed(() => {
  return incidents.value.filter((item) => {
    if (selectedWorkerId.value && item.worker_id !== selectedWorkerId.value) return false
    if (selectedIncidentCode.value !== null && item.incident_code !== selectedIncidentCode.value) return false
    const startKey = toDateKey(item.start_date)
    if (startDateFrom.value && startKey < startDateFrom.value) return false
    if (startDateTo.value && startKey > startDateTo.value) return false
    return true
  })
})

function handleReload() {
  if (!incidentsPending.value) loadIncidents()
}

async function handleDelete(incident: Incident) {
  if (!confirm('¿Está seguro de que desea eliminar esta incidencia?')) return
  const response = await deleteIncident(incident.id)
  if (!response.error) notifySuccess({ title: 'Incidencia eliminada' })
}

const table = useTemplateRef('table')
const viewMode = useLocalStorage<'table' | 'grid'>('incident.viewMode', 'table')
const sorting = ref([])

const workerOptions = computed(() =>
  workers.value.map((worker) => ({ value: worker.id, label: getDisplayName(worker) }))
)

const incidentTypeOptions = computed(() =>
  incidentTypes.value.map((type) => ({ value: type.code, label: `${type.code} - ${type.name}` }))
)

const columns = [
  { id: 'incident_code', accessorKey: 'incident_code', header: 'Tipo', cell: ({ row }: any) => getIncidentTypeLabel(row.original.incident_code) },
  { id: 'worker_id', accessorKey: 'worker_id', header: 'Trabajador', cell: ({ row }: any) => getWorkerLabel(row.original.worker_id) },
  { id: 'start_date', accessorKey: 'start_date', header: 'Inicio', cell: ({ row }: any) => new Date(row.original.start_date).toLocaleDateString() },
  { id: 'end_date', accessorKey: 'end_date', header: 'Fin', cell: ({ row }: any) => row.original.end_date ? new Date(row.original.end_date).toLocaleDateString() : '-' },
  { id: 'description', accessorKey: 'description', header: 'Descripción', cell: ({ row }: any) => row.original.description ?? '' },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }: any) => h('div', { class: 'flex items-center gap-2' }, [
      h(UButton, {
        size: 'sm',
        icon: 'i-lucide-edit',
        color: 'neutral',
        variant: 'ghost',
        title: 'Editar',
        to: `/incident/${row.original.id}`
      }),
      h(UButton, {
        size: 'sm',
        icon: 'i-lucide-trash-2',
        color: 'neutral',
        variant: 'ghost',
        title: 'Eliminar',
        onClick: () => handleDelete(row.original)
      })
    ]),
    enableSorting: false,
    enableHiding: false
  }
]
</script>

<template>
  <div class="flex flex-col w-full p-4">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-semibold text-lg">Incidencias</h3>
      <div class="flex items-center gap-2">
        <DataViewToggle v-model="viewMode" />
        <UButton @click="handleReload" variant="ghost" icon="mdi:refresh" title="Refrescar lista" :disabled="incidentsPending" :loading="incidentsPending" />
        <UButton icon="i-lucide-plus" to="/incident/new" variant="ghost">Añadir</UButton>
      </div>
    </div>

    <div class="border border-muted bg-muted/70 rounded-md">
      <Flex v-if="viewMode === 'table'" class="pt-2 px-2 flex-wrap gap-2 justify-between">
        <Flex class="gap-2 flex-wrap">
          <ClearableSelect
            v-model="selectedWorkerId"
            :items="workerOptions"
            placeholder="Filtrar trabajador"
            class="min-w-56"
          />
          <ClearableSelect
            v-model="selectedIncidentCode"
            :items="incidentTypeOptions"
            placeholder="Filtrar tipo"
            class="min-w-56"
          />
          <!-- TODO: allow multiple codes filtering -->
          <UInput v-model="startDateFrom" type="date" placeholder="Desde" />
          <UInput v-model="startDateTo" type="date" placeholder="Hasta" />
          <UButton
            variant="ghost"
            color="neutral"
            @click="() => { selectedWorkerId = null; selectedIncidentCode = null; startDateFrom = ''; startDateTo = ''; }"
          >
            Limpiar
          </UButton>
        </Flex>
        <!-- <TableSearch :table="table" column-id="description" placeholder="Buscar incidencias" input-class="max-w-lg" /> -->
        <ColumnsControl :table="table" />
      </Flex>
      <UTable
        v-if="viewMode === 'table'"
        v-model:sorting="sorting"
        ref="table"
        :columns="columns"
        :data="filteredIncidents"
        :loading="incidentsPending"
        class="w-full h-full"
        :paginate="true"
        :page-size="10"
        sticky
      />
      <DataGrid v-else class="p-4" :data="filteredIncidents" :columns="columns" />
      <div v-if="viewMode === 'table'" class="flex justify-center py-4">
        <UPagination v-model="page" :total="filteredIncidents.length" :page-size="10" />
      </div>
    </div>
  </div>
</template>
