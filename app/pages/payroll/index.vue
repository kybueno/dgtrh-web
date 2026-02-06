<script setup lang="ts">
definePageMeta({
  title: 'Prenómina'
})
useHead({
  title: 'Prenómina'
})

import { onMounted, ref } from 'vue'
import { UCheckbox } from '#components'
import type { TableColumn } from '@nuxt/ui'
import { generatePrenomina } from './payrollHelpers'
import { page } from '#build/ui'

// Import store functions and state
import { loadWorkers, workers } from '~/stores/workerStoreC';
import { loadIncidents } from '~/stores/incidentStore';
import { useIncidentTypeStore } from '~/stores/incidentTypeStore';
import { loadPayroll } from '~/stores/payrollStore'
import { loadExtraWorks } from '~/stores/extraWorkStore'

const email = ref('')
const incidentTypeStore = useIncidentTypeStore()
const viewMode = ref<'table' | 'grid'>('table')
const sorting = ref([])

// Load data
async function handleReload() {
  await Promise.all([
    loadWorkers(),
    loadIncidents(),
    incidentTypeStore.loadIncidentTypes(),
    loadPayroll(),
    loadExtraWorks()
  ])
}

onMounted(handleReload)

// Workers data is now available in the workers ref from workerStoreC
const workerData = workers;

const columns: TableColumn<WorkerDetailed>[] = [
  {
    id: 'select',
    header: ({ table }) => h(UCheckbox, {
      'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
      'aria-label': 'Select all'
    }),
    cell: ({ row }) => h(UCheckbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
      'aria-label': 'Select row'
    }),
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'record_number',
    accessorKey: 'record_number',
    header: "No.Exp",
    cell: ({ row }) => `${row.original.record_number}`
  }, {
    id: 'name',
    accessorKey: 'name',
    accessorFn: (row) => getDisplayName(row),
    header: "Nombre y Apellidos",
    cell: ({ row }) => h('span', { class: "cursor-pointer", onClick: () => navigateTo(`/payroll/${row.original.record_number}`) }, getDisplayName(row.original))
  }, {
    id: 'position',
    accessorKey: 'position',
    header: "Cargo",
    cell: ({ row }) => row.original.position?.description ?? row.original.position_code

  }, {
    id: 'incidents',
    header: "Incidencias", //Incidencias del tiempo no laborado
    cell: ({ row }) => incidents.value.filter((incident) => incident.worker_id === row.original.id)?.length

  }, {
    id: 'extra_work',
    header: "Trabajo Extraordinario",
    cell: ({ row }) => "-"
  }, {
    id: 'observations',
    header: "Observaciones",
    cell: ({ row }) => "-"
  }, 

]
const table = useTemplateRef('table')
</script>
<template>
  <div class="flex flex-col w-full p-4">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-semibold text-lg">Prenómina</h3>
      <div class="flex items-center gap-2">
        <DataViewToggle v-model="viewMode" />
        <UButton icon="mdi:refresh" variant="ghost" @click="handleReload" />
        <UButton icon="i-lucide-plus" to="/payroll/new" variant="ghost">Añadir</UButton>
        <UButton icon="lucide:printer" variant="subtle" color="neutral" @click="generatePrenomina(workers)" >Imprimir</UButton>
      </div>
    </div>

    <div class="border border-muted bg-muted/70 rounded-md">
      <Flex v-if="viewMode === 'table'" class="pt-2 px-2 justify-end">
        <TableSearch :table="table" column-id="name" placeholder="Buscar trabajador" input-class="max-w-sm" />
        <ColumnsControl :table="table" />
      </Flex>
      <UTable
        v-if="viewMode === 'table'"
        v-model:sorting="sorting"
        ref="table"
        :data="workers"
        :columns="columns"
        class="w-full h-full min-h-96"
        :paginate="true"
        :page-size="10"
        sticky
      />
      <DataGrid v-else class="p-4" :data="workers" :columns="columns" />
      <div v-if="viewMode === 'table'" class="flex justify-center py-4">
        <UPagination v-model="page" :total="workers.length" :page-size="10" />
      </div>
    </div>
  </div>
</template>
