import { ref } from 'vue'

export const incidents = ref<Incident[]>([])
export const incidentsPending = ref<boolean>(false)

export const INCIDENT_QUERY = {
  detailed: '*',
  basic: '*',
}

async function wrapFetch<T>(promise: Promise<T>) {
  try {
    const data = await promise
    return { data, error: null as any }
  } catch (error) {
    return { data: null as any, error }
  }
}

export async function queryIncidents() {
  return wrapFetch($fetch<Incident[]>('/api/incidents'))
}

export async function queryIncidentCreate(newIncidentData: TablesInsert<'incidents'>) {
  return wrapFetch(
    $fetch<Incident>('/api/incidents', {
      method: 'POST',
      body: newIncidentData,
    })
  )
}

export async function createIncident(newIncidentData: TablesInsert<'incidents'>) {
  const response = await queryIncidentCreate(newIncidentData)
  const { data, error } = response

  if (data) {
    incidents.value.push(data)
  }
  if (error) {
    console.error(error)
    notifyError({ error, title: 'Error al crear incidencia' })
  }

  return response
}

export async function loadIncidents() {
  incidentsPending.value = true
  const response = await queryIncidents()
  const { data, error } = response
  incidentsPending.value = false

  if (data) {
    incidents.value = data
  }
  if (error) {
    console.error(error)
    notifyError({ error, title: 'Error al cargar incidencias' })
  }

  return response
}

export async function updateIncident(
  id: string,
  updatedIncidentData: TablesUpdate<'incidents'>
) {
  const response = await wrapFetch(
    $fetch<Incident>(`/api/incidents/${id}`, {
      method: 'PUT',
      body: updatedIncidentData,
    })
  )

  const { data, error } = response

  if (data) {
    const index = incidents.value.findIndex((i) => i.id === id)
    if (index !== -1) {
      incidents.value[index] = { ...incidents.value[index], ...data }
    }
  }
  if (error) {
    console.error(error)
    notifyError({ error, title: 'Error al actualizar incidencia' })
  }

  return response
}

export async function deleteIncident(id: string) {
  const response = await wrapFetch(
    $fetch(`/api/incidents/${id}`, { method: 'DELETE' })
  )

  if (response.error) {
    console.error(response.error)
    notifyError({ error: response.error, title: 'Error al eliminar incidencia' })
    return { error: response.error }
  }

  incidents.value = incidents.value.filter((incident) => incident.id !== id)
  return { error: null }
}

export async function getIncidentById(id: string) {
  const localIncident = incidents.value.find((incident) => incident.id === id)
  if (localIncident) return localIncident

  const response = await wrapFetch($fetch<Incident>(`/api/incidents/${id}`))

  if (response.data) {
    incidents.value.push(response.data)
    return response.data
  }

  if (response.error) {
    console.error('Error fetching incident by ID:', response.error)
  }
  return null
}
