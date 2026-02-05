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


onMounted(() =>loadHolidays())

onMounted(() =>loadWorkers())

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
    <div class="p-6 space-y-6">
	  <h2 class="text-center font-semibold">
		Registro de Vacaciones
	  </h2>
    <div class="flex items-center justify-between gap-2">
      <TableSearch :table="table" column-id="name" placeholder="Buscar trabajador..." input-class="max-w-sm" />
      <UButton to="holidays/new">Añadir</UButton>
    </div>
    <UTable ref="table" :data="workers" class="flex-1" :columns="columns"/>
  </div>


</template>
