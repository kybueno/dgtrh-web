<script lang="ts" setup>
definePageMeta({
  title: 'Anexo 14-B'
})
useHead({
  title: 'Anexo 14-B'
})

import { UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';

onMounted(() => loadWorkers())


interface Props {
  data: WorkerDetailed[]
}
const { data } = defineProps<Props>()

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
    id: 'number',
    header: "No.",
  }, {
    id: 'position',
    accessorKey: 'position',
    header: "Órganos y Cargos",
    cell: ({ row }) => row.original.position?.description ?? row.original.position_code
  }, {
    id: 'co',
    header: "CO",
    cell:  "T"
  }, {
    id: 'name',
    accessorKey: 'name',
    accessorFn: (row) => getDisplayName(row),
    header: "Nombre y Apellidos del trabajador",
    cell: ({ row }) => getDisplayName(row.original)
  }, {
    id: 'ci',
    accessorKey: 'ci',
    header: "CI",
    cell: ({ row }) => row.original.ci
  }, {
    id: 'gender',
    accessorKey: 'gender',
    header: "Sexo",
    cell: ({ row }) => getGenderLabel(row.original.gender as GenderValue)

  }, {
    id: 'level',
    accessorKey: 'level',
    header: "Nivel de Preparación",
    cell: ({ row }) => row.original.level

  }, {
    id: 'group_escale',
    accessorKey: 'group_escale',
    header: "Grupo Escala",
    cell: ({ row }) => row.original.position?.group_escale 
  }, {
    id: 'total',
    accessorKey: 'total',
    header: "Total",
    cell: ({ row }) => row.original.position?.total
  }, {
    id: 'scale',
    accessorKey: 'scale',
    header: "Escala",
    cell: ({ row }) => row.original.position?.scale
  }, {
    id: 'cla',
    header: "CLA",
    cell: "0.00"
  }, {
    id: 'turnos',
    header: "Turnos nocturnos y Mixtos",
    cell: ({ row }) => row.original
  }, {
    id: 'masters',
    header: "Maestría o Doctorados",
    cell: "0.00"
  }, {
    id: 'years',
    header: "Años de Servicio",
    cell: "0.00"
  }, {
    id: 'otros',
    header: "Otros",
    cell: "0.00"
    
  },

]
const table = useTemplateRef('table')

</script>

<template>
  <div>
    <UCard>
      <template #header>

        <div class="flex justify-between">
          <TableSearch :table="table" column-id="name" placeholder="Buscar trabajador..." input-class="max-w-sm" />
        </div>
      </template>
      <strong class="flex justify-center">Anexo No.14-B</strong>
      <div class="flex justify-center">De la Plantilla de cargos y registro de trabajadores</div>
      <UTable ref="table" :data="workers" :columns="columns" sticky class="h-96" />
      

    </UCard>
  </div>
</template>
