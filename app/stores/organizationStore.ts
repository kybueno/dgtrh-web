export const organizations = ref<OrganizationInfo[]>([])

export const organizationsPending = ref<boolean>(false)


// CREATE
export async function addOrganization(newOrganizationData: TablesInsert<"organizations">) {
  const supabase = useSupabaseClient()
  const response = await supabase
    .from("organizations")
    .insert([newOrganizationData])
    .select();

  const { data, error } = response;

  if (data && data[0]) {
    organizations.value.push(data[0]) //If the organization was created successfully, add the new one to the reactive list to show it to the user.
  }
  if (error) console.error(error);

  return response
}

//READ
export async function loadOrganizations() {
  const supabase = useSupabaseClient() // funcion que devuelve el cliente de supabase, el cual guardo en una constante llamada supabase para mi conveniencia

  organizationsPending.value = true //Establecer que la operación está pendiente.

  const response = await supabase.from("organizations").select("*"); // Esperar a que se haga la operación de obtener todas las organizaciones de la BD

  const { data, error } = response //Sacar (Desestructurar) los datos de la response para no tener que escribir response.data y response.error más adelante

  organizationsPending.value = false //:) Establecer que la operación ya no está pendiente

  if (data) organizations.value = data; 
  if (error){
    console.error(error);
    notifyError({error,title:"Error al cargar organizaciones"})
  } //Si hubo un error, mostarlo en la consola.

  return response //devolver la response completa por si es necesario usarla en algún componente que llame a esta función.
}

//UPDATE
export async function updateOrganization(existingOrganizationData: TablesUpdate<"organizations">) {
  const supabase = useSupabaseClient()
  const response = await supabase
    .from("organizations")
    .update([existingOrganizationData])
    .select();

  const { data, error } = response;

  if (data && data[0]) {
    loadOrganizations() //:) If the organization was updated successfully, load all organizations again to refresh the list for the user.
  }
  if (error) console.error(error);

  return response
}

// DELETE
export async function deleteOrganization(id: number) {
  const supabase = useSupabaseClient()

  const { error } = await supabase.from("organizations").delete().eq('id', id)
  if (error) console.error(error)
  else loadOrganizations() //:) If the organization was deleted successfully, load all organizations again to refresh the list for the user.
  return error
}

export function getOrganizationById(code: number) {
  return positions.value.find(position => position.code === code)
}
