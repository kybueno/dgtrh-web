import type { Group, Prisma } from '~/prisma/generated/browser'

// tipo que define la info del grupo, su ljefe y miembros en un mismo objeto
export interface WorkGroupInfo extends Group {
  leader: WorkerInfo
  workers: WorkerInfo[]
}

export const workGroups = ref<WorkGroupInfo[]>([])
export const groupsPending = ref(false)

async function wrapFetch<T>(promise: Promise<T>) {
  try {
    const data = await promise
    return { data, error: null as any }
  } catch (error) {
    return { data: null as any, error }
  }
}

export async function addGroup(newWorkGroupData: Prisma.GroupCreateInput) {
  const response = await wrapFetch(
    $fetch<WorkGroupInfo>('/api/groups', {
      method: 'POST',
      body: newWorkGroupData,
    })
  )

  const { data, error } = response

  if (data) workGroups.value.push(data)
  if (error) console.error(error)

  return response
}

export async function loadGroups() {
  groupsPending.value = true
  const response = await wrapFetch($fetch<WorkGroupInfo[]>('/api/groups'))
  const { data, error } = response
  groupsPending.value = false
  if (data) workGroups.value = data
  if (error) console.error(error)

  return response
}

export async function deleteGroup(id: number) {
  const response = await wrapFetch(
    $fetch(`/api/groups/${id}`, { method: 'DELETE' })
  )
  if (response.error) console.error(response.error)

  return response.error
}

export function getGroupById(id: number) {
  return workGroups.value.find((group) => group.id === id)
}
