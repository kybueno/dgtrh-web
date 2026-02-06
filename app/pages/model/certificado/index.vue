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
const requestDate = ref<string>('')
const fromDate = ref<string>('')
const toDate = ref<string>('')

const formatDate = (value: string) => {
  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString('es-ES')
}

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
  printCertificadoModel(selectedWorker.value, {
    requestDate: requestDate.value,
    fromDate: fromDate.value,
    toDate: toDate.value
  })
}

onMounted(loadWorkers)
</script>

<template>
  <stack class="p-4">
    <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      <div />
      <h3 class="text-base font-semibold text-center tracking-wide">{{ pageTitle.toUpperCase() }}</h3>
      <div class="flex justify-end gap-2">

      </div>
    </div>

    <separator />
    <stack class="m-auto w-full max-w-3xl">
      <div class="mt-6 grid grid-cols-1 items-end gap-4 md:grid-cols-2">
        <UFormField label="Trabajador" class="md:col-span-2">
          <SelectWorker
            class="w-full"
            v-model="selectedWorkerId"
            :items="workerStore.workers"
            :loading="loadingWorkers"
            placeholder="Seleccione un trabajador"
          />
        </UFormField>
        <UFormField label="Fecha de solicitud">
          <UInput v-model="requestDate" type="date" />
        </UFormField>
        <UFormField label="Desde">
          <UInput v-model="fromDate" type="date" />
        </UFormField>
        <UFormField label="Hasta">
          <UInput v-model="toDate" type="date" />
        </UFormField>
        <div class="flex flex-wrap justify-end gap-2 md:col-span-2">
          <UButton variant="subtle" color="neutral" icon="lucide:printer" @click="handlePrintBlank">
            Imprimir en blanco
          </UButton>
          <UButton variant="subtle" icon="lucide:printer" :disabled="!selectedWorker" @click="handlePrintFilled">
            Con datos
          </UButton>
        </div>
      </div>
      <u-card class="p-8 mt-6">
        <div class="flex justify-start">
          <img src="/uci-logo-row.png" alt="UCI" class="h-8" />
        </div>
        <div class="mt-6 space-y-4 text-sm">
          <p><strong>Área</strong> {{ selectedWorker ? selectedArea : '________________________________________' }}</p>
          <p><strong>Nombre y Apellido</strong> {{ selectedWorker ? getDisplayName(selectedWorker) :
            '____________________________________' }}</p>
          <p><strong>No. Expediente</strong> {{ selectedWorker ? (selectedWorker.record_number ?? '') :
            '___________________________________' }}</p>
          <p><strong>Cargo</strong> {{ selectedWorker ? (selectedWorker.position?.description ?? '') :
            '___________________________________________' }}</p>
          <p><strong>Fecha de Solicitud</strong> {{ requestDate ? formatDate(requestDate) : '_______________________________' }}</p>
          <p>
            <strong>Desde</strong> {{ fromDate ? formatDate(fromDate) : '____________' }}
            <strong>hasta</strong> {{ toDate ? formatDate(toDate) : '____________' }}
            <strong>a descontar</strong> ________
          </p>
          <div class="space-y-2">
            <p><strong>Entregado por</strong> ________________________________</p>
            <p><strong>Recibido por</strong> ________________________________</p>
          </div>
        </div>
      </u-card>
    </stack>
  </stack>
</template>
