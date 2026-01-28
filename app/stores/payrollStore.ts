export const payroll = ref<PayrollInfo[]>([])

export const payrollPending = ref(false)
export interface PayrollInfo extends Tables<"payroll"> { }

export async function loadPayroll() {
  const supabase = useSupabaseClient() // funcion que devuelve el cliente de supabase

  payrollPending.value = true
  const response = await supabase.from("payroll").select("*");
  const { data, error } = response
  payrollPending.value = false //antes de buscar en la base de datos lo pone en true y después lo busca
  if (data) payroll.value = data;
  if (error) console.error(error);

  return response
}
