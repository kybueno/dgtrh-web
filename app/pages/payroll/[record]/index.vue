<script setup lang="ts">
import { UButton } from '#components';
import { loadIncidents } from '~/stores/incidentStore';
const incidentTypeStore = useIncidentTypeStore();
const formData = ref<IncidentType>({
  description: '',
  name: '',
  avg: false,
  classification: '',
  code: 0,
  created_at: null,
  deductible: null,
  incentive: false,
  pay_for: null,
  sum: false,
  time_classification: null,
  updated_at: null
})




onMounted(async () => {
  await Promise.all([
    loadIncidents(),
    incidentTypeStore.loadIncidentTypes(),
    loadPayroll()
  ]);
});

const loading = ref(false)
</script>

<template>
<UCard class="p-6">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

    <!-- Incidencia -->
    <UFormField label="Incidencia">
      <USelect
        class="w-full"
        :items="incidentTypeStore.incidentTypes"
        value-key="code"
        label-key="description"
        v-model="formData.code"
      />
    </UFormField>

    <!-- Días -->
    <UFormField label="Días">
      <UInput type="number" class="w-full" />
    </UFormField>

    <!-- Trabajo Extraordinario -->
    <UFormField label="Trabajo Extraordinario" class="md:col-span-2">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <UInput placeholder="Horas" />
        <UInput placeholder="0.60" />
        <UInput placeholder="1.15" />
      </div>
    </UFormField>

    <!-- Observaciones -->
    <UFormField label="Observaciones" class="md:col-span-2">
      <UTextarea
        class="w-full min-h-[120px]"
        placeholder="Agrega observaciones adicionales…"
             />
    </UFormField>

        </div>

        <div class="mt-6 flex justify-end gap-3">
        <UButton type="submit" color="primary" :loading="loading">
         {{ loading ? 'Guardando...' : 'Registrar' }}
        </UButton>

         <UButton to="/payroll" color="neutral" variant="soft" >Cancelar
         </UButton>
        </div>

</UCard>

</template>
