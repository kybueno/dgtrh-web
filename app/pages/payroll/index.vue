<script setup lang="ts">

import { useWorkerStore } from '~/stores/workerStore';
import { onMounted } from 'vue';
//import { exportprenomine, generateprenomine } from './prenomine';

const workerStore = useWorkerStore();
const supabase = useSupabaseClient()
const email = ref('')


const incidentStore = useIncidentStore()
const incidentTypeStore = useIncidentTypeStore()

onMounted(() => {
  incidentStore.loadIncidents(supabase)
})
</script>
<template>
    <h1> Prenómina </h1>

 
    <div>
      
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