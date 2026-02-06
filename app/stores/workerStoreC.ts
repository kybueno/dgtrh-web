import { ref } from 'vue'
import type { Prisma } from '~/prisma/generated/browser'

type WorkerStatus = 'active' | 'terminated' | 'inactive'

export const WORKER_STATUS = {
  ACTIVE: 'active',
  TERMINATED: 'terminated',
  INACTIVE: 'inactive',
} as const

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
} as const

export const WORKER_STATUS_OPTIONS: { label: string; value: string }[] = [
  {
    label: WORKER_STATUS_CONFIG[WORKER_STATUS.ACTIVE].label,
    value: WORKER_STATUS.ACTIVE,
  },
  {
    label: WORKER_STATUS_CONFIG[WORKER_STATUS.INACTIVE].label,
    value: WORKER_STATUS.INACTIVE,
  },
  {
    label: WORKER_STATUS_CONFIG[WORKER_STATUS.TERMINATED].label,
    value: WORKER_STATUS.TERMINATED,
  },
]

export function getWorkerStatusLabel(status?: WorkerStatus): string {
  if (!status) return WORKER_STATUS_CONFIG.default.label
  return (
    WORKER_STATUS_CONFIG[status as keyof typeof WORKER_STATUS_CONFIG]?.label ||
    status
  )
}

export function getWorkerStatusColor(
  status?: WorkerStatus
): 'success' | 'error' | 'neutral' | 'primary' | 'secondary' | 'info' | 'warning' {
  if (!status) return WORKER_STATUS_CONFIG.default.color
  return (
    WORKER_STATUS_CONFIG[status as keyof typeof WORKER_STATUS_CONFIG]?.color ||
    WORKER_STATUS_CONFIG.default.color
  )
}

export const workers = ref<WorkerDetailed[]>([])
export const workersPending = ref<boolean>(false)
export const WORKER_QUERY = {
  detailed: 'include',
  basic: 'basic',
}

async function wrapFetch<T>(promise: Promise<T>) {
  try {
    const data = await promise
    return { data, error: null as any }
  } catch (error) {
    return { data: null as any, error }
  }
}

export async function fetchWorkersBasic() {
  return wrapFetch($fetch<WorkerDetailed[]>('/api/workers'))
}
export async function fetchWorkersDetailed() {
  return wrapFetch($fetch<WorkerDetailed[]>('/api/workers?detailed=true'))
}
export async function queryWorkerCreate(newWorkerData: Prisma.WorkerCreateInput) {
  return wrapFetch(
    $fetch<WorkerDetailed>('/api/workers', {
      method: 'POST',
      body: newWorkerData,
    })
  )
}

export async function createWorker(newWorkerData: Prisma.WorkerCreateInput) {
  const response = await queryWorkerCreate(newWorkerData)

  const { data, error } = response

  if (data) {
    workers.value.push(data)
  }
  if (error) {
    console.error(error)
    notifyError({ error, title: 'Error al crear trabajador' })
  }

  return response
}

export async function loadWorkers() {
  workersPending.value = true
  const response = await fetchWorkersDetailed()
  const { data, error } = response
  workersPending.value = false

  if (data) {
    workers.value = data
  }
  if (error) {
    console.error(error)
    notifyError({ error, title: 'Error al cargar trabajadores' })
  }

  return response
}

export async function updateWorker(
  id: string,
  updatedWorkerData: Prisma.WorkerUpdateInput
) {
  const response = await wrapFetch(
    $fetch<WorkerDetailed>(`/api/workers/${id}`, {
      method: 'PUT',
      body: updatedWorkerData,
    })
  )

  const { data, error } = response

  if (data) {
    const index = workers.value.findIndex((w) => w.id === id)
    if (index !== -1) {
      workers.value[index] = { ...workers.value[index], ...data }
    }
  }
  if (error) {
    console.error(error)
    notifyError({ error, title: 'Error al actualizar trabajador' })
  }

  return response
}

export async function deleteWorker(id: UUID) {
  const response = await wrapFetch(
    $fetch(`/api/workers/${id}`, { method: 'DELETE' })
  )

  if (response.error) {
    console.error(response.error)
    notifyError({ error: response.error, title: 'Error al eliminar trabajador' })
    return response
  }

  workers.value = workers.value.filter((worker) => worker.id !== id)
  return response
}

export async function getWorkerById(id: string) {
  const localWorker = workers.value.find((worker) => worker.id === id)
  if (localWorker) return localWorker

  const response = await wrapFetch(
    $fetch<WorkerDetailed>(`/api/workers/${id}`)
  )

  if (response.data) {
    workers.value.push(response.data)
    return response.data
  }

  if (response.error) {
    console.error('Error fetching worker by ID:', response.error)
  }
  return null
}

export async function getWorkerByRecordNumber(
  recordNumber: string
): Promise<WorkerDetailed | null> {
  const localWorker = workers.value.find(
    (worker) => worker.record_number === recordNumber
  )
  if (localWorker) return localWorker

  const response = await wrapFetch(
    $fetch<WorkerDetailed>(`/api/workers/by-record-number`, {
      params: { record_number: recordNumber },
    })
  )

  if (response.data) {
    workers.value.push(response.data)
    return response.data
  }

  if (response.error) {
    console.error('Error fetching worker by record number:', response.error)
  }
  return null
}

export async function getWorkerByUsername(username: string) {
  const localWorker = workers.value.find(
    (worker) => worker.email?.split('@')[0] === username
  )
  if (localWorker) return localWorker

  const response = await wrapFetch(
    $fetch<WorkerDetailed>(`/api/workers/by-username`, {
      params: { username },
    })
  )

  if (response.data) {
    workers.value.push(response.data)
    return response.data
  }

  if (response.error) {
    console.error('Error fetching worker by username:', response.error)
  }
  return null
}
