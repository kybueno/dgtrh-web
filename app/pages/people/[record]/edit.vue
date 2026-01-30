<template>
  <USkeleton class="m-auto h-[90%] w-120" v-if="loading" />
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
</template>

<script setup lang="ts">

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const worker = ref<Tables<'workers'> | null>(null);

definePageMeta({
  title: 'Actualizar datos del trabajador'
});
useHead({
  title: 'Actualizar datos del trabajador'
});
onMounted(async () => {
  try {
    const recordNumber = Array.isArray(route.params.record) 
      ? route.params.record[0] 
      : route.params.record;
    
    if (!recordNumber) {
      throw new Error('Número de expediente es requerido');
    }
    
    const workerData = await getWorkerByRecordNumber(recordNumber);
    
    if (workerData) {
      worker.value = workerData;
    }
  } catch (error) {
    console.error('Error al cargar los datos del trabajador:', error);
  } finally {
    loading.value = false;
  }
});

async function handleUpdateWorker(newWorkerData: TablesUpdate<'workers'>) {
  if (!worker.value?.id) return;
  
  try {
    const { error } = await updateWorker(worker.value.id,newWorkerData);
    
    if (!error) {
      useRouter().push(`/people/${newWorkerData.record_number}`);
    }
  } catch (error) {
    console.error('Error al actualizar el trabajador:', error);
  }
}
</script>
