
export async function addGroup(group: TablesInsert<"groups">) {
  const supabase = useSupabaseClient()
  const { data, error } = await supabase
    .from("groups")
    .insert([group])
    .select();
  if (data) console.log(data);
  if (error) console.log(error);
}

export const workGroups = ref();

export async function loadGroups() {
  const supabase = useSupabaseClient()
  let { data, error } = await supabase.from("groups").select("*, workers!workers_group_id_fkey(*), leader:workers!groups_leader_id_fkey(*)");
  if (data) workGroups.value = data;
  if (error) console.log(error);
}
