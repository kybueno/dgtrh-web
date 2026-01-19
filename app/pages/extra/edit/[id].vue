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

    <h1 class="text-2xl font-bold mb-6">Editar Trabajo Extraordinario</h1>

    <div v-if="pending" class="flex justify-center p-8">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" />
    </div>

    <UForm v-else :state="formState" class="space-y-4 max-w-2xl" @submit="saveItem">
      <UFormGroup label="Trabajador" name="worker_id" required>
        <WorkerSelect v-model="formState.worker_id" required />
      </UFormGroup>
      
      <UFormGroup label="Descripción" name="description" required>
        <UTextarea v-model="formState.description" />
      </UFormGroup>
      
      <div class="grid grid-cols-2 gap-4">
        <UFormGroup label="Horas" name="hours" required>
          <UInput 
            v-model.number="formState.hours" 
            type="number" 
            min="0" 
            step="0.5" 
            required
          />
        </UFormGroup>
        
        <UFormGroup label="Fecha" name="date" required>
          <UInput 
            v-model="formState.date" 
            type="date" 
            required
          />
        </UFormGroup>
      </div>

      <div class="flex justify-end space-x-3 pt-4">
        <UButton 
          type="button"
          color="neutral" 
          variant="ghost" 
          label="Cancelar" 
          @click="navigateTo('/extra')" 
        />
        <UButton 
          type="submit"
          :loading="saving"
          label="Actualizar" 
        />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { updateExtraWork, getExtraWorkById } from '~/stores/extraWorkStore';

const route = useRoute();
const id = route.params.id as string;

definePageMeta({
  middleware: 'auth'
});

const { data: extraWork, pending } = await useAsyncData(
  `extra-work-${id}`,
  () => getExtraWorkById(id)
);

const formState = reactive({
  worker_id: extraWork.value?.worker_id || '',
  description: extraWork.value?.description || '',
  hours: extraWork.value?.hours || 0,
  date: extraWork.value?.date ? extraWork.value.date.split('T')[0] : new Date().toISOString().split('T')[0]
});

const saving = ref(false);

async function saveItem() {
  if (!extraWork.value) return;
  
  try {
    saving.value = true;
    await updateExtraWork({
      id: extraWork.value.id,
      worker_id: formState.worker_id,
      description: formState.description,
      hours: Number(formState.hours),
      date: formState.date
    });
    
    useToast().add({
      title: '¡Éxito!',
      description: 'Trabajo extraordinario actualizado correctamente',
      color: 'success'
    });
    
    navigateTo('/extra');
  } catch (error) {
    console.error('Error updating extra work:', error);
    useToast().add({
      title: 'Error',
      description: 'No se pudo actualizar el trabajo extraordinario',
      color: 'error'
    });
  } finally {
    saving.value = false;
  }
}
</script>
