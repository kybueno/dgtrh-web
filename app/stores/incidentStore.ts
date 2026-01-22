import { ref } from 'vue';
import type { TablesInsert, TablesUpdate } from '~/types/supabase';

export const incidents = ref<Incident[]>([]);
export const incidentsPending = ref<boolean>(false);

export const INCIDENT_QUERY = {
  detailed: "*",
  basic: "*",
};

// No mutation functions
export async function queryIncidents() {
  const supabase = useSupabaseClient();
  return await supabase.from("incidents").select(INCIDENT_QUERY.detailed);
}

export async function queryIncidentCreate(newIncidentData: TablesInsert<"incidents">) {
  const supabase = useSupabaseClient();
  return await supabase
    .from("incidents")
    .insert([newIncidentData])
    .select();
}

// CREATE
export async function createIncident(newIncidentData: TablesInsert<"incidents">) {
  const response = await queryIncidentCreate(newIncidentData);
  const { data, error } = response;

  if (data && data[0]) {
    incidents.value.push(data[0]);
  }
  if (error) {
    console.error(error);
    notifyError({ error, title: "Error al crear incidente" });
  }

  return response;
}

// READ
export async function loadIncidents() {
  incidentsPending.value = true;
  const response = await queryIncidents();
  const { data, error } = response;
  incidentsPending.value = false;

  if (data) {
    incidents.value = data;
  }
  if (error) {
    console.error(error);
    notifyError({ error, title: "Error al cargar incidentes" });
  }

  return response;
}

// UPDATE
export async function updateIncident(id: string, updatedIncidentData: TablesUpdate<"incidents">) {
  const supabase = useSupabaseClient();
  const response = await supabase
    .from("incidents")
    .update(updatedIncidentData)
    .eq('id', id)
    .select();

  const { data, error } = response;

  if (data && data[0]) {
    const index = incidents.value.findIndex(i => i.id === id);
    if (index !== -1) {
      incidents.value[index] = { ...incidents.value[index], ...data[0] };
    }
  }
  if (error) {
    console.error(error);
    notifyError({ error, title: "Error al actualizar incidente" });
  }

  return response;
}

// DELETE
export async function deleteIncident(id: string) {
  const supabase = useSupabaseClient();
  const { error } = await supabase
    .from("incidents")
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    notifyError({ error, title: "Error al eliminar incidente" });
    return { error };
  }

  // Remove the incident from the local state
  incidents.value = incidents.value.filter(incident => incident.id !== id);
  return { error: null };
}

// Helper functions
export async function getIncidentById(id: string) {
  // Try to find in local store first
  const localIncident = incidents.value.find(incident => incident.id === id);
  if (localIncident) return localIncident;

  // If not found locally, try to fetch from Supabase
  const supabase = useSupabaseClient();
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('id', id)
    .single();

  if (data) {
    // Add to local store for future use
    incidents.value.push(data);
    return data;
  }

  if (error) {
    console.error('Error fetching incident by ID:', error);
  }
  return null;
}
