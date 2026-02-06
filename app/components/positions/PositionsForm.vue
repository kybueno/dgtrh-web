<template>
  <div class="fw-full h-screen flex justify-center items-center">
    <h2 class="font-bold flex items-center">Nuevo Cargo</h2>

    <div class="grid grid-cols-2 gap-4">

      <UFormField label="Código" name="code">
        <UInput placeholder="Introduzca el código del nuevo cargo" v-model="formData.code"
          error="Please enter a valid code." type="number" inputmode="numeric" required />
      </UFormField>

      <UFormField label="Descripción" name="description">
        <UInput placeholder="Introduzca la descripción del cargo" v-model="formData.description"
          error="Please enter a valid description." />
      </UFormField>

      <UFormField label="Categoría" name="category">
        <UInput placeholder="Introduzca la categoría" v-model="formData.category"
          error="Please enter a valid category." required />
      </UFormField>

      <UFormField label="Nivel de estudio" name="level">
        <UInput placeholder="Introduzca el nivel" v-model="formData.level" error="Please enter a valid level."
          required />
      </UFormField>

      <UFormField label="Grupo" name="group_escale">
        <UInput placeholder="Introduzca la escala a la que pertenece" v-model="formData.group_escale"
          error="Please enter a valid escale." required />
      </UFormField>
      <UFormField label="Total" name="total">
        <UInput placeholder="Introduzca el monto salarial" v-model="formData.total" />
      </UFormField>
      <UFormField label="Escala" name="scale">
        <UInput placeholder="Introduzca el monto salarial de acuerdo a su escala" v-model="formData.scale"/>
      </UFormField>
      <UButton @click="() => handleAddPosition()" color="primary">Guardar posición</UButton>
    </div>





  </div>
</template>

<script setup lang="ts">

const formData = ref<TablesInsert<"positions">>({
  code: 0,
  description: '',
  category: '',
  group_escale: '',
  level: '',
})

const pending = ref(false)
const errorMessage = ref<string | null>(null)

function getPositionError() {
  if (formData.value.code === null || formData.value.code === undefined || Number.isNaN(formData.value.code)) {
    return 'El código es obligatorio.'
  }
  if (!formData.value.category) return 'La categoría es obligatoria.'
  if (!formData.value.level) return 'El nivel es obligatorio.'
  if (!formData.value.group_escale) return 'El grupo es obligatorio.'
  return null
}

async function handleAddPosition() {
  const validationError = getPositionError()
  if (validationError) {
    notifyWarning({ title: 'Validación', description: validationError })
    return
  }
  pending.value = true
  const response = await addPosition(formData.value)
  pending.value = false
  const { error, data } = response

  if (data) {
    notifySuccess({ title: 'Guardado con éxito' })
    useRouter().back() //navegar a la página anterior
  }
  if (error) {
    notifyError({ title: 'Hubo un error al guardar', error })
    errorMessage.value = response.error.message
  }
}
</script>
