import { ref } from 'vue';

type WorkerStatus = 'active' | 'terminated' | 'inactive';

export const WORKER_STATUS = {
  ACTIVE: 'active',
  TERMINATED: 'terminated',
  INACTIVE: 'inactive'
} as const;

export const WORKER_STATUS_CONFIG = {
  [WORKER_STATUS.ACTIVE]: {
    label: 'Activo',
    color: 'success',
  },
  [WORKER_STATUS.TERMINATED]: {
    label: 'Baja',
    color: 'error',
  },
  [WORKER_STATUS.INACTIVE]: {
    label: 'No activo',
    color: 'neutral',
  },
  default: {
    label: '—',
    color: 'neutral',
  },
} as const;

// Select field options
export const WORKER_STATUS_OPTIONS:{label:string,value:string}[] =[
  {label:WORKER_STATUS_CONFIG[WORKER_STATUS.ACTIVE].label,value:WORKER_STATUS.ACTIVE},
  {label:WORKER_STATUS_CONFIG[WORKER_STATUS.INACTIVE].label,value:WORKER_STATUS.INACTIVE},
  {label:WORKER_STATUS_CONFIG[WORKER_STATUS.TERMINATED].label,value:WORKER_STATUS.TERMINATED},
]

export function getWorkerStatusLabel(status?: WorkerStatus): string {
  if (!status) return WORKER_STATUS_CONFIG.default.label;
  return WORKER_STATUS_CONFIG[status as keyof typeof WORKER_STATUS_CONFIG]?.label || status;
}

export function getWorkerStatusColor(status?: WorkerStatus): "success" | "error" | "neutral" | "primary" | "secondary" | "info" | "warning" {
  if (!status) return WORKER_STATUS_CONFIG.default.color;
  return WORKER_STATUS_CONFIG[status as keyof typeof WORKER_STATUS_CONFIG]?.color || WORKER_STATUS_CONFIG.default.color;
}

export const workers = ref<WorkerDetailed[]>([]);
export const workersPending = ref<boolean>(false);
export const WORKER_QUERY = {
  detailed: "*, group:groups!workers_group_id_fkey(name), position:positions(code,description,category,level)"
}


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
  const response = await supabase.from("workers").select(WORKER_QUERY.detailed);//, leaderAtGroup:groups!groups_leader_id_fkey
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
export async function getWorkerById(id: string) {
  // Try to find in local store first
  const localWorker = workers.value.find(worker => worker.id === id);
  if (localWorker) return localWorker;

  // If not found locally, try to fetch from Supabase
  const supabase = useSupabaseClient();
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .eq('id', id)
    .single();

  if (data) {
    // Add to local store for future use
    workers.value.push(data);
    return data;
  }

  if (error) {
    console.error('Error fetching worker by ID:', error);
  }
  return null;
}

export async function getWorkerByRecordNumber(recordNumber: string):Promise<WorkerDetailed | null> {
  // Try to find in local store first
  const localWorker = workers.value.find(worker => worker.record_number === recordNumber);
  if (localWorker) return localWorker;

  // If not found locally, try to fetch from Supabase
  const supabase = useSupabaseClient();
  const { data, error } = await supabase
    .from('workers')
    .select(WORKER_QUERY.detailed)
    .eq('record_number', recordNumber)
    .single();

  if (data) {
    // Add to local store for future use
    workers.value.push(data);
    return data;
  }

  if (error) {
    console.error('Error fetching worker by record number:', error);
  }
  return null;
}

export async function getWorkerByUsername(username: string) {
  // Try to find in local store first
  const localWorker = workers.value.find(
    worker => worker.email?.split("@")[0] === username
  );
  if (localWorker) return localWorker;

  // If not found locally, try to fetch from Supabase
  const supabase = useSupabaseClient();
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .ilike('email', `${username}@%`)
    .single();

  if (data) {
    // Add to local store for future use
    workers.value.push(data);
    return data;
  }

  if (error) {
    console.error('Error fetching worker by username:', error);
  }
  return null;
}
