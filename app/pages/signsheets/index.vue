<script setup lang="ts">
import { useWorkerStore } from '~/stores/workerStore'
import { generateSignSheet } from './signSheetUtils'

const pageTitle = 'Hojas de Firma'
definePageMeta({
  title: pageTitle
})
useHead({
  title: pageTitle
})

const workerStore = useWorkerStore()
const loading = ref(false)
const searchQuery = ref('')
const now = new Date()
const selectedMonth = ref(String(now.getMonth() + 1))
const selectedYear = ref(String(now.getFullYear()))

const filteredWorkers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return workerStore.workers
  return workerStore.workers.filter((worker) => {
    const name = getDisplayName(worker).toLowerCase()
    const record = String(worker.record_number ?? '').toLowerCase()
    const email = String(worker.email ?? '').toLowerCase()
    return name.includes(query) || record.includes(query) || email.includes(query)
  })
})

const monthOptions = [
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' },
  { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
]

function getSelectedMonthDate() {
  const monthNumber = Number(selectedMonth.value)
  const yearNumber = Number(selectedYear.value)
  if (!monthNumber || !yearNumber) return new Date()
  return new Date(yearNumber, monthNumber - 1, 1)
}

function handlePrint(worker: WorkerDetailed) {
  generateSignSheet(worker, getSelectedMonthDate())
}

async function handleLoadWorkers() {
  loading.value = true
  await workerStore.loadWorkers()
  loading.value = false
}

onMounted(handleLoadWorkers)
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold">{{ pageTitle }}</h3>
        <p class="text-sm text-muted">Genera hojas de firma mensuales por trabajador.</p>
      </div>
      <div class="flex items-center gap-2">
        <UButton icon="lucide:refresh-cw" variant="ghost" @click="handleLoadWorkers" :loading="loading"
          :disabled="loading">
          Actualizar
        </UButton>
      </div>
    </div>

    <UCard class="bg-muted/60">
      <stack-h class="items-end justify-between gap-3">
        <UInput v-model="searchQuery" placeholder="Buscar por nombre, expediente o correo" icon="lucide:search"
          class="min-w-80" />
        <stack-h>
          <UFormField label="Mes">
            <USelect v-model="selectedMonth" :items="monthOptions" class="min-w-28" />
          </UFormField>
          <UFormField label="Año">
            <UInput v-model="selectedYear" inputmode="numeric" placeholder="YYYY" class="w-28" />
          </UFormField>
        </stack-h>

      </stack-h>
    </UCard>
    <div class="text-sm text-muted">
      {{ filteredWorkers.length }} trabajadores
    </div>
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <USkeleton v-for="item in 6" :key="item" class="h-28" />
    </div>

    <div v-else-if="filteredWorkers.length === 0">
      <EmptyState message="No hay trabajadores para mostrar" @retry="handleLoadWorkers" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <UCard v-for="worker in filteredWorkers" :key="worker.id" class="hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="font-semibold">{{ getDisplayName(worker) }}</p>
            <p class="text-sm text-muted">No. Exp: {{ worker.record_number ?? '-' }}</p>
            <p class="text-sm text-muted" v-if="worker.email">{{ worker.email }}</p>
          </div>
          <UButton size="sm" icon="lucide:printer" @click="handlePrint(worker)">
            PDF
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>
