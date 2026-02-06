<template>
  <UForm class="grid grid-cols-2 gap-4">
    <UCard class="max-w-3xl mx-auto">
      <template #header>
        <h2 class="font-bold flex items-center">{{ isEdit ? 'Editar Organización' : 'Nueva Organización' }}</h2>
      </template>

      <div class="p-4">
        <UFormField label="Nombre:">
          <UInput placeholder="Introduzca el nombre de la organización" v-model="formData.name"
            error="Por favor ingrese un nombre válido." />
        </UFormField>
        <UFormField label="Descripción:">
          <UTextarea placeholder="Introduzca la descripción" v-model="formData.description" />
        </UFormField>
        <UFormField label="Código:" :error="codeError || undefined">
          <UInput placeholder="Ejemplo de código: ctc" :model-value="formData.code"
            @update:model-value="(value) => (formData.code = sanitizeOrgCode(value || ''))"
            pattern="[a-z]+" autocomplete="off" />
        </UFormField>
        <UFormField label="Abreviatura:">
          <UInput placeholder="Introduzca el acrónimo de la organización" v-model="formData.acronym"
            error="Por favor ingrese un acrónimo válido." />
        </UFormField>
        <UFormField label="URL de la imagen:">
          <div class="flex items-center gap-3">
            <UAvatar size="lg" :src="formData.img || undefined" :alt="formData.acronym || formData.name || undefined" />
            <UInput class="flex-1" placeholder="https://..." v-model="formData.img" />
          </div>
        </UFormField>
      </div>

      <template #footer>
        <h-stack class="justify-end">
          <UButton variant="ghost" color="neutral" @click="useRouter().back()">Cancelar</UButton>
          <UButton @click="handleSubmit" variant="subtle" color="primary">{{ isEdit ? 'Guardar cambios' : 'Guardar organización' }}
          </UButton>
        </h-stack>
      </template>
    </UCard>
  </UForm>
</template>

<script lang="ts" setup>
interface Props {
  organization?: OrganizationInfo | null
}

const props = defineProps<Props>()

const isEdit = computed(() => !!props.organization)

const formData = ref<TablesInsert<"organizations">>({
  name: "",
  code: "",
  description: "",
  acronym: "",
  img: "",
})

watchEffect(() => {
  if (!props.organization) return
  formData.value = {
    name: props.organization.name || "",
    code: props.organization.code || "",
    description: props.organization.description || "",
    acronym: props.organization.acronym || "",
    img: props.organization.img || "",
  }
})

const pending = ref(false)
const errorMessage = ref<string | null>(null)

const toast = useToast()

function sanitizeOrgCode(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, "")
}

const codeError = computed(() => {
  if (!formData.value.code) return "Please enter a valid code."
  if (!/^[a-z]+$/.test(formData.value.code)) return "El código solo puede tener letras minúsculas a-z."
  return null
})

async function handleSubmit() {
  if (pending.value) return

  const currentCodeError = codeError.value
  if (currentCodeError) {
    toast.add({
      title: 'Código inválido',
      description: currentCodeError,
      color: 'warning',
      icon: 'mdi:warning',
    })
    return
  }

  pending.value = true

  const response = isEdit.value
    ? await updateOrganization({ id: props.organization!.id, ...formData.value })
    : await addOrganization(formData.value)

  pending.value = false

  if (response.data) {
    notifySuccess({ title: 'Guardado con éxito' })
    useRouter().back()
  }
  if (response.error) {
    toast.add({
      title: 'Hubo un error al guardar',
      description: response.error.message,
      color: 'error',
      icon: 'mdi:error',
    })
    errorMessage.value = response.error.message
  }
}
</script>
