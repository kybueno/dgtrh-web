export const organizations = useLocalStorage<OrganizationInfo[]>('organizations', [])

export const organizationsPending = ref<boolean>(false)

async function wrapFetch<T>(promise: Promise<T>) {
  try {
    const data = await promise
    return { data, error: null as any }
  } catch (error) {
    return { data: null as any, error }
  }
}

export async function addOrganization(newOrganizationData: TablesInsert<'organizations'>) {
  const response = await wrapFetch(
    $fetch<OrganizationInfo>('/api/organizations', {
      method: 'POST',
      body: newOrganizationData,
    })
  )

  const { data, error } = response

  if (data) {
    organizations.value.push(data)
  }
  if (error) console.error(error)

  return response
}

export async function loadOrganizations() {
  const hasCached = organizations.value.length > 0
  if (!hasCached) organizationsPending.value = true

  const response = await wrapFetch($fetch<OrganizationInfo[]>('/api/organizations'))

  const { data, error } = response

  if (!hasCached) organizationsPending.value = false

  if (data) organizations.value = data
  if (error) {
    console.error(error)
    if (!hasCached) notifyError({ error, title: 'Error al cargar organizaciones' })
  }

  return response
}

export async function updateOrganization(existingOrganizationData: TablesUpdate<'organizations'>) {
  const response = await wrapFetch(
    $fetch<OrganizationInfo>(`/api/organizations/${existingOrganizationData.id}`, {
      method: 'PUT',
      body: existingOrganizationData,
    })
  )

  const { data, error } = response

  if (data) {
    loadOrganizations()
  }
  if (error) console.error(error)

  return response
}

export async function deleteOrganization(id: number) {
  const response = await wrapFetch(
    $fetch(`/api/organizations/${id}`, { method: 'DELETE' })
  )
  if (response.error) console.error(response.error)
  else loadOrganizations()
  return response.error
}

export function getOrganizationById(id: number) {
  return organizations.value.find((organization) => organization.id === id)
}
