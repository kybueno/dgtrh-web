<script setup lang="ts">
import { createIncident } from '~/stores/incidentStore'
import { useIncidentTypeStore } from '~/stores/incidentTypeStore'

const incidentTypeStore = useIncidentTypeStore()

const formData = ref<any>({
  worker_id: '',
  incident_code: 0,
  start_date: '',
  end_date: null,
  description: ''
})

const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  try {
    await createIncident(formData.value)
    
    // Reset form
    formData.value = {
      worker_id: '',
      incident_code: 0,
      start_date: '',
      end_date: null,
      description: ''
    }
    
    navigateTo('/incident')
  } catch (error) {
    console.error('Error al crear incidencia:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await incidentTypeStore.loadIncidentTypes()
})
</script>

<template>
  <div class="flex flex-col w-fit max-w-2xl mx-auto justify-center">
    <FormCard 
      icon="mdi:alert-plus" 
      heading="Registrar nueva incidencia"
      description="Complete el formulario para registrar una nueva incidencia" 
      @done="handleSubmit"
      @cancel="navigateTo('/incident')">

      <div class="grid grid-cols-2 gap-4 p-2">
        <!-- ID Trabajador -->
        <UFormField label="ID Trabajador *" class="col-span-2">
          <UInput v-model="formData.worker_id" required placeholder="ID del trabajador" />
        </UFormField>

        <!-- Código de Incidencia -->
        <UFormField label="Código de Incidencia *" class="col-span-2">
          <USelect 
            v-model="formData.incident_code" 
            :items="incidentTypeStore.incidentTypes.map(t => ({ value: t.code, label: `${t.code} - ${t.name}` }))" 
            value-key="value" 
            label-key="label"
            class="w-full"
            required 
          />
        </UFormField>

        <!-- Fecha Inicio -->
        <UFormField label="Fecha de Inicio *" class="col-span-1">
          <UInput v-model="formData.start_date" type="date" required />
        </UFormField>

        <!-- Fecha Fin -->
        <UFormField label="Fecha de Fin" class="col-span-1">
          <UInput v-model="formData.end_date" type="date" />
        </UFormField>

        <!-- Descripción -->
        <UFormField label="Descripción" class="col-span-2">
          <UTextarea v-model="formData.description" placeholder="Descripción detallada de la incidencia" />
        </UFormField>
      </div>
      
      <template #actions>
        <UButton type="submit" color="primary" :loading="loading">
          {{ loading ? 'Guardando...' : 'Registrar Incidencia' }}
        </UButton>
      </template>
    </FormCard>
  </div>
</template>