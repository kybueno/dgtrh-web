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
import { generatePrenomina, usePayrollPDF } from './payrollHelpers';

// Import store functions and state
import { loadWorkers, workers } from '~/stores/workerStoreC';
import { loadIncidents } from '~/stores/incidentStore';
import { useIncidentTypeStore } from '~/stores/incidentTypeStore';
import { loadPayroll } from '~/stores/payrollStore'

const email = ref('')
const incidentTypeStore = useIncidentTypeStore()

// Load data
onMounted(async () => {
  await Promise.all([
    loadWorkers(),
    loadIncidents(),
    incidentTypeStore.loadIncidentTypes(),
    loadPayroll(),
    loadExtraWorks()
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
    id: 'record_number',
    accessorKey: 'record_number',
    header: "No.Exp",
    cell: ({ row }) => `${row.original.record_number}`
  }, {
    id: 'name',
    accessorKey: 'name',
    accessorFn: (row) => getDisplayName(row),
    header: "Nombre y Apellidos",
    cell: ({ row }) => h('span', { class: "cursor-pointer", onClick: () => navigateTo(`/payroll/${row.original.record_number}`) }, getDisplayName(row.original))
  }, {
    id: 'position',
    accessorKey: 'position',
    header: "Cargo",
    cell: ({ row }) => row.original.position?.description ?? row.original.position_code

  }, {
    id: 'incidents',
    header: "Incidencias", //Incidencias del tiempo no laborado
    cell: ({ row }) => incidents.value.filter((incident) => incident.worker_id === row.original.id)?.length

  }, {
    id: 'extra_work',
    header: "Trabajo Extraordinario",
    cell: ({ row }) => "-"
  }, {
    id: 'observations',
    header: "Observaciones",
    cell: ({ row }) => "-"
  }, 

]
const table = useTemplateRef('table')
</script>
<template>
    <div>
    <UCard>
      <template #header>

        <div class="flex justify-between gap-4">
          <TableSearch :table="table" column-id="name" placeholder="Buscar trabajador..." input-class="max-w-sm" />
         <div class="flex-1"></div> 
         <!-- <UButton icon="mdi:add" to="payroll/new">Añadir</UButton> -->
          <UButton icon="lucide:printer" variant="subtle" color="neutral" @click="generatePrenomina(workers)" >Imprimir</UButton>
        </div>
      </template>
      <UTable ref="table" :data="workers" :columns="columns" sticky class="min-h-96" />

    </UCard>
  </div>


    

     

   
  
</template>
