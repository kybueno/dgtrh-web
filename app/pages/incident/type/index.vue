<script setup lang="ts">
definePageMeta({
  title: 'Catálogo de Claves de Ausencias'
})
useHead({
  title: 'Catálogo de Claves de Ausencias'
})

import { UCheckbox } from '#components'
import type { TableColumn } from '@nuxt/ui'
import { page } from '#build/ui'

const incidentTypeStore = useIncidentTypeStore()

onMounted(() => incidentTypeStore.loadIncidentTypes())

const table = useTemplateRef('table')
const viewMode = ref<'table' | 'grid'>('table')
const sorting = ref([])

function formatBoolean(value: boolean | null | undefined): string {
  if (value === null || value === undefined) return '-'
  return value ? 'Sí' : 'No'
}

const columns: TableColumn<IncidentType>[] = [
  {
    id: 'select',
    header: ({ table }) => h(UCheckbox, {
      modelValue: table.getIsSomePageRowsSelected()
        ? 'indeterminate'
        : table.getIsAllPageRowsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
        table.toggleAllPageRowsSelected(!!value),
      'aria-label': 'Select all'
    }),
    cell: ({ row }) => h(UCheckbox, {
      modelValue: row.getIsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
        row.toggleSelected(!!value),
      'aria-label': 'Select row'
    }),
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: 'Código',
    cell: ({ row }) => row.original.code
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => row.original.name
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Descripción',
    cell: ({ row }) => row.original.description ?? '-'
  },
  {
    id: 'classification',
    accessorKey: 'classification',
    header: 'Clasificación',
    cell: ({ row }) => row.original.classification
  },
  {
    id: 'pay_for',
    accessorKey: 'pay_for',
    header: 'A pagar por',
    cell: ({ row }) => row.original.pay_for ?? 'Nada'
  },
  {
    id: 'deductible',
    accessorKey: 'deductible',
    header: 'Deducible',
    cell: ({ row }) => formatBoolean(row.original.deductible)
  },
  {
    id: 'incentive',
    accessorKey: 'incentive',
    header: 'Estímulo',
    cell: ({ row }) => formatBoolean(row.original.incentive)
  },
  {
    id: 'sum',
    accessorKey: 'sum',
    header: 'Suma Reporte Ausencias',
    cell: ({ row }) => formatBoolean(row.original.sum)
  },
  {
    id: 'avg',
    accessorKey: 'avg',
    header: 'Prom. Trabaj.',
    cell: ({ row }) => formatBoolean(row.original.avg)
  },
  {
    id: 'time_classification',
    accessorKey: 'time_classification',
    header: 'Clasif. Fondo Tiempo',
    cell: ({ row }) => row.original.time_classification ?? '-'
  }
]
</script>
<template>
  <div class="flex flex-col w-full p-4">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-semibold text-lg">Catálogo de Claves de Ausencias</h3>
      <div class="flex items-center gap-2">
        <DataViewToggle v-model="viewMode" />
        <UButton icon="mdi:refresh" variant="ghost" @click="incidentTypeStore.loadIncidentTypes()" />
        <UButton icon="i-lucide-plus" to="/incident/type/new" variant="ghost">Añadir</UButton>
      </div>
    </div>

    <div class="border border-muted bg-muted/70 rounded-md">
      <Flex v-if="viewMode === 'table'" class="pt-2 px-2 justify-end">
        <TableSearch :table="table" column-id="description" placeholder="Buscar por descripción" input-class="max-w-sm" />
        <ColumnsControl :table="table" />
      </Flex>
      <UTable
        v-if="viewMode === 'table'"
        v-model:sorting="sorting"
        ref="table"
        :columns="columns"
        :data="incidentTypeStore.incidentTypes"
        class="w-full h-full"
        :paginate="true"
        :page-size="10"
        sticky
      />
      <DataGrid v-else class="p-4" :data="incidentTypeStore.incidentTypes" :columns="columns" />
      <div v-if="viewMode === 'table'" class="flex justify-center py-4">
        <UPagination v-model="page" :total="incidentTypeStore.incidentTypes.length" :page-size="10" />
      </div>
    </div>
    <!-- <IncidentTypeForm @submit="handleCreateIncidentType" /> -->
   
  </div>

</template>
