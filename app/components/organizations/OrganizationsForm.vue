<template>
  <div>
    <Card class="shadow-xl rounded-2xl p-6">
        <CardHeader>
          <CardDescription>Nueva Organización</CardDescription>
        </CardHeader>

        <CardContent>
          <form class="grid grid-cols-2 gap-4">
            
            <div class="flex flex-col gap-1">
              <label class="font-medium">Nombre:</label>
              <UInput placeholder="Introduzca el nombre de la nueva organización" v-model="formData.name" error="Please enter a valid name." />
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-medium">Descripción:</label>
              <UInput placeholder="Introduzca la descripción del cargo" v-model="formData.description" error="Please enter a valid description." />
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-medium">Código:</label>
              <UInput placeholder="Ejemplo de código: ctc" v-model="formData.code" error="Please enter a valid code." />
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-medium">Acronym:</label>
              <UInput placeholder="Introduzca el acrónimo de la organización" v-model="formData.acronym" error="Please enter a valid acronym." />
            </div>
          </form>
        </CardContent>
        <UButton @click="handleAddOrganization" color="primary">Guardar organización</UButton>
    </Card>
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
    toast.add({
      title: 'Guardado con éxito',
      icon: 'mdi:check'
    })
    navigateTo('/organizations')
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

