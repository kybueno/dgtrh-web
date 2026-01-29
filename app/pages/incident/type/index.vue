<script setup lang="ts">
definePageMeta({
  title: 'Catálogo de Claves de Ausencias'
})
useHead({
  title: 'Catálogo de Claves de Ausencias'
})

const supabase = useSupabaseClient()

const incidentTypeStore = useIncidentTypeStore()

onMounted(() => incidentTypeStore.loadIncidentTypes())

const handleCreateIncidentType = async (newIncidentTypeData: IncidentTypeInsert) => {
  if (!newIncidentTypeData.code) {
    console.log('No valid data')
    return
  }
  const { data, error } = await supabase.from('incident_types').insert(newIncidentTypeData).select() //TODO: move this to a store
  const createdIncidentType = data ? data[0] : null
  if (createdIncidentType) incidentTypeStore.incidentTypes.push(createdIncidentType)
  if (error) console.error(error)
}

</script>
<template>
  <div class="flex flex-col gap-8 w-full">
    <div class="flex justify-between">

      <h1> Catálogo de Claves de Ausencias </h1>
      <div class="flex gap-2">

        <UButton @click="()=>incidentTypeStore.loadIncidentTypes()">
          Refrescar claves
        </UButton>
      </div>
    </div>

    <IncidentTypeTable :data="incidentTypeStore.incidentTypes" />
    <!-- <IncidentTypeForm @submit="handleCreateIncidentType" /> -->
    <div @mouseenter="incidentTypeStore.loadIncidentTypes()">
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





  </div>

</template>
