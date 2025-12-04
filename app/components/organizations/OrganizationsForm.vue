<template>
  <div>
    
          <h2 class="font-bold flex items-center">Nueva Organización</h2>
      
         
          <UForm  class="grid grid-cols-2 gap-4">
            <UFormField label="Nombre:" >
              <UInput placeholder="Introduzca el nombre de la nueva organización" v-model="formData.name" error="Please enter a valid name." />
            </UFormField>

            <UFormField label="Descripción:" >
             <UInput placeholder="Introduzca la descripción del cargo" v-model="formData.description" error="Please enter a valid description."/>
            </UFormField>

            <UFormField label="Código:" >
              <UInput placeholder="Ejemplo de código: ctc" v-model="formData.code" error="Please enter a valid code." />
            </UFormField>

            <UFormField label="Abreviatura:" >
              <UInput placeholder="Introduzca el acrónimo de la organización" v-model="formData.acronym" error="Please enter a valid acronym." />
            </UFormField>
        
        <UButton @click="handleAddOrganization" color="primary">Guardar organización</UButton>
      </UForm>
  </div>
</template>

<script lang="ts" setup>
const formData = ref<TablesInsert<"organizations">>({
  name:"",
  code:"",
  description:"",
  acronym:"",
})

const pending = ref(false)
const errorMessage = ref<string | null>(null)
const description = ref('')
const code = ref('')

const toast = useToast()

async function handleAddOrganization() {
  const response = await addOrganization(formData.value)
  pending.value = false

  if (response.data) {
    notifySuccess({title: 'Guardado con éxito' })
    useRouter().back()
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

