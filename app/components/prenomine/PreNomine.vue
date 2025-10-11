<script lang="ts" setup>
import { UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';

const workerStore = useWorkerStore()

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
    header: "No.Exp",
     cell: ({ row }) => `${row.original.record_number}`
    
  }, {
    header: "Nombre y Apellidos del trabajador",
    cell: ({ row }) => `${row.original.first_name} ${row.original.middle_name && row.original.middle_name.at(0) + '.'}  ${row.original.last_name}  ${row.original.second_last_name}`
  }, {
    header: "CI",
    cell: ({ row }) => row.original.ci
  }, {
    header: "Cargo",
    cell: ({ row }) => row.original

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

        <div class="flex justify-between">
          <UInput placeholder="Busca.." />
          <UButton icon="mdi:add">Añadir</UButton>
        </div>
      </template>
      <strong class="flex justify-center">Prenómina de mes</strong>
      <div>Empresa: Universidad de Ciencias Informáticas</div>
      <UTable :data="workerStore.workers" :columns="columns" sticky class="h-96" />

    </UCard>
  </div>
</template>