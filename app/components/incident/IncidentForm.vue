<script setup lang="ts">
import WorkerSelect from '~/components/worker/WorkerSelect.vue'
import { storeToRefs } from 'pinia'
import type { Prisma, Incident } from '~/prisma/generated/browser'

const props = defineProps<{
  incident?: Incident | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', payload: Prisma.IncidentCreateInput | Prisma.IncidentUpdateInput): void
  (e: 'cancel'): void
}>()

const incidentTypeStore = useIncidentTypeStore()
const { incidentTypes } = storeToRefs(incidentTypeStore)

const today = new Date().toISOString().split('T')[0]

function normalizeDate(value?: string | null) {
  return value ? value.split('T')[0] : today
}

const formData = ref<Prisma.IncidentCreateInput>({
  worker_id: props.incident?.worker_id || '',
  incident_code: (props.incident?.incident_code ?? null) as any,
  start_date: normalizeDate(props.incident?.start_date),
  end_date: props.incident?.end_date ? props.incident.end_date.split('T')[0] : '',
  description: props.incident?.description || '',
})

watchEffect(() => {
  if (!props.incident) return
  formData.value = {
    worker_id: props.incident.worker_id,
    incident_code: props.incident.incident_code as any,
    start_date: normalizeDate(props.incident.start_date),
    end_date: props.incident.end_date ? props.incident.end_date.split('T')[0] : '',
    description: props.incident.description || '',
  }
})

const incidentTypeOptions = computed(() =>
  incidentTypes.value.map((type) => ({
    value: type.code,
    label: `${type.code} - ${type.name}`,
  }))
)

function getIncidentError() {
  if (!formData.value.worker_id) return 'El trabajador es obligatorio.'
  if (formData.value.incident_code === null || formData.value.incident_code === undefined) {
    return 'El tipo de incidencia es obligatorio.'
  }
  if (!formData.value.start_date) return 'La fecha de inicio es obligatoria.'
  if (formData.value.end_date && formData.value.end_date < formData.value.start_date) {
    return 'La fecha de fin no puede ser anterior a la fecha de inicio.'
  }
  return null
}

function handleSubmit() {
  const error = getIncidentError()
  if (error) {
    notifyWarning({ title: 'Validación', description: error })
    return
  }
  emit('save', {
    ...formData.value,
    end_date: formData.value.end_date || null,
    description: formData.value.description || null,
  })
}

onMounted(() => {
  if (!incidentTypes.value.length) incidentTypeStore.loadIncidentTypes()
})
</script>

<template>
  <div class="flex flex-col w-fit max-w-2xl mx-auto justify-center">
    <FormCard
      icon="mdi:alert"
      :heading="props.incident ? 'Actualizar incidencia' : 'Nueva incidencia'"
      description="Complete los datos de la incidencia"
      :loading="loading"
      @done="handleSubmit"
      @cancel="emit('cancel')"
    >
      <div class="grid grid-cols-2 gap-4 p-2">
        <UFormField label="Trabajador *" class="col-span-2">
          <WorkerSelect v-model="formData.worker_id" required />
        </UFormField>

        <UFormField label="Tipo de incidencia *" class="col-span-2">
          <USelect
            v-model="formData.incident_code"
            :items="incidentTypeOptions"
            class="w-full"
            required
          />
        </UFormField>

        <UFormField label="Fecha de inicio *" class="col-span-1">
          <UInput v-model="formData.start_date" type="date" required />
        </UFormField>

        <UFormField label="Fecha de fin" class="col-span-1">
          <UInput v-model="formData.end_date" type="date" />
        </UFormField>

        <UFormField label="Descripción" class="col-span-2">
          <UTextarea v-model="formData.description" class="w-full" />
        </UFormField>
      </div>
      <template #actions>
        <UButton type="submit" color="primary" :loading="loading">
          {{ loading ? 'Guardando...' : props.incident ? 'Guardar cambios' : 'Crear incidencia' }}
        </UButton>
      </template>
    </FormCard>
  </div>
</template>
