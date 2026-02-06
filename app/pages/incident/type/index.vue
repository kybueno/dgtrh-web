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

const selectedClassification = ref<string | null>(null)
const selectedPayFor = ref<string | null>(null)
const deductibleFilter = ref<'all' | 'yes' | 'no'>('all')
const incentiveFilter = ref<'all' | 'yes' | 'no'>('all')
const sumFilter = ref<'all' | 'yes' | 'no'>('all')
const avgFilter = ref<'all' | 'yes' | 'no'>('all')

const classificationOptions = computed(() =>
  incidentTypeStore.incidentTypes
    .map((type) => type.classification)
    .filter((value): value is string => !!value)
    .map((value) => ({ value, label: value }))
)

const payForOptions = computed(() =>
  incidentTypeStore.incidentTypes
    .map((type) => type.pay_for)
    .filter((value): value is string => !!value)
    .map((value) => ({ value, label: value }))
)

const filteredIncidentTypes = computed(() => {
  return incidentTypeStore.incidentTypes.filter((type) => {
    if (selectedClassification.value && type.classification !== selectedClassification.value) return false
    if (selectedPayFor.value && type.pay_for !== selectedPayFor.value) return false
    if (deductibleFilter.value === 'yes' && !type.deductible) return false
    if (deductibleFilter.value === 'no' && type.deductible) return false
    if (incentiveFilter.value === 'yes' && !type.incentive) return false
    if (incentiveFilter.value === 'no' && type.incentive) return false
    if (sumFilter.value === 'yes' && !type.sum) return false
    if (sumFilter.value === 'no' && type.sum) return false
    if (avgFilter.value === 'yes' && !type.avg) return false
    if (avgFilter.value === 'no' && type.avg) return false
    return true
  })
})

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
      <Flex v-if="viewMode === 'table'" class="pt-2 px-2 flex-wrap gap-2 justify-between">
        <Flex class="gap-2 flex-wrap">
          <USelect v-model="selectedClassification" :items="classificationOptions" placeholder="Clasificación" class="min-w-44" clearable />
          <USelect v-model="selectedPayFor" :items="payForOptions" placeholder="A pagar por" class="min-w-44" clearable />
          <USelect
            v-model="deductibleFilter"
            :items="[{ value: 'all', label: 'Deducible: todos' }, { value: 'yes', label: 'Deducible: sí' }, { value: 'no', label: 'Deducible: no' }]"
            class="min-w-44"
          />
          <USelect
            v-model="incentiveFilter"
            :items="[{ value: 'all', label: 'Estímulo: todos' }, { value: 'yes', label: 'Estímulo: sí' }, { value: 'no', label: 'Estímulo: no' }]"
            class="min-w-44"
          />
          <USelect
            v-model="sumFilter"
            :items="[{ value: 'all', label: 'Suma: todos' }, { value: 'yes', label: 'Suma: sí' }, { value: 'no', label: 'Suma: no' }]"
            class="min-w-44"
          />
          <USelect
            v-model="avgFilter"
            :items="[{ value: 'all', label: 'Prom.: todos' }, { value: 'yes', label: 'Prom.: sí' }, { value: 'no', label: 'Prom.: no' }]"
            class="min-w-44"
          />
          <UButton
            variant="ghost"
            color="neutral"
            @click="() => { selectedClassification = null; selectedPayFor = null; deductibleFilter = 'all'; incentiveFilter = 'all'; sumFilter = 'all'; avgFilter = 'all'; }"
          >
            Limpiar
          </UButton>
        </Flex>
        <TableSearch :table="table" column-id="description" placeholder="Buscar por descripción" input-class="max-w-sm" />
        <ColumnsControl :table="table" />
      </Flex>
      <UTable
        v-if="viewMode === 'table'"
        v-model:sorting="sorting"
        ref="table"
        :columns="columns"
        :data="filteredIncidentTypes"
        class="w-full h-full"
        :paginate="true"
        :page-size="10"
        sticky
      />
      <DataGrid v-else class="p-4" :data="filteredIncidentTypes" :columns="columns" />
      <div v-if="viewMode === 'table'" class="flex justify-center py-4">
        <UPagination v-model="page" :total="filteredIncidentTypes.length" :page-size="10" />
      </div>
    </div>
    <!-- <IncidentTypeForm @submit="handleCreateIncidentType" /> -->
   
  </div>

</template>
