async function wrapFetch<T>(promise: Promise<T>) {
  try {
    const data = await promise
    return { data, error: null as any }
  } catch (error) {
    return { data: null as any, error }
  }
}

export async function createExtraWork(newExtraWorkData: TablesInsert<'extra_work'>) {
  const response = await wrapFetch(
    $fetch('/api/extra-work', {
      method: 'POST',
      body: newExtraWorkData,
    })
  )

  if (response.error) {
    console.error(response.error)
    notifyError({ error: response.error, title: 'Error al crear trabajo extraordinario' })
  }

  return response
}

export async function loadExtraWorks() {
  return wrapFetch($fetch('/api/extra-work'))
}

export async function loadExtraWorksByWorkerId(workerId: string) {
  return wrapFetch(
    $fetch('/api/extra-work', {
      params: { worker_id: workerId },
    })
  )
}

export async function updateExtraWork(updatedExtraWorkData: TablesUpdate<'extra_work'>) {
  const response = await wrapFetch(
    $fetch(`/api/extra-work/${updatedExtraWorkData.id}`, {
      method: 'PUT',
      body: updatedExtraWorkData,
    })
  )

  if (response.error) {
    console.error(response.error)
    notifyError({ error: response.error, title: 'Error al actualizar trabajo extraordinario' })
  }

  return response
}

export async function deleteExtraWork(id: UUID) {
  const response = await wrapFetch(
    $fetch(`/api/extra-work/${id}`, { method: 'DELETE' })
  )

  if (response.error) {
    console.error(response.error)
    notifyError({ error: response.error, title: 'Error al eliminar trabajo extraordinario' })
    return { error: response.error }
  }

  return { error: null }
}

export async function getExtraWorkById(id: string) {
  const response = await wrapFetch($fetch(`/api/extra-work/${id}`))

  if (response.error) {
    console.error('Error fetching extra_work by ID:', response.error)
    return null
  }

  return response.data
}
