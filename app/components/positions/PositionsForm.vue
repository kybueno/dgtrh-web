<template>
  <div class="fw-full h-screen flex justify-center items-center">
        <h2 class="font-bold flex items-center">Nuevo Cargo</h2>
    
        <UForm class="grid grid-cols-2 gap-4">
         
          <UFormField label="Código:" name="code" >
            <UInput placeholder="Introduzca el código del nuevo cargo" v-model="formData.code" error="Please enter a valid code."/>
          </UFormField>

          <UFormField label="Descripción:" name="description" >
            <UInput placeholder="Introduzca la descripción del cargo" v-model="formData.description" error="Please enter a valid description."/>
           </UFormField>

          <UFormField label="Categoría:" name="category" >
            <UInput placeholder="Introduzca la categoría" v-model="formData.category" error="Please enter a valid category." />
           </UFormField>

        <UFormField label="Cantidad :" name="cant" >
           <UInput placeholder="Introduzca la cantidad de personas con ese cargo" v-model="formData.cant" error="Please enter a valid cant."/>
          </UFormField>

         <UFormField label="Nivel de estudio:" name="level" >
          <UInput placeholder="Introduzca el nivel" v-model="formData.level" error="Please enter a valid level." />
         </UFormField>

         <UFormField label="Grupo/Escala:" name="group_escale" >
          <UInput placeholder="Introduzca la escala a la que pertenece" v-model="formData.group_escale" error="Please enter a valid escale."/>
        </UFormField>
            <UButton @click="handleAddPosition" color="primary">Guardar posición</UButton>
        </UForm>
   

    


  </div>
</template>

<script lang="ts" setup>
import { positions } from '~/stores/positionStore';

const supabase = useSupabaseClient()
const toast = useToast()

const formData = ref<TablesInsert<"positions">>({
  code: 0,
  description: '',
  category: '',
  cant: 0,
  group_escale: '',
  level: '',
})

const pending = ref(false)
const errorMessage = ref<string | null>(null)
const description = ref('')
const code = ref('')



async function handleAddPosition() {
  const response = await addPosition(formData.value)
  pending.value = false

  if (response.data) {
    toast.add({
      title: 'Guardado con éxito',
      icon: 'mdi:check'
    })
    navigateTo('/positions')
  }
  if (response.error) {
    toast.add({
      title: 'Hubo un error al guardar',
      description: response.error.message,
      color: 'error',
      icon: 'mdi:error'
    })
    errorMessage.value = response.error.message
  }
}
</script>
