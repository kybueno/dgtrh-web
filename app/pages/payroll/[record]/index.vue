<script setup lang="ts">
import { h, watch } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { UButton, UTextarea } from '#components'
import { generatePrenomina } from '../payrollHelpers'

type PayrollWorkerSummary = {
  worker: WorkerDetailed
  incidentDaysByType: Record<number, number>
  totalIncidentDays: number
  extraWorkHours: number
  observation: string | null
}

type PayrollDetailResponse = {
  payroll: PayrollInfo
  incidentTypes: IncidentType[]
  workers: PayrollWorkerSummary[]
}

const route = useRoute()
const payrollId = computed(() => Number(route.params.record))

const { data, pending, error, refresh } = await useAsyncData<PayrollDetailResponse>(
  () => `payroll-${payrollId.value}`,
  () => $fetch(`/api/payroll/${payrollId.value}`)
)

const observationDrafts = ref<Record<string, string>>({})
const observationSaving = ref<Record<string, boolean>>({})

watch(
  () => data.value?.workers,
  (workers) => {
    if (!workers) return
    const nextDrafts: Record<string, string> = { ...observationDrafts.value }
    for (const entry of workers) {
      if (nextDrafts[entry.worker.id] === undefined) {
        nextDrafts[entry.worker.id] = entry.observation ?? ''
      }
    }
    observationDrafts.value = nextDrafts
  },
  { immediate: true }
)

const saveObservation = async (workerId: string) => {
  if (observationSaving.value[workerId]) return
  observationSaving.value[workerId] = true

  const notes = (observationDrafts.value[workerId] ?? '').trim()
  try {
    await $fetch(`/api/payroll/${payrollId.value}/observations`, {
      method: 'PUT',
      body: { workerId, notes }
    })

    const workerEntry = data.value?.workers.find((entry) => entry.worker.id === workerId)
    if (workerEntry) {
      workerEntry.observation = notes.length ? notes : null
    }
  } finally {
    observationSaving.value[workerId] = false
  }
}

const handlePrint = () => {
  if (!data.value) return
  generatePrenomina(data.value)
}

const payrollLabel = computed(() => {
  const payroll = data.value?.payroll
  if (!payroll) return 'Prenómina'
  const month = new Date(2000, payroll.month - 1, 1).toLocaleDateString('es-ES', { month: 'long' })
  return `Prenómina ${month} ${payroll.year}`
})

const columns = computed<TableColumn<PayrollWorkerSummary>[]>(() => {
  const incidentColumns = (data.value?.incidentTypes ?? []).map((type) => ({
    id: `incident_${type.code}`,
    header: type.description || type.name,
    cell: ({ row }) => row.original.incidentDaysByType[type.code] ?? 0
  }))

  return [
    {
      id: 'record_number',
      header: 'No.Exp',
      cell: ({ row }) => row.original.worker.record_number
    },
    {
      id: 'name',
      header: 'Nombre y Apellidos',
      cell: ({ row }) => getDisplayName(row.original.worker)
    },
    {
      id: 'position',
      header: 'Cargo',
      cell: ({ row }) => row.original.worker.position?.description ?? row.original.worker.position_code
    },
    ...incidentColumns,
    {
      id: 'total_incidents',
      header: 'Total días',
      cell: ({ row }) => row.original.totalIncidentDays
    },
    {
      id: 'extra_hours',
      header: 'Horas extra',
      cell: ({ row }) => row.original.extraWorkHours.toFixed(2)
    },
    {
      id: 'observation',
      header: 'Observaciones',
      cell: ({ row }) => {
        const workerId = row.original.worker.id
        return h('div', { class: 'flex flex-col gap-2' }, [
          h(UTextarea, {
            modelValue: observationDrafts.value[workerId] ?? '',
            rows: 2,
            class: 'min-w-[220px]',
            'onUpdate:modelValue': (value: string) => {
              observationDrafts.value[workerId] = value
            }
          }),
          h(UButton, {
            label: 'Guardar',
            size: 'xs',
            variant: 'soft',
            color: 'primary',
            loading: observationSaving.value[workerId] ?? false,
            onClick: () => saveObservation(workerId)
          })
        ])
      }
    }
  ]
})
</script>

<template>
  <div class="flex flex-col w-full p-4">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-semibold text-lg">{{ payrollLabel }}</h3>
      <div class="flex items-center gap-2">
        <UButton icon="lucide:refresh-cw" variant="ghost" @click="refresh" :loading="pending" />
        <UButton icon="lucide:printer" variant="ghost" color="primary" @click="handlePrint" :disabled="!data">
        </UButton>
        <UButton to="/payroll" variant="ghost">Volver</UButton>
      </div>
    </div>

    <UAlert
      v-if="error"
      color="red"
      variant="subtle"
      title="No se pudo cargar la prenómina"
      :description="String(error)"
      class="mb-4"
    />

    <div class="border border-muted bg-muted/70 rounded-md">
      <UTable
        :data="data?.workers ?? []"
        :columns="columns"
        class="w-full h-full min-h-96"
        :paginate="true"
        :page-size="10"
        sticky
        :loading="pending"
      />
    </div>
  </div>
</template>
