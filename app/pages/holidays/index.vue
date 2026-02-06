<script setup lang="ts">
definePageMeta({
  title: 'Vacaciones'
})
useHead({
  title: 'Vacaciones'
})

import { useWorkerStore } from '~/stores/workerStore'
import { UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';
import { page } from '#build/ui'


onMounted(() =>loadHolidays())

onMounted(() =>loadWorkers())

const viewMode = ref<'table' | 'grid'>('table')
const sorting = ref([])

const columns: TableColumn<HolidaysInfo>[] = [
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
    header: "Nombre y Apellidos del trabajador",
    cell: ({ row }) => getDisplayName(row.original)
  }, {
    id: 'group',
    accessorKey: 'group',
    header: "Área",
    cell: ({ row }) => row.original.group?.name || row.original.leaderAtGroup?.name || row.original.group_id
  }, {
    id: 'desde',
    accessorKey: 'desde',
    header: "Desde",
    cell: ({ row }) => row.original.desde
  }, {
    id: 'hasta',
    accessorKey: 'hasta',
    header: "Hasta",
    cell: ({ row }) => row.original.hasta
  }, {
    id: 'tiempo',
    accessorKey: 'tiempo',
    header: "Tiempo",
    cell: ({ row }) => row.original.tiempo
  }, {
    id: 'incorporacion',
    accessorKey: 'incorporacion',
    header: "Incorporación",
    cell: ({ row }) => row.original.incorporacion
  }, {
    id: 'motivo',
    accessorKey: 'motivo',
    header: "Motivo",
    cell: ({ row }) => row.original.motivo
  }, 

]
const table = useTemplateRef('table')
</script>

<template>
    <div class="flex flex-col w-full p-4">
	  <div class="flex items-center justify-between mb-6">
        <h3 class="font-semibold text-lg">Registro de Vacaciones</h3>
        <div class="flex items-center gap-2">
          <DataViewToggle v-model="viewMode" />
          <UButton icon="mdi:refresh" variant="ghost" @click="loadHolidays()" />
          <UButton icon="i-lucide-plus" to="holidays/new" variant="ghost">Añadir</UButton>
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
          class="flex-1 w-full h-full"
          :columns="columns"
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
