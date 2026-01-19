// CREATE
export async function createExtraWork(newExtraWorkData: TablesInsert<'extra_work'>) {
  const supabase = useSupabaseClient();
  const response = await supabase
    .from('extra_work')
    .insert([newExtraWorkData])
    .select();

  if (response.error) {
    console.error(response.error);
    notifyError({ error: response.error, title: 'Error al crear trabajo extraordinario' });
  }

  return response;
}

// READ - load all
export async function loadExtraWorks() {
  const supabase = useSupabaseClient();
  return await supabase.from('extra_work').select('*');
}

// READ - by worker
export async function loadExtraWorksByWorkerId(workerId: string) {
  const supabase = useSupabaseClient();
  return await supabase
    .from('extra_work')
    .select('*')
    .eq('worker_id', workerId);
}

// UPDATE
export async function updateExtraWork(updatedExtraWorkData: TablesUpdate<'extra_work'>) {
  const supabase = useSupabaseClient();
  const response = await supabase
    .from('extra_work')
    .update(updatedExtraWorkData)
    .eq('id', updatedExtraWorkData.id)
    .select();

  if (response.error) {
    console.error(response.error);
    notifyError({ error: response.error, title: 'Error al actualizar trabajo extraordinario' });
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

  return { error: null };
}

// Get single extra work by ID
export async function getExtraWorkById(id: string) {
  const supabase = useSupabaseClient();
  const { data, error } = await supabase
    .from('extra_work')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching extra_work by ID:', error);
    return null;
  }

  return data;
}
