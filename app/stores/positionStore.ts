import type { Position, Prisma } from '~/prisma/generated/browser'

export const positions = ref<PositionInfo[]>([])

export const positionsPending = ref(false)
export type PositionInfo = Position

async function wrapFetch<T>(promise: Promise<T>) {
  try {
    const data = await promise
    return { data, error: null as any }
  } catch (error) {
    return { data: null as any, error }
  }
}

export async function loadPositions() {
  positionsPending.value = true
  const response = await wrapFetch($fetch<PositionInfo[]>('/api/positions'))
  const { data, error } = response
  positionsPending.value = false
  if (data) positions.value = data
  if (error) console.error(error)

  return response
}

export async function addPosition(newPositionData: Prisma.PositionCreateInput) {

  
  const response = await wrapFetch(
    $fetch<PositionInfo>('/api/positions', {
      method: 'POST',
      body: newPositionData,
    })
  )

  const { data, error } = response

  if (data) console.log(data)
  if (error) console.error(error)

  return response
}

export async function deletePosition(id: number) {
  const response = await wrapFetch($fetch(`/api/positions/${id}`, { method: 'DELETE' }))
  if (response.error) console.error(response.error)

  return response.error
}

export function getPositionById(code: number) {
  return positions.value.find((position) => position.code === code)
}
