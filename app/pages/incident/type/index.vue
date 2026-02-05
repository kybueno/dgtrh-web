<script setup lang="ts">
definePageMeta({
  title: 'Catálogo de Claves de Ausencias'
})
useHead({
  title: 'Catálogo de Claves de Ausencias'
})

import { UCheckbox } from '#components'
import type { TableColumn } from '@nuxt/ui'

const incidentTypeStore = useIncidentTypeStore()

onMounted(() => incidentTypeStore.loadIncidentTypes())

const table = useTemplateRef('table')
const viewMode = ref<'table' | 'grid'>('table')

const columns: TableColumn<IncidentType>[] = [
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
    id: 'code',
    accessorKey: 'code',
    header: "Code",
    cell: ({ row }) => row.original.code,
  }, {
    id: 'description',
    accessorKey: 'description',
    header: "Descripción",
    cell: ({ row }) => row.original.description
  }, {
    id: 'classification',
    accessorKey: 'classification',
    header: "Clasificación",
    cell: ({ row }) => row.original.classification
  }, {
    id: 'pay_for',
    accessorKey: 'pay_for',
    header: "A pagar por",
    cell: ({ row }) => row.original.pay_for
  }, {
    id: 'percent',
    header: "%",
    cell: () => 0.00
  }, {
    id: 'deductible',
    accessorKey: 'deductible',
    header: "Deductible",
    cell: ({ row }) => row.original.deductible
  }, {
    id: 'time_classification',
    accessorKey: 'time_classification',
    header: "Clasifc. Fondo Tiempo",
    cell: ({ row }) => row.original.time_classification
  },
]
</script>
<template>
  <div class="flex flex-col w-full p-4">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-semibold text-lg">Catálogo de Claves de Ausencias</h3>
      <div class="flex items-center gap-2">
        <TableSearch v-if="viewMode === 'table'" :table="table" column-id="description" placeholder="Buscar descripción..." input-class="max-w-sm" />
        <DataViewToggle v-model="viewMode" />
        <UButton icon="mdi:refresh" variant="ghost" @click="incidentTypeStore.loadIncidentTypes()" />
        <UButton icon="i-lucide-plus" to="/incident/type/new" variant="ghost">Añadir</UButton>
      </div>
    </div>

    <UTable v-if="viewMode === 'table'" ref="table" :columns="columns" :data="incidentTypeStore.incidentTypes" />
    <DataGrid v-else :data="incidentTypeStore.incidentTypes" :columns="columns" />
    <!-- <IncidentTypeForm @submit="handleCreateIncidentType" /> -->
    <div @mouseenter="incidentTypeStore.loadIncidentTypes()">
      <Select>
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Tipo (clave)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="type in incidentTypeStore.incidentTypes" :key="type['code']" value="apple">
            {{ type.name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>

</template>
