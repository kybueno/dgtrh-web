<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

type PayrollWorkerSummary = {
  worker: WorkerDetailed
  incidentDaysByType: Record<number, number>
  totalIncidentDays: number
  extraWorkHours: number
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
    }
  ]
})
</script>

<template>
  <div class="flex flex-col w-full p-4">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-semibold text-lg">{{ payrollLabel }}</h3>
      <div class="flex items-center gap-2">
        <UButton icon="mdi:refresh" variant="ghost" @click="refresh" :loading="pending" />
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
