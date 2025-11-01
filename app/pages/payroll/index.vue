<script setup lang="ts">

import { useWorkerStore } from '~/stores/workerStore';
import { onMounted } from 'vue';

import { UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';


const workerStore = useWorkerStore();
const supabase = useSupabaseClient()
const email = ref('')


const incidentStore = useIncidentStore()
const incidentTypeStore = useIncidentTypeStore()

onMounted(() => {
  incidentStore.loadIncidents(supabase)
})


onMounted(async () => {
  await workerStore.loadWorkers(supabase);
});

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
    <h1> Prenómina </h1>

    <div>
    <UCard>
      <template #header>

        <div class="flex justify-between">
          <UInput placeholder="Busca.." />
          <UButton icon="mdi:add" to="payroll/newprenomine">Añadir</UButton>
          <UButton icon="mdi:print" to="">Imprimir</UButton>
        </div>
      </template>
      <strong class="flex justify-center">Prenómina de mes</strong>
      <div>Empresa: Universidad de Ciencias Informáticas</div>
      <UTable :data="workerStore.workers" :columns="columns" sticky class="h-96" />

    </UCard>
  </div>


    <div class="flex gap-2">

      <Input v-model="email" type="email" />
      <Button @click="incidentStore.loadIncidents(supabase)">
        <Search />
      </Button>
    </div>

    <div class="flex flex-col gap-2">
      <template v-for="incident in incidentStore.incidents" :key="incident.id">

        <Card class="p-4 border rounded">
          {{ incident.worker_id }}
          <CardTitle>{{ incident.description }}</CardTitle>
          <CardDescription class="flex gap-2">
            <span>{{ incident.start_date }}</span> - <span>{{ incident.end_date }}</span>
          </CardDescription>
        </Card>

      </template>
    </div>
    <div @mouseenter="incidentTypeStore.loadIncidentTypes(supabase)">
      <Select>
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Tipo (clave)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="type in incidentTypeStore.incidentTypes" :key="type['code']" value="apple">
            {{ type.name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

   
  
  </template>