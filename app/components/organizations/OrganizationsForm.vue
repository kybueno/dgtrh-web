<template>
  <UForm>
    <UCard class="max-w-3xl mx-auto">
      <template #header>
        <h2 class="font-bold flex items-center">{{ isEdit ? 'Editar Organización' : 'Nueva Organización' }}</h2>
      </template>

      <Stack class="p-4 gap-4">
        <Grid class="gap-2 grid-cols-2">
          <UFormField label="Nombre" :error="formData.name && nameError ? nameError : undefined">
            <UInput placeholder="Introduzca el nombre de la organización" v-model="formData.name" required />
          </UFormField>
          <UFormField label="Acrónimo" :error="formData.acronym && acronymError ? acronymError : undefined">
            <UInput placeholder="Ejemplo de acrónimo: CTC" :model-value="formData.acronym"
              @update:model-value="(value) => (formData.acronym = sanitizeAcronym(value || ''))" pattern="[A-Z]+"
              autocomplete="off" />
          </UFormField>
          <UFormField label="Código" :error="formData.code && codeError ? codeError : undefined">
            <UInput :placeholder="`Ejemplo de código: ${formData?.acronym ? formData.acronym?.toLowerCase() : 'ctc'}`"
              :model-value="formData.code"
              @update:model-value="(value) => (formData.code = sanitizeOrgCode(value || ''))" pattern="[a-z]+"
              autocomplete="off" />
          </UFormField>
        </Grid>
        <Separator class="my-2">Opcionales</Separator>
        <stack-h>
          <UFormField label="Descripción">
            <UTextarea class="w-ful" placeholder="Introduzca la descripción" v-model="formData.description" />
          </UFormField>
            <UFormField label="URL de la imagen" :error="formData.img && imgError ? imgError : undefined">
              <div class="flex items-center gap-3">
                <UAvatar size="lg" :src="formData.img || undefined"
                  :alt="formData.name?.toUpperCase() || formData.acronym || undefined" />
                <UInput class="flex-1" placeholder="https://..." v-model="formData.img" />
              </div>
            </UFormField>
        </stack-h>
      </Stack>

      <template #footer>
        <stack-h class="justify-end">
          <UButton variant="ghost" color="neutral" @click="useRouter().back()">Cancelar</UButton>
          <UButton @click="handleSubmit" variant="subtle" color="primary">
            {{ isEdit ? 'Guardar cambios' : 'Guardar organización' }}
          </UButton>
        </stack-h>
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

function sanitizeAcronym(value: string) {
  return value.toUpperCase().replace(/[^A-Z]/g, "")
}

const nameError = computed(() => {
  if (!formData.value.name) return "El nombre es obligatorio."
  return null
})

const codeError = computed(() => {
  if (!formData.value.code) return "Please enter a valid code."
  if (!/^[a-z]+$/.test(formData.value.code)) return "El código solo puede tener letras minúsculas a-z."
  return null
})

const acronymError = computed(() => {
  if (!formData.value.acronym) return null
  if (!/^[A-Z]+$/.test(formData.value.acronym)) return "El acrónimo solo puede tener letras mayúsculas A-Z."
  return null
})

function isValidUrl(value: string) {
  if (!value) return true
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

const imgError = computed(() => {
  if (!formData.value.img) return null
  if (!isValidUrl(formData.value.img)) return "La URL de la imagen no es válida."
  return null
})

async function handleSubmit() {
  if (pending.value) return

  const currentNameError = nameError.value
  const currentCodeError = codeError.value
  const currentAcronymError = acronymError.value
  const currentImgError = imgError.value

  const firstError = currentNameError || currentCodeError || currentAcronymError || currentImgError
  if (firstError) {
    toast.add({
      title: 'Validación',
      description: firstError,
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
