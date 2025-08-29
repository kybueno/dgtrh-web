<script setup lang="ts">
const supabase = useSupabaseClient()

const incidentTypeStore = useIncidentTypeStore()

onMounted(() => incidentTypeStore.loadIncidentTypes(supabase))
const handleCreateIncidentType = async (newIncidentTypeData: IncidentTypeInsert) => {
  if (!newIncidentTypeData.code) {
    console.log('No valid data')
    return
  }
  const { data, error } = await supabase.from('incident_types').insert(newIncidentTypeData).select()
  const createdIncidentType = data ? data[0] : null
  if (createdIncidentType) incidentTypeStore.incidentTypes.push(createdIncidentType)
  if (error) console.error(error)
}

</script>
<template>
  <div class="flex flex-col gap-8">
    <div class="flex justify-between">

      <h1> Catálogo de Claves de Ausencias </h1>
      <div class="flex gap-2">

        <Button @click="incidentTypeStore.loadIncidentTypes">
          Refrescar claves
        </Button>
      </div>
    </div>

    <IncidentTypeTable :data="incidentTypeStore.incidentTypes" />
    <IncidentTypeForm @submit="handleCreateIncidentType" />
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





  </div>

</template>
