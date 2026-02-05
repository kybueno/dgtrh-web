<template>
  <div>
    <h2 class="font-bold flex items-center">{{ isEdit ? 'Editar Organización' : 'Nueva Organización' }}</h2>

    <UForm class="grid grid-cols-2 gap-4">
      <UFormField label="Nombre:">
        <UInput placeholder="Introduzca el nombre de la organización" v-model="formData.name"
          error="Please enter a valid name." />
      </UFormField>

      <UFormField label="Descripción:">
        <UInput placeholder="Introduzca la descripción" v-model="formData.description"
          error="Please enter a valid description." />
      </UFormField>

      <UFormField label="Código:">
        <UInput placeholder="Ejemplo de código: ctc" v-model="formData.code" error="Please enter a valid code." />
      </UFormField>

      <UFormField label="Abreviatura:">
        <UInput placeholder="Introduzca el acrónimo de la organización" v-model="formData.acronym"
          error="Please enter a valid acronym." />
      </UFormField>

      <UFormField label="URL de la imagen:">
        <div class="flex items-center gap-3">
          <UAvatar
            size="lg"
            :src="formData.img || undefined"
            :alt="formData.acronym || formData.name || undefined"
          />
          <UInput class="flex-1" placeholder="https://..." v-model="formData.img" />
        </div>
      </UFormField>

      <div class="col-span-2 flex items-center gap-2">
        <UButton @click="handleSubmit" color="primary">{{ isEdit ? 'Guardar cambios' : 'Guardar organización' }}</UButton>
        <UButton variant="ghost" color="neutral" @click="useRouter().back()">Cancelar</UButton>
      </div>
    </UForm>
  </div>
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

async function handleSubmit() {
  if (pending.value) return
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
