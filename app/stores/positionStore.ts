export const positions = ref([
    {
        "cantidad": 1,
        "descripcion": "SubDirector",
        "code": 32,
        "escala": "XXIII",
        "nivel_preparacion": "Nivel Superior",
        "categoria_ocupacional": "C"
      },
      {
        "cantidad": 4,
        "descripcion": "Técnico \"A\" en Gestión Económica",
        "code": 6206,
        "escala": "XI",
        "nivel_preparacion": "Nivel Superior",
        "categoria_ocupacional": "T"
      },
      {
        "cantidad": 1,
        "descripcion": "Técnico \"A\" en Gestión de R.H",
        "code": 6330,
        "escala": "XI",
        "nivel_preparacion": "Nivel Medio Superior",
        "categoria_ocupacional": "T"
      },
      {
        "cantidad": 19,
        "descripcion": "Técnico en Ciencias Informáticas",
        "code": 6367,
        "escala": "XI",
        "nivel_preparacion": "Técnico Medio",
        "categoria_ocupacional": "T"
      },
      {
        "cantidad": 1,
        "descripcion": "Asistente de Control",
        "code": 6588,
        "escala": "IX",
        "nivel_preparacion": "Nivel Medio Superior",
        "categoria_ocupacional": "T"
      },
      {
        "cantidad": 5,
        "descripcion": "Especialista Superior",
        "code": 6997,
        "escala": "XVII",
        "nivel_preparacion": "Nivel Superior",
        "categoria_ocupacional": "T"
      },
      {
        "cantidad": 7,
        "descripcion": "Especialista General",
        "code": 6998,
        "escala": "XVI",
        "nivel_preparacion": "Nivel Superior",
        "categoria_ocupacional": "T"
      },
      {
        "cantidad": 34,
        "descripcion": "Técnico General",
        "code": 6999,
        "escala": "XI",
        "nivel_preparacion": "Técnico Medio",
        "categoria_ocupacional": "T"
      }
    ])

    export const positionsPending = ref(false)
    export interface PositionInfo extends Tables<"positions"> {}

    export async function loadPositions() {
      const supabase = useSupabaseClient() // funcion que devuelve el cliente de supabase
      
       positionsPending.value = true
        const response = await supabase.from("positions").select("*");
        const {data,error} = response
        positionsPending.value = false //antes de buscar en la base de datos lo pone en true y después lo busca
        if (data) positions.value = data;
        if (error) console.error(error);
      
        return response
    }

    export async function addPositions(position: TablesInsert<"positions">) {
      const supabase = useSupabaseClient()
    
      const response = await supabase
        .from("positions")
        .insert([position])
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

    export function getPositionById(code:number){
    return positions.value.find(position => position.code===code)
    }
   
   