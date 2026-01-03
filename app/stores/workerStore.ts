import { ref } from 'vue';
import { useSupabaseClient } from '#imports';

export const workers = ref<WorkerInfo[]>([]);
export const workersPending = ref<boolean>(false);

// CREATE
export async function createWorker(newWorkerData: TablesInsert<"workers">) {
  const supabase = useSupabaseClient();
  const response = await supabase
    .from("workers")
    .insert([newWorkerData])
    .select();

  const { data, error } = response;

  if (data && data[0]) {
    workers.value.push(data[0]);
  }
  if (error) {
    console.error(error);
    notifyError({ error, title: "Error al crear trabajador" });
  }

  return response;
}

// READ
export async function loadWorkers() {
  const supabase = useSupabaseClient();
  
  workersPending.value = true;
  const response = await supabase.from("workers").select("*");
  const { data, error } = response;
  workersPending.value = false;

  if (data) {
    workers.value = data;
  }
  if (error) {
    console.error(error);
    notifyError({ error, title: "Error al cargar trabajadores" });
  }

  return response;
}

// UPDATE
export async function updateWorker(updatedWorkerData: TablesUpdate<"workers">) {
  const supabase = useSupabaseClient();
  const response = await supabase
    .from("workers")
    .update(updatedWorkerData)
    .eq('id', updatedWorkerData.id)
    .select();

  const { data, error } = response;

  if (data && data[0]) {
    // Update the worker in the local state
    const index = workers.value.findIndex(w => w.id === updatedWorkerData.id);
    if (index !== -1) {
      workers.value[index] = { ...workers.value[index], ...data[0] };
    }
  }
  if (error) {
    console.error(error);
    notifyError({ error, title: "Error al actualizar trabajador" });
  }

  return response;
}

// DELETE
export async function deleteWorker(id: UUID) {
  const supabase = useSupabaseClient();
  const { error } = await supabase
    .from("workers")
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    notifyError({ error, title: "Error al eliminar trabajador" });
    return { error };
  }

  // Remove the worker from the local state
  workers.value = workers.value.filter(worker => worker.id !== id);
  return { error: null };
}

// Helper functions
export function getWorkerById(id: string) {
  return workers.value.find(worker => worker.id === id);
}

export function getWorkerByRecordNumber(recordNumber: string) {
  return workers.value.find(worker => worker.record_number === recordNumber);
}

export function getWorkerByUsername(username: string) {
  return workers.value.find(
    worker => worker.email?.split("@")[0] === username
  );
}
