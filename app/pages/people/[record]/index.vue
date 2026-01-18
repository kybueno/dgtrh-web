<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-xl font-bold mb-6 text-center">
      Detalles del Trabajador
    </h1>

    <UCard v-if="loading && !worker">
      <template #header>
        <Flex class="gap-4 mx-4 my-2">
          <USkeleton class="size-10 rounded-full" />
          <div class="space-y-2 flex-1">
            <USkeleton class="h-3 w-1/2" />
            <USkeleton class="h-2 w-1/4" />
          </div>
        </Flex>
      </template>
      <Grid class="grid-cols-2 gap-4 p-4">
        <DescriptionListItem v-for="i in 12" loading />
      </Grid>
    </UCard>

    <UCard v-else-if="worker">
      <template #header>
        <Flex class="p-4 flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- TODO: Add a simple skeleton for the header when the old UCard skeleton above is removed -->
          <Flex class="items-center gap-3">
            <UAvatar :text="displayInitials" size="lg" />
            <div>
              <h2 class="text-xl font-semibold leading-tight">{{ getProfileDisplayName(worker) }}</h2>
              <Flex class="gap-2 mt-1">
                <UBadge :color="statusColor" variant="subtle" size="xs" class="inline-flex items-center gap-1">
                  {{ statusLabel }}
                </UBadge>
                <span class="text-xs text-muted">Expediente #{{ worker.record_number }}</span>
              </Flex>
            </div>
          </Flex>
          <HStack class="flex gap-2 md:justify-end">
            <UButton size="xs" :to="`/people/${worker.record_number}/edit`" variant="subtle">Editar</UButton>
            <UButton size="xs" @click="handleDelete()" color="error"  variant="subtle" >Eliminar</UButton>
          </HStack>
        </Flex>
      </template>

      <Box class="space-y-8 p-4">
        <CardSection title="Información Personal">
          <DescriptionList>
            <DescriptionListItem label="Nombre" :value="displayName" />
            <DescriptionListItem label="CI" :value="worker.ci || '—'" />
            <DescriptionListItem label="Género" :value="getGenderLabel(worker.gender as GenderValue)" />
            <DescriptionListItem label="Nivel de preparación" :value="worker.level || '—'" />
          </DescriptionList>
        </CardSection>

        <CardSection title="Contacto">
          <DescriptionList>
            <DescriptionListItem label="Email" :value="worker.email || '—'" />
            <DescriptionListItem label="Teléfono" :value="worker.tel || '—'" />
            <DescriptionListItem label="Dirección" :full="true" :value="worker.address || '—'" />
          </DescriptionList>
        </CardSection>

        <CardSection title="Información Laboral">
          <DescriptionList>
            <DescriptionListItem label="Fecha de inicio" :value="formattedStartDate" />
            <DescriptionListItem label="Grupo de trabajo" :value="worker.group_id || '—'" />
            <DescriptionListItem label="Cargo" :value="worker.position_code || '—'" />
            <DescriptionListItem label="Organizaciones"
              :value="worker.organizations_codes.join(', ').toUpperCase() || '—'" />
          </DescriptionList>
        </CardSection>

        <CardSection title="Familia">
          <DescriptionList>
            <DescriptionListItem label="Padre" :value="worker.parent1_name || '—'" />
            <DescriptionListItem label="Madre" :value="worker.parent2_name || '—'" />
          </DescriptionList>
        </CardSection>

        <UAlert v-if="errorMessage" variant="subtle" color="error" title="Error" :description="errorMessage">Error: {{
          errorMessage }}</UAlert>
      </Box>
    </UCard>

    <p v-else class="text-center text-muted mt-20">
      Trabajador no encontrado.
    </p>
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
    if (!workers.value.length) await loadWorkers();
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
