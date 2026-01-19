<template>
  <div class="p-4">
    <UButton 
      icon="i-heroicons-arrow-left"
      color="neutral"
      variant="ghost"
      @click="navigateTo('/extra')"
      class="mb-6"
    >
      Volver
    </UButton>

    <h1 class="text-2xl font-bold mb-6">Nuevo Trabajo Extraordinario</h1>

    <UForm :state="formState" class="space-y-4 max-w-2xl" @submit="saveItem">
      <UFormGroup label="Trabajador" name="worker_id" required>
        <WorkerSelect v-model="formState.worker_id" required />
      </UFormGroup>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup label="Fecha de inicio" name="start_date" required>
          <UInput 
            v-model="formState.start_date" 
            type="datetime-local"
            required
          />
        </UFormGroup>
        
        <UFormGroup label="Fecha de fin" name="end_date">
          <UInput 
            v-model="formState.end_date" 
            type="datetime-local"
          />
        </UFormGroup>
      </div>

      <div class="flex justify-end space-x-3 pt-4">
        <UButton 
          type="button"
          color="gray" 
          variant="ghost" 
          label="Cancelar" 
          @click="navigateTo('/extra')" 
        />
        <UButton 
          type="submit"
          :loading="saving"
          label="Guardar" 
        />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { createExtraWork } from '~/stores/extraWorkStore';

definePageMeta({
  title: 'Registrar trabajo extra'
});

const formState = reactive({
  worker_id: null as string | null,
  start_date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDThh:mm format
  end_date: undefined as string | undefined
});

const saving = ref(false);

async function saveItem() {
  try {
    saving.value = true;
    if (!formState.worker_id) {
      throw new Error('Seleccione un trabajador');
    }
    
    await createExtraWork({
      worker_id: formState.worker_id,
      start_date: formState.start_date,
      end_date: formState.end_date || null
    });
    
    useToast().add({
      title: '¡Éxito!',
      description: 'Trabajo extraordinario creado correctamente',
      color: 'success'
    });
    
    navigateTo('/extra');
  } catch (error) {
    console.error('Error saving extra work:', error);
    useToast().add({
      title: 'Error',
      description: 'No se pudo guardar el trabajo extraordinario',
      color: 'error'
    });
  } finally {
    saving.value = false;
  }
}
</script>
