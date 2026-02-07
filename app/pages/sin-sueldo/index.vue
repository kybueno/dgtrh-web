<script setup lang="ts">
definePageMeta({
  title: 'Licencia sin Sueldo'
})
useHead({
  title: 'Licencia sin Sueldo'
})

import { useWorkerStore } from '~/stores/workerStore'
import { UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';


const workerStore = useWorkerStore()

onMounted(() => workerStore.loadWorkers())

const viewMode = useLocalStorage<'table' | 'grid'>('sin-sueldo.viewMode', 'table')
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
    header: "Desde",
    cell: ({ row }) => row.original

  }, {
    id: 'hasta',
    header: "Hasta",
    cell: ({ row }) => row.original

  }, {
    id: 'causas',
    header: "Causas",
    cell: ({ row }) => row.original
  }, {
    id: 'clave',
    header: "Clave de incidencias",
    cell: ({ row }) => row.original
  }, 

]
const table = useTemplateRef('table')
</script>

<template>
   <div class="flex flex-col w-full p-4">
      <div class="flex items-center justify-between mb-6">
        <h3 class="font-semibold text-lg">Licencia sin Sueldo</h3>
        <div class="flex items-center gap-2">
          <TableSearch v-if="viewMode === 'table'" :table="table" column-id="name" placeholder="Buscar trabajador..." input-class="max-w-sm" />
          <DataViewToggle v-model="viewMode" />
          <UButton icon="mdi:refresh" variant="ghost" @click="workerStore.loadWorkers()" />
          <UButton icon="i-lucide-plus" to="/sin-sueldo/newsin" variant="ghost">Añadir</UButton>
        </div>
      </div>

	  <h1 class="text-center text-xl font-bold">
		UNIVERSIDAD DE LAS CIENCIAS INFORMÁTICAS
	  </h1>
	  <h2 class="text-center font-semibold mb-4">
		Anexo G: Registro de Licencia sin sueldo
	  </h2>

    <UTable v-if="viewMode === 'table'" ref="table" :data="workerStore.workers" :columns="columns" />
    <DataGrid v-else :data="workerStore.workers" :columns="columns" />

  </div>
</template>
