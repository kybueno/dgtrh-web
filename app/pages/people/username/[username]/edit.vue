<template>
  <div class="mx-auto">
    <div v-if="loading" >
    <USkeleton class="h-[70%] w-120"/>
    </div>
    <div v-else-if="!worker" class="text-center py-12">
      <h2 class="text-xl font-semibold text-gray-700">Trabajador no encontrado</h2>
      <p class="mt-2 text-gray-500">No se pudo encontrar el trabajador solicitado.</p>
      <UButton to="/people" class="mt-4">Volver a la lista</UButton>
    </div>
    <WorkerFormUpdate
      v-else
      :data="worker"
      @save="handleUpdateWorker"
      @cancel="router.back()"
    />
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  title: 'Actualizar datos del trabajador'
});
useHead({
  title: 'Actualizar datos del trabajador'
});

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const worker = ref<Tables<'workers'> | null>(null);

onMounted(async () => {
  try {
    const username = Array.isArray(route.params.username) 
      ? route.params.username[0] 
      : route.params.username;
    
    // Find worker by username (email prefix)
    if (!username) {
      throw new Error('Username is required');
    }
    const workerData = await getWorkerByUsername(username);
    
    if (workerData) {
      worker.value = workerData;
    }
  } catch (error) {
    console.error('Error loading worker data:', error);
  } finally {
    loading.value = false;
  }
});

async function handleUpdateWorker(newWorkerData: TablesUpdate<'workers'>) {
    if (!worker.value) return;
    
    const { error } = await updateWorker(worker.value.id, newWorkerData);

    if (error) {
      console.error('Error updating worker:', error);
      useToast().add({
        title: 'Error',
        description: 'Hubo un error al actualizar el trabajador.',
        color: 'error',
      });
      return;
    }

  // Show success message
  useToast().add({
    title: '¡Éxito!',
    description: 'Los datos del trabajador se han actualizado correctamente.',
    color: 'success',
  });
  
  // Redirect to worker detail page
  router.push({name:'people',params:{username:route.params.username}});
}
</script>