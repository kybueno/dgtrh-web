import { ref } from 'vue';

export const extraWorks = ref<Tables<'extra_work'>[]>([]);
export const extraWorksPending = ref<boolean>(false);

// CREATE
export async function createExtraWork(newExtraWorkData: TablesInsert<'extra_work'>) {
  const supabase = useSupabaseClient();
  const response = await supabase
    .from('extra_work')
    .insert([newExtraWorkData])
    .select();

  const { data, error } = response;

  if (data && data[0]) {
    extraWorks.value.push(data[0]);
  }
  if (error) {
    console.error(error);
    notifyError({ error, title: 'Error al crear trabajo extraordinario' });
  }

  return response;
}

// READ - load all
export async function loadExtraWorks() {
  const supabase = useSupabaseClient();

  extraWorksPending.value = true;
  const response = await supabase.from('extra_work').select('*');
  const { data, error } = response;
  extraWorksPending.value = false;

  if (data) {
    extraWorks.value = data;
  }
  if (error) {
    console.error(error);
    notifyError({ error, title: 'Error al cargar trabajos extraordinarios' });
  }

  return response;
}

// READ - by worker
export async function loadExtraWorksByWorkerId(workerId: string) {
  const supabase = useSupabaseClient();

  extraWorksPending.value = true;
  const response = await supabase
    .from('extra_work')
    .select('*')
    .eq('worker_id', workerId);
  const { data, error } = response;
  extraWorksPending.value = false;

  if (error) {
    console.error(error);
    notifyError({ error, title: 'Error al cargar trabajos extraordinarios del trabajador' });
    return response;
  }

  if (data) {
    // merge/replace entries for this worker
    const others = extraWorks.value.filter(e => e.worker_id !== workerId);
    extraWorks.value = [...others, ...data];
  }

  return response;
}

// UPDATE
export async function updateExtraWork(updatedExtraWorkData: TablesUpdate<'extra_work'>) {
  const supabase = useSupabaseClient();
  const response = await supabase
    .from('extra_work')
    .update(updatedExtraWorkData)
    .eq('id', updatedExtraWorkData.id)
    .select();

  const { data, error } = response;

  if (data && data[0]) {
    const index = extraWorks.value.findIndex(e => e.id === updatedExtraWorkData.id);
    if (index !== -1) {
      extraWorks.value[index] = { ...extraWorks.value[index], ...data[0] };
    }
  }
  if (error) {
    console.error(error);
    notifyError({ error, title: 'Error al actualizar trabajo extraordinario' });
  }

  return response;
}

// DELETE
export async function deleteExtraWork(id: UUID) {
  const supabase = useSupabaseClient();
  const { error } = await supabase
    .from('extra_work')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    notifyError({ error, title: 'Error al eliminar trabajo extraordinario' });
    return { error };
  }

  extraWorks.value = extraWorks.value.filter(e => e.id !== id);
  return { error: null };
}

// Helpers
export async function getExtraWorkById(id: string) {
  const local = extraWorks.value.find(e => e.id === id);
  if (local) return local;

  const supabase = useSupabaseClient();
  const { data, error } = await supabase
    .from('extra_work')
    .select('*')
    .eq('id', id)
    .single();

  if (data) {
    extraWorks.value.push(data);
    return data;
  }

  if (error) {
    console.error('Error fetching extra_work by ID:', error);
  }
  return null;
}
