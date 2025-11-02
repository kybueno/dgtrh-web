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
    <div>Anexo E: Registro de Certificado Médico</div>
  <UTable class="flex-1" />
  <div>
  <UButton to="/medical/newmedical">Añadir</UButton>
  </div>
</template>