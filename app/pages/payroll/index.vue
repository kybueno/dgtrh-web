<script setup lang="ts">
definePageMeta({
  title: 'Prenómina'
})
useHead({
  title: 'Prenómina'
})

import { onMounted, ref } from 'vue';
import { UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';
import { usePayrollPDF } from './payrollHelpers';

// Import store functions and state
import { loadWorkers, workers } from '~/stores/workerStoreC';
import { loadIncidents } from '~/stores/incidentStore';
import { useIncidentTypeStore } from '~/stores/incidentTypeStore';

const email = ref('')
const incidentTypeStore = useIncidentTypeStore()

// Load data
onMounted(async () => {
  await Promise.all([
    loadWorkers(),
    loadIncidents(),
    incidentTypeStore.loadIncidentTypes()
  ]);
});

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
    header: "No.Exp",
     cell: ({ row }) => `${row.original.record_number}`
    
  }, {
    header: "Nombre y Apellidos",
    cell: ({ row }) => `${row.original.first_name} ${row.original.middle_name && row.original.middle_name.at(0) + '.'}  ${row.original.last_name}  ${row.original.second_last_name}`
  }, {
    header: "Cargo",
    cell: ({ row }) => row.original.position.description ?? row.original.position_code

  }, {
    header: "Incidencias del tiempo no laborado",
    cell: ({ row }) => row.original

  }, {
    header: "Trabajo Extraordinario",
    cell: ({ row }) => row.original
  }, {
    header: "Observaciones",
    cell: ({ row }) => row.original
  }, 

]
</script>
<template>
    <div>
    <UCard>
      <template #header>

        <div class="flex justify-between gap-4">
          <UInput placeholder="Busca.." />
         <div class="flex-1"></div> 
         <!-- <UButton icon="mdi:add" to="payroll/new">Añadir</UButton> -->
          <UButton icon="lucide:printer" variant="subtle" color="neutral" >Imprimir</UButton>
        </div>
      </template>
      <strong class="flex justify-center font-bold">Prenómina</strong>
      <UTable :data="workers" :columns="columns" sticky class="h-96" />

    </UCard>
  </div>


    

     

   
  
  </template>