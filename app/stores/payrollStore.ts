export type PayrollWithWorkers = PayrollInfo & {
  creator?: WorkerInfo | null
  reviewer?: WorkerInfo | null
}

export const payroll = ref<PayrollWithWorkers[]>([])

export const payrollPending = ref(false)
export interface PayrollInfo extends Tables<'payroll'> {}

async function wrapFetch<T>(promise: Promise<T>) {
  try {
    const data = await promise
    return { data, error: null as any }
  } catch (error) {
    return { data: null as any, error }
  }
}

export async function loadPayroll() {
  payrollPending.value = true
  const response = await wrapFetch($fetch<PayrollWithWorkers[]>('/api/payroll'))
  const { data, error } = response
  payrollPending.value = false
  if (data) payroll.value = data
  if (error) console.error(error)

  return response
}

export async function createPayroll(payload?: { month?: number; year?: number }) {
  const response = await wrapFetch(
    $fetch<PayrollWithWorkers>('/api/payroll', {
      method: 'POST',
      body: payload ?? {}
    })
  )

  const { data, error } = response
  if (data) {
    const existingIndex = payroll.value.findIndex((p) => p.id === data.id)
    if (existingIndex >= 0) {
      payroll.value[existingIndex] = data
    } else {
      payroll.value.unshift(data)
    }
  }
  if (error) console.error(error)

  return response
}
