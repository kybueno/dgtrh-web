<script setup lang="ts">
import { printCertificadoModel } from './certificadoPdf'
import { useWorkerStore } from '~/stores/workerStore'

const pageTitle = 'Modelo de Certificado'
definePageMeta({
  title: pageTitle
})
useHead({
  title: pageTitle
})

const workerStore = useWorkerStore()
const selectedWorkerId = ref<string | null>(null)
const loadingWorkers = ref(false)

const selectedWorker = computed(() =>
  workerStore.workers.find((worker) => worker.id === selectedWorkerId.value) || null
)
const selectedArea = computed(() =>
  selectedWorker.value?.group?.name ||
  selectedWorker.value?.leaderAtGroup?.name ||
  'Dirección de Gestión Tecnológica'
)

async function loadWorkers() {
  loadingWorkers.value = true
  await workerStore.loadWorkers()
  loadingWorkers.value = false
}

function handlePrintBlank() {
  printCertificadoModel()
}

function handlePrintFilled() {
  if (!selectedWorker.value) return
  printCertificadoModel(selectedWorker.value)
}

onMounted(loadWorkers)
</script>

<template>
  <Stack class="flex-col gap-4 p-4">
    <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      <div />
      <h3 class="text-base font-semibold text-center tracking-wide">{{ pageTitle.toUpperCase() }}</h3>
      <div class="flex justify-end gap-2">
        <UButton variant="subtle" icon="lucide:printer" @click="handlePrintBlank">Imprimir en blanco</UButton>
        <UButton
          variant="solid"
          icon="lucide:file-check"
          :disabled="!selectedWorker"
          @click="handlePrintFilled"
        >
          Imprimir con datos
        </UButton>
      </div>
    </div>

    <separator leading="Modelo de certificado" />

    <div class="m-auto w-full max-w-3xl rounded-lg border border-muted bg-muted/40 p-6">
      <div class="flex justify-start">
        <img src="/uci-logo-row.png" alt="UCI" class="h-8" />
      </div>
      <div class="mt-6">
        <UFormField label="Trabajador" class="max-w-md">
          <SelectWorker
            v-model="selectedWorkerId"
            :items="workerStore.workers"
            :loading="loadingWorkers"
            placeholder="Seleccione un trabajador"
          />
        </UFormField>
      </div>
      <div class="mt-6 space-y-4 text-sm">
        <p><strong>Área</strong> {{ selectedWorker ? selectedArea : '________________________________________' }}</p>
        <p><strong>Nombre y Apellido</strong> {{ selectedWorker ? getDisplayName(selectedWorker) : '____________________________________' }}</p>
        <p><strong>No. Expediente</strong> {{ selectedWorker ? (selectedWorker.record_number ?? '-') : '___________________________________' }}</p>
        <p><strong>Cargo</strong> {{ selectedWorker ? (selectedWorker.position?.description || selectedWorker.position_code || '-') : '___________________________________________' }}</p>
        <p><strong>Fecha de Solicitud</strong> _________________________________</p>
        <p><strong>Desde</strong> ____________ <strong>hasta</strong> ____________ <strong>a descontar</strong> ________</p>
        <p><strong>Entregado por</strong> ________________ <strong>recibido por</strong> ________________</p>
      </div>
    </div>
  </Stack>
</template>
