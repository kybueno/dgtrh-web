<script lang="ts" setup>
import { UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';
import { useWorkerStore } from '~/stores/workerStore'
const supabase = useSupabaseClient()

const workerStore = useWorkerStore()

onMounted(() => workerStore.loadWorkers(supabase))


interface Props {
  data: WorkerInfo[]
}
const { data } = defineProps<Props>()

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
    header: "No.",
    
  }, {
    header: "Órganos y Cargos",
    cell: ({ row }) => row.original.position_code
  }, {
    header: "CO",
    cell: ({ row }) => row.original
  }, {
    header: "Nombre y Apellidos del trabajador",
    cell: ({ row }) => `${row.original.first_name} ${row.original.middle_name && row.original.middle_name.at(0) + '.'}  ${row.original.last_name}  ${row.original.second_last_name}`
  }, {
    header: "CI",
    cell: ({ row }) => row.original.ci
  }, {
    header: "Sexo",
    cell: ({ row }) => row.original.gender

  }, {
    header: "Nivel de Preparación",
    cell: ({ row }) => row.original.level

  }, {
    header: "Grupo Escala",
    cell: ({ row }) => row.original
  }, {
    header: "Total",
    cell: ({ row }) => row.original
  }, {
    header: "Escala",
    cell: ({ row }) => row.original
  }, {
    header: "CLA",
    cell: ({ row }) => row.original
  }, {
    header: "Turnos nocturnos y Mixtos",
    cell: ({ row }) => row.original
  }, {
    header: "Maestría o Doctorados",
    cell: ({ row }) => row.original
  }, {
    header: "Años de Servicio",
    cell: ({ row }) => row.original
  }, {
    header: "Otros",
    
  },

]

</script>

<template>
  <div>
    <UCard>
      <template #header>

        <div class="flex justify-between">
          <UInput placeholder="Busca.." />
        </div>
      </template>
      <strong class="flex justify-center">Anexo No.14-B</strong>
      <div class="flex justify-center">De la Plantilla de cargos y registro de trabajadores</div>
      <div>Empresa: Universidad de Ciencias Informáticas</div>
      <UTable :data="workerStore.workers" :columns="columns" sticky class="h-96" />
      

    </UCard>
  </div>
</template>