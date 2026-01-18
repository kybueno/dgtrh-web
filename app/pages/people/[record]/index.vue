<template>
   <div class="max-w-5xl mx-auto p-6">
        <h1 class="text-xl font-bold mb-6 text-center">
            Detalles del Trabajador
        </h1>

        <UCard v-if="loading">
          <template #header>
            <USkeleton class="h-6 w-1/3" />
          </template>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <USkeleton class="h-4 w-1/2" />
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-5/6" />
              <USkeleton class="h-4 w-2/3" />
            </div>
            <div class="space-y-3">
              <USkeleton class="h-4 w-1/2" />
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-5/6" />
              <USkeleton class="h-4 w-2/3" />
            </div>
          </div>
        </UCard>

        <UCard v-else-if="worker">
          <template #header>
            <div class="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div class="flex items-center gap-3">
                <UAvatar :text="displayInitials" size="lg" />
                <div>
                  <h2 class="text-xl font-semibold leading-tight">{{ displayName }}</h2>
                  <div class="flex items-center gap-2 mt-1">
                    <UBadge :color="statusColor" variant="subtle" size="xs" class="inline-flex items-center gap-1">
                      <CheckCircle v-if="worker.status === 'active'" class="inline w-3.5 h-3.5" />
                      <XCircle v-else class="inline w-3.5 h-3.5" />
                      {{ statusLabel }}
                    </UBadge>
                    <span class="text-xs text-muted">Expediente #{{ worker.record_number }}</span>
                  </div>
                </div>
              </div>
              <div class="flex gap-2 md:justify-end">
                <UButton :to="`/people/${worker.record_number}/edit`">Editar</UButton>
                <UButton @click="handleDelete()" variant="subtle" color="error">Eliminar</UButton>
              </div>
            </div>
          </template>

          <div class="space-y-8 p-4">
            <section>
              <h3 class="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Información Personal</h3>
              <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <div>
                  <dt class="text-sm text-muted">Nombre</dt>
                  <dd class="text-sm font-medium">{{ displayName }}</dd>
                </div>
                <div>
                  <dt class="text-sm text-muted">CI</dt>
                  <dd class="text-sm font-medium">{{ worker.ci || '—' }}</dd>
                </div>
                <div>
                  <dt class="text-sm text-muted">Género</dt>
                  <dd class="text-sm font-medium">{{ getGenderLabel(worker.gender as GenderValue) }}</dd>
                </div>
                <div>
                  <dt class="text-sm text-muted">Nivel de preparación</dt>
                  <dd class="text-sm font-medium">{{ worker.level || '—' }}</dd>
                </div>
              </dl>
            </section>

            <section>
              <h3 class="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Contacto</h3>
              <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <div>
                  <dt class="text-sm text-muted">Email</dt>
                  <dd class="text-sm font-medium">{{ worker.email || '—' }}</dd>
                </div>
                <div>
                  <dt class="text-sm text-muted">Teléfono</dt>
                  <dd class="text-sm font-medium">{{ worker.tel || '—' }}</dd>
                </div>
                <div class="md:col-span-2">
                  <dt class="text-sm text-muted">Dirección</dt>
                  <dd class="text-sm font-medium">{{ worker.address || '—' }}</dd>
                </div>
              </dl>
            </section>

            <section>
              <h3 class="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Información Laboral</h3>
              <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <div>
                  <dt class="text-sm text-muted">Fecha de inicio</dt>
                  <dd class="text-sm font-medium">{{ formattedStartDate }}</dd>
                </div>
                <div>
                  <dt class="text-sm text-muted">Grupo de trabajo</dt>
                  <dd class="text-sm font-medium">{{ worker.group_id || '—' }}</dd>
                </div>
                <div>
                  <dt class="text-sm text-muted">Cargo</dt>
                  <dd class="text-sm font-medium">{{ worker.position_code || '—' }}</dd>
                </div>
                <div>
                  <dt class="text-sm text-muted">Organizaciones</dt>
                  <dd class="text-sm font-medium">{{ worker.organizations_codes || '—' }}</dd>
                </div>
              </dl>
            </section>

            <section>
              <h3 class="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Familia</h3>
              <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <div>
                  <dt class="text-sm text-muted">Padre</dt>
                  <dd class="text-sm font-medium">{{ worker.parent1_name || '—' }}</dd>
                </div>
                <div>
                  <dt class="text-sm text-muted">Madre</dt>
                  <dd class="text-sm font-medium">{{ worker.parent2_name || '—' }}</dd>
                </div>
              </dl>
            </section>

            <UAlert v-if="errorMessage" variant="subtle" color="error" title="Error" :description="errorMessage">Error: {{ errorMessage }}</UAlert>
          </div>
        </UCard>

        <div v-else class="text-center text-muted mt-20">
          Trabajador no encontrado.
        </div>
    </div> 
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Detalles del Trabajador'
})
useHead({
  title: 'Detalles del Trabajador'
})

const route = useRoute()
const recordNumber = computed(() => Array.isArray(route?.params.record) ? route?.params.record[0] : route?.params.record);

const worker = ref<WorkerInfo | null>(null);
const errorMessage = ref<string>('')
const loading = ref<boolean>(true)

const displayName = computed(() => {
  if (!worker.value) return ''
  const parts = [worker.value.first_name, worker.value.middle_name, worker.value.last_name, worker.value.second_last_name]
    .filter(Boolean)
  return parts.join(' ')
})

const displayInitials = computed(() => {
  if (!worker.value) return ''
  const parts = [worker.value.first_name, worker.value.last_name].filter(Boolean)
  return parts.map(p => p?.[0]?.toUpperCase() || '').join('')
})

const statusLabel = computed(() => {
  if (!worker.value?.status) return '—'
  return worker.value.status === 'active' ? 'Activo' : worker.value.status === 'terminated' ? 'Baja' : worker.value.status
})

const statusColor = computed(() => {
  if (worker.value?.status === 'active') return 'success'
  if (worker.value?.status === 'terminated') return 'error'
  return 'neutral'
})

const formattedStartDate = computed(() => {
  if (!worker.value?.created_at) return '—'
  const d = new Date(worker.value.created_at as unknown as string)
  if (isNaN(d.getTime())) return worker.value.created_at as unknown as string
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: '2-digit' })
})

const loadWorkerData = async () => {
  try {
    if(!workers.value.length) await loadWorkers();
    if (recordNumber.value) worker.value = await getWorkerByRecordNumber(recordNumber.value) || null;
  } catch (e: any) {
    errorMessage.value = e?.message || 'Error al cargar los datos'
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
    if (!worker.value?.id || !confirm("Seguro de que desea eliminar permanentemente el registro #" + recordNumber + "?")) return

    const response = await deleteWorker(worker.value.id)
    errorMessage.value = response.error?.details || ''
}

onMounted(loadWorkerData);
</script>
