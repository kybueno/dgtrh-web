<script setup lang="ts">
import { h, watch } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { UBadge, UButton, UTextarea } from '#components'
import { generatePrenomina } from '../payrollHelpers'
import StackH from '~/components/StackH.vue'
import { UserRole } from '~~/prisma/generated/enums'

definePageMeta({
  title: 'Prenómina'
})
useHead({
  title: 'Prenómina'
})

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
const payrollId = computed(() => Number(route.params.id))

const { data, pending, error, refresh } = await useAsyncData<PayrollDetailResponse>(
  () => `payroll-${payrollId.value}`,
  () => $fetch(`/api/payroll/${payrollId.value}`)
)

const toast = useToast()
const observationDrafts = ref<Record<string, string>>({})
const observationSaving = ref<Record<string, boolean>>({})
const observationStatus = ref<Record<string, 'saved' | 'error' | null>>({})

const selectedGroup = ref<string | null>(null)
const selectedPosition = ref<string | number | null>(null)
const minIncidentDays = ref<string>('')
const minExtraHours = ref<string>('')

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
    observationStatus.value[workerId] = 'saved'
    // setTimeout(() => {
    //   if (observationStatus.value[workerId] === 'saved') {
    //     observationStatus.value[workerId] = null
    //   }
    // }, 2000)
  } catch (err) {
    observationStatus.value[workerId] = 'error'
    toast.add({
      title: 'No se pudo guardar la observación',
      color: 'error'
    })
  } finally {
    observationSaving.value[workerId] = false
  }
}

const handlePrint = () => {
  if (!data.value) return
  generatePrenomina(data.value)
}

const statusLabel = computed(() => {
  const status = data.value?.payroll.status
  if (!status) return '-'
  switch (status) {
    case 'pending':
      return 'Pendiente'
    case 'approved':
      return 'Aprobada'
    case 'denied':
      return 'Denegada'
    default:
      return status
  }
})

const statusColor = computed(() => {
  const status = data.value?.payroll.status
  switch (status) {
    case 'approved':
      return 'success'
    case 'denied':
      return 'error'
    case 'pending':
    default:
      return 'warning'
  }
})

const statusUpdating = ref(false)

const updateStatus = async (nextStatus: 'approved' | 'denied') => {
  if (!data.value || statusUpdating.value) return
  statusUpdating.value = true
  try {
    const updated = await $fetch<PayrollInfo>(`/api/payroll/${payrollId.value}/status`, {
      method: 'PUT',
      body: { status: nextStatus }
    })
    data.value.payroll = updated
    toast.add({
      title: `Prenómina ${nextStatus === 'approved' ? 'aprobada' : 'denegada'}`,
      color: nextStatus === 'approved' ? 'success' : 'error'
    })
  } catch (err) {
    toast.add({
      title: 'No se pudo actualizar el estado',
      color: 'error'
    })
  } finally {
    statusUpdating.value = false
  }
}

const payrollLabel = computed(() => {
  const payroll = data.value?.payroll
  if (!payroll) return 'Prenómina'
  const month = new Date(2000, payroll.month - 1, 1).toLocaleDateString('es-ES', { month: 'long' })
  return `Prenómina ${month} ${payroll.year}`
})

const groupOptions = computed(() =>
  (data.value?.workers ?? [])
    .map((entry) => entry.worker.group?.name || entry.worker.leaderAtGroup?.name)
    .filter((value): value is string => !!value)
    .map((value) => ({ value, label: value }))
)

const positionOptions = computed(() =>
  (data.value?.workers ?? [])
    .map((entry) => ({
      value: entry.worker.position?.description ?? entry.worker.position_code,
      label: entry.worker.position?.description ?? String(entry.worker.position_code)
    }))
)

const filteredWorkers = computed(() => {
  const items = data.value?.workers ?? []
  return items.filter((entry) => {
    const groupName = entry.worker.group?.name || entry.worker.leaderAtGroup?.name
    if (selectedGroup.value && groupName !== selectedGroup.value) return false
    const positionLabel = entry.worker.position?.description ?? entry.worker.position_code
    if (selectedPosition.value && positionLabel !== selectedPosition.value) return false
    if (minIncidentDays.value && entry.totalIncidentDays < Number(minIncidentDays.value)) return false
    if (minExtraHours.value && entry.extraWorkHours < Number(minExtraHours.value)) return false
    return true
  })
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
          h(StackH,{class:'items-center'},[h(UButton, {
            label: 'Guardar',
            size: 'xs',
            variant: 'ghost',
            color: 'primary',
            icon: observationStatus.value[workerId]=== 'saved' ? 'lucide:check' : 'lucide:save',
            loading: observationSaving.value[workerId] ?? false,
            onClick: () => saveObservation(workerId)
          }),
          observationStatus.value[workerId] === 'saved'
            ? h(UBadge, { color: 'success', variant:'subtle' }, 'Guardado')
            : observationStatus.value[workerId] === 'error'
              ? h(UBadge, { color: 'error', variant:'subtle' }, 'Error')
              : null])
        ])
      }
    }
  ]
})
</script>

<template>
  <div class="flex flex-col w-full p-4">
    <div class="flex items-center justify-between mb-6">

      <Flex class="items-center gap-2">
        <UButton to="/payroll" title="Ir a la lista de prenóminas" variant="ghost" icon="lucide:arrow-left"></UButton>
        <h3 class="font-semibold text-lg">{{ payrollLabel }}</h3>
        <UBadge :color="statusColor" variant="subtle">{{ statusLabel }}</UBadge>
      </Flex>
      <div class="flex items-center gap-2">
        <UButton icon="lucide:refresh-cw" variant="ghost" @click="() => { refresh() }" :loading="pending" />
        <UButton icon="lucide:printer" variant="ghost" color="primary" @click="handlePrint" :disabled="!data">
        </UButton>
        <show-if-user :roles="[UserRole.director]">
          <UButton
            color="success"
            variant="soft"
            size="sm"
            :loading="statusUpdating"
            :disabled="data?.payroll.status === 'approved'"
            @click="updateStatus('approved')"
          >
            Aprobar
          </UButton>
          <UButton
            color="error"
            variant="soft"
            size="sm"
            :loading="statusUpdating"
            :disabled="data?.payroll.status === 'denied'"
            @click="updateStatus('denied')"
          >
            Denegar
          </UButton>
        </show-if-user>
      </div>
    </div>

    <UAlert v-if="error" color="error" variant="subtle" title="No se pudo cargar la prenómina"
      :description="String(error)" class="mb-4" />

    <div class="border border-muted bg-muted/70 rounded-md">
      <div class="flex flex-wrap gap-2 p-2">
        <ClearableSelect v-model="selectedGroup" :items="groupOptions" placeholder="Filtrar área" class="min-w-44" />
        <ClearableSelect v-model="selectedPosition" :items="positionOptions" placeholder="Filtrar cargo" class="min-w-56" />
        <UInput v-model="minIncidentDays" type="number" min="0" placeholder="Mín. días" class="max-w-32" />
        <UInput v-model="minExtraHours" type="number" min="0" placeholder="Mín. horas extra" class="max-w-40" />
        <UButton
          variant="ghost"
          color="neutral"
          @click="() => { selectedGroup = null; selectedPosition = null; minIncidentDays = ''; minExtraHours = ''; }"
        >
          Limpiar
        </UButton>
      </div>
      <UTable :data="filteredWorkers" :columns="columns" class="w-full h-full min-h-96" :paginate="true"
        :page-size="10" sticky :loading="pending" />
    </div>
  </div>
</template>
