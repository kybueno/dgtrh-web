export const organizations = [
  {
    "code": "CTC",
    "name": "CTC",
    "acronym": "CTC",
    "description": "Central de Trabajadores de Cuba"
  },
  {
    "code": "UJC",
    "name": "UJC",
    "acronym": "UJC",
    "description": "Unión de Jóvenes Comunistas de Cuba"
  },
  {
    "code": "CDR",
    "name": "CDR",
    "acronym": "CDR",
    "description": "Comités de Defensas de la Revolución"
  },
  {
    "code": "PCC",
    "name": "PCC",
    "acronym": "PCC",
    "description": "Partido Comunista de Cuba"
  }
]

 export const organizationsPending = ref(false)
    export interface OrganizationInfo extends Tables<"organizations"> {}

    export async function loadOrganizations() {
      const supabase = useSupabaseClient() // funcion que devuelve el cliente de supabase
      
       organizationsPending.value = true
        const response = await supabase.from("organizations").select("*");
        const {data,error} = response
        organizationsPending.value = false //antes de buscar en la base de datos lo pone en true y después lo busca
        if (data) organizations.value = data;
        if (error) console.error(error);
      
        return response
    }

      export async function addOrganizations(organization: TablesInsert<"organizations">) {
          const supabase = useSupabaseClient()
        
          const response = await supabase
            .from("organizations")
            .insert([organization])
            .select();
        
          const { data, error } = response;
        
          if (data) console.log(data);
          if (error) console.error(error);
        
          return response
        }
    
        export async function deleteOrganization(id: number) {
          const supabase = useSupabaseClient()
        
          const { error } = await supabase.from("organizations").delete().eq('id', id)
          if (error) console.error(error)
          
          return error
        }
    
        export function getOrganizationById(code:number){
        return positions.value.find(position => position.code===code)
        }
