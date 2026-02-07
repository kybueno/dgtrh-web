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

const viewMode = useLocalStorage<'table' | 'grid'>('people.14-b.viewMode', 'table')
const selectedGender = ref<string | null>(null)
const selectedGroup = ref<string | null>(null)
const selectedPosition = ref<string | number | null>(null)

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

const groupOptions = computed(() =>
  workers.value
    .map((worker) => worker.group?.name || worker.led_groups?.[0]?.name)
    .filter((value): value is string => !!value)
    .map((value) => ({ value, label: value }))
)

const positionOptions = computed(() =>
  workers.value.map((worker) => ({
    value: worker.position?.description ?? worker.position_code,
    label: worker.position?.description ?? String(worker.position_code)
  }))
)

const filteredWorkers = computed(() => {
  return workers.value.filter((worker) => {
    if (selectedGender.value && worker.gender !== selectedGender.value) return false
    const groupName = worker.group?.name || worker.led_groups?.[0]?.name
    if (selectedGroup.value && groupName !== selectedGroup.value) return false
    const positionLabel = worker.position?.description ?? worker.position_code
    if (selectedPosition.value && positionLabel !== selectedPosition.value) return false
    return true
  })
})

</script>

<template>
  <div class="flex flex-col w-full p-4">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-semibold text-lg">Anexo 14-B</h3>
      <div class="flex items-center gap-2">
        <TableSearch v-if="viewMode === 'table'" :table="table" column-id="name" placeholder="Buscar trabajador..." input-class="max-w-sm" />
        <DataViewToggle v-model="viewMode" />
        <UButton icon="mdi:refresh" variant="ghost" @click="loadWorkers()" />
        <UButton icon="i-lucide-plus" to="/people/new" variant="ghost">Añadir</UButton>
      </div>
    </div>

    <div v-if="viewMode === 'table'" class="flex flex-wrap gap-2 pb-3">
      <ClearableSelect v-model="selectedGender" :items="GENDER_OPTIONS" placeholder="Sexo" class="min-w-40" />
      <ClearableSelect v-model="selectedGroup" :items="groupOptions" placeholder="Área" class="min-w-44" />
      <ClearableSelect v-model="selectedPosition" :items="positionOptions" placeholder="Cargo" class="min-w-56" />
      <UButton variant="ghost" color="neutral" @click="() => { selectedGender = null; selectedGroup = null; selectedPosition = null; }">Limpiar</UButton>
    </div>

    <strong class="flex justify-center">Anexo No.14-B</strong>
    <div class="flex justify-center mb-4">De la Plantilla de cargos y registro de trabajadores</div>
    <UTable v-if="viewMode === 'table'" ref="table" :data="filteredWorkers" :columns="columns" sticky class="h-96" />
    <DataGrid v-else :data="filteredWorkers" :columns="columns" />
  </div>
</template>
