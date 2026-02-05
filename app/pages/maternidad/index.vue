<script setup lang="ts">
definePageMeta({
  title: 'Licencias de Maternidad'
})
useHead({
  title: 'Licencias de Maternidad'
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
  },  {
    id: 'desde',
    accessorKey: 'desde',
    header: "Desde",
    cell: ({ row }) => row.original

  }, {
    id: 'hasta',
    accessorKey: 'hasta',
    header: "Hasta",
    cell: ({ row }) => row.original

  }, {
    id: 'pago',
    accessorKey: 'pago',
    header: "Pago en",
    cell: ({ row }) => row.original
  }, {
    id: 'desde_2',
    header: "Desde",
    cell: ({ row }) => row.original

  }, {
    id: 'hasta_2',
    header: "Hasta",
    cell: ({ row }) => row.original

  }, {
    id: 'pago_2',
    header: "Pago en",
    cell: ({ row }) => row.original
  },  {
    id: 'desde_3',
    header: "Desde",
    cell: ({ row }) => row.original

  }, {
    id: 'hasta_3',
    header: "Hasta",
    cell: ({ row }) => row.original

  }, {
    id: 'pago_3',
    header: "Pago en",
    cell: ({ row }) => row.original
  },  {
    id: 'desde_4',
    header: "Desde",
    cell: ({ row }) => row.original

  }, {
    id: 'hasta_4',
    header: "Hasta",
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
		REGISTRO DE LICENCIAS DE MATERNIDAD Y PREST. SOCIAL
	  </h2>
  
	  <div class="grid grid-cols-3 gap-4 mt-4">
		<div>Año:__________

		</div>
  
		<div>Área:_________
		 
		</div>
  
		<div>MES:_________
		
		</div>
	  </div>
  
	   <div class="flex items-center justify-between gap-2">
        <TableSearch :table="table" column-id="name" placeholder="Buscar trabajador..." input-class="max-w-sm" />
        <UButton to="maternidad/newmaternidad">Añadir</UButton>
      </div>
	  <UTable ref="table" :data="workerStore.workers" :columns="columns" />

  
  
	  <div class="flex justify-between items-center mt-4">
		<div class="flex items-center space-x-2">
		  <span class="font-semibold">Fecha:</span>
		</div>
	  </div>
	</div>
  </template>
  

  
