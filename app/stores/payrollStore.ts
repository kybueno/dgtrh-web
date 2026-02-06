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
