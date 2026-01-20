export const holidays = ref<HolidaysInfo[]>([])

export const holidaysPending = ref(false)
export interface HolidaysInfo extends Tables<"holidays"> { }

export async function loadHolidays() {
  const supabase = useSupabaseClient() // funcion que devuelve el cliente de supabase

  holidaysPending.value = true
  const response = await supabase.from("holidays").select("*");
  const { data, error } = response
  holidaysPending.value = false //antes de buscar en la base de datos lo pone en true y después lo busca
  if (data) holidays.value = data;
  if (error) console.error(error);

  return response
}

export async function addHoliday(newHolidayData: TablesInsert<"holidays">) {
  const supabase = useSupabaseClient()

  const response = await supabase
    .from("holidays")
    .insert([newHolidayData])
    .select();

  const { data, error } = response;

  if (data) console.log(data);
  if (error) console.error(error);

  return response
}
