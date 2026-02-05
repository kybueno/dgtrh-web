<script setup lang="ts">
definePageMeta({
  title: 'Certificados Médicos'
})
useHead({
  title: 'Certificados Médicos'
})

import { useWorkerStore } from '~/stores/workerStore'
import { UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';


const workerStore = useWorkerStore()

onMounted(() => workerStore.loadWorkers())

const columns: TableColumn<WorkerInfo>[] = [
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
    id: 'initial',
    header: "Inicial/Cont.",
    cell: ({ row }) => row.original
  }, {
    id: 'desde',
    header: "Desde",
    cell: ({ row }) => row.original

  }, {
    id: 'hasta',
    header: "Hasta",
    cell: ({ row }) => row.original

  }, {
    id: 'enfermedad',
    header: "Enfermedad",
    cell: ({ row }) => row.original
  }, {
    id: 'entrada',
    header: "Entrada",
    cell: ({ row }) => row.original
  }, {
    id: 'firma',
    header: "Firma",
    cell: ({ row }) => row.original
  }, {
    id: 'dias',
    header: "Dias en prenomina",
    cell: ({ row }) => row.original
  }, 

]
const table = useTemplateRef('table')
</script>

<template>
    <div class="p-6 space-y-6">
	  <h1 class="text-center text-xl font-bold">
		UNIVERSIDAD DE LAS CIENCIAS INFORMÁTICAS
	  </h1>
	  <h2 class="text-center font-semibold">
		Anexo E: REGISTRO DE Certificados Médicos
	  </h2>
    <div class="flex items-center justify-between gap-2">
      <TableSearch :table="table" column-id="name" placeholder="Buscar trabajador..." input-class="max-w-sm" />
      <UButton to="/medical/newmedical">Añadir</UButton>
    </div>
  <UTable ref="table" :data="workerStore.workers" :columns="columns" />
  
  </div>
</template>
