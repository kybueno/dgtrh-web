export const payroll = ref<PayrollInfo[]>([])

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
  const response = await wrapFetch($fetch<PayrollInfo[]>('/api/payroll'))
  const { data, error } = response
  payrollPending.value = false
  if (data) payroll.value = data
  if (error) console.error(error)

  return response
}
