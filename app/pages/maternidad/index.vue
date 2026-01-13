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


const supabase = useSupabaseClient()

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
    header: "No.Exp",
     cell: ({ row }) => `${row.original.record_number}`
    
  }, {
    header: "Nombre y Apellidos del trabajador",
    cell: ({ row }) => `${row.original.first_name} ${row.original.middle_name && row.original.middle_name.at(0) + '.'}  ${row.original.last_name}  ${row.original.second_last_name}`
  },  {
    header: "Desde",
    cell: ({ row }) => row.original

  }, {
    header: "Hasta",
    cell: ({ row }) => row.original

  }, {
    header: "Pago en",
    cell: ({ row }) => row.original
  }, {
    header: "Desde",
    cell: ({ row }) => row.original

  }, {
    header: "Hasta",
    cell: ({ row }) => row.original

  }, {
    header: "Pago en",
    cell: ({ row }) => row.original
  },  {
    header: "Desde",
    cell: ({ row }) => row.original

  }, {
    header: "Hasta",
    cell: ({ row }) => row.original

  }, {
    header: "Pago en",
    cell: ({ row }) => row.original
  },  {
    header: "Desde",
    cell: ({ row }) => row.original

  }, {
    header: "Hasta",
    cell: ({ row }) => row.original

  }, 

]
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
  
	   <UButton to="maternidad/newmaternidad">Añadir</UButton>
	  <UTable :data="workerStore.workers" :columns="columns" />

  
  
	  <div class="flex justify-between items-center mt-4">
		<div class="flex items-center space-x-2">
		  <span class="font-semibold">Fecha:</span>
		</div>
	  </div>
	</div>
  </template>
  

  