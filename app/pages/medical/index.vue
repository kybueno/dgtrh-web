<script setup lang="ts">
import { useWorkerStore } from '~/stores/workerStore'
import { UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';


const supabase = useSupabaseClient()

const workerStore = useWorkerStore()

onMounted(() => workerStore.loadWorkers(supabase))

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
  }, {
    header: "Inicial/Cont.",
    cell: ({ row }) => row.original
  }, {
    header: "Desde",
    cell: ({ row }) => row.original

  }, {
    header: "Hasta",
    cell: ({ row }) => row.original

  }, {
    header: "Enfermedad",
    cell: ({ row }) => row.original
  }, {
    header: "Entrada",
    cell: ({ row }) => row.original
  }, {
    header: "Firma",
    cell: ({ row }) => row.original
  }, {
    header: "Dias en prenomina",
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
		Anexo E: REGISTRO DE Certificados Médicos
	  </h2></div>
  <UTable :data="workerStore.workers" :columns="columns" />
  <div>
  <UButton to="/medical/newmedical">Añadir</UButton>
  </div>
</template>