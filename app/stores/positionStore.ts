export const positions = ref<PositionInfo[]>([])

export const positionsPending = ref(false)
export interface PositionInfo extends Tables<"positions"> { }

export async function loadPositions() {
  const supabase = useSupabaseClient() // funcion que devuelve el cliente de supabase

  positionsPending.value = true
  const response = await supabase.from("positions").select("*");
  const { data, error } = response
  positionsPending.value = false //antes de buscar en la base de datos lo pone en true y después lo busca
  if (data) positions.value = data;
  if (error) console.error(error);

  return response
}

export async function addPosition(newPositionData: TablesInsert<"positions">) {
  const supabase = useSupabaseClient()

  const response = await supabase
    .from("positions")
    .insert([newPositionData])
    .select();

  const { data, error } = response;

  if (data) console.log(data);
  if (error) console.error(error);

  return response
}

export async function deletePosition(id: number) {
  const supabase = useSupabaseClient()

  const { error } = await supabase.from("positions").delete().eq('id', id)
  if (error) console.error(error)

  return error
}

export function getPositionById(code: number) {
  return positions.value.find(position => position.code === code)
}

