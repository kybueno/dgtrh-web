
// tipo que define la info del grupo, su ljefe y miembros en un mismo objeto
export interface WorkGroupInfo extends Tables<"groups"> {leader: WorkerInfo, workers:WorkerInfo[]}

export const workGroups = ref<WorkGroupInfo[]>([]);
export const groupsPending = ref(false)



export async function addGroup(newWorkGroupData: TablesInsert<"groups">) {
  const supabase = useSupabaseClient()

  const response = await supabase
    .from("groups")
    .insert([newWorkGroupData])
    .select();

  const { data, error } = response;

  if (data) console.log(data);
  if (error) console.error(error);

  return response
}


export async function loadGroups() {
  const supabase = useSupabaseClient()
  groupsPending.value = true
  const response = await supabase.from("groups").select("*, workers!workers_group_id_fkey(*), leader:workers!groups_leader_id_fkey(*)"); //obtiene todos los grupos con su jefe y miembros
  const {data,error} = response
  groupsPending.value = false
  if (data) workGroups.value = data as WorkGroupInfo[];
  if (error) console.error(error);

  return response
}

export async function deleteGroup(id: number) {
  const supabase = useSupabaseClient()

  const { error } = await supabase.from("groups").delete().eq('id', id)
  if (error) console.error(error)
  
  return error
}

export function getGroupById(id:number){
return workGroups.value.find(group => group.id===id)
}