<script setup lang="ts">

definePageMeta({
  title: 'Prenóminas'
})
useHead({
  title: 'Prenóminas'
})

import { h, onMounted, ref } from 'vue'
import { UButton } from '#components'
import type { TableColumn } from '@nuxt/ui'
import { page } from '#build/ui'
import { createPayroll, loadPayroll, payroll } from '~/stores/payrollStore'
import { UserRole } from '~~/prisma/generated/enums'

const viewMode = ref<'table' | 'grid'>('table')
const sorting = ref([])
const creatingPayroll = ref(false)
const loadingPayroll = ref(false)

const selectedMonth = ref<number | null>(null)
const selectedYear = ref<number | null>(null)
const selectedStatus = ref<string | null>(null)
const selectedCreator = ref<string | null>(null)
const selectedReviewer = ref<string | null>(null)

const now = new Date()
const currentMonth = now.getMonth() + 1
const currentYear = now.getFullYear()

const currentPayroll = computed(() => {
  return payroll.value.find((item) => item.month === currentMonth && item.year === currentYear)
})

const currentPayrollLabel = computed(() => {
  return new Date(currentYear, currentMonth - 1, 1).toLocaleDateString('es-ES', { month: 'long' })
})

// Load data
async function handleReload() {
  loadingPayroll.value = true
  await loadPayroll()
  loadingPayroll.value = false
}

onMounted(handleReload)

const handleCreateCurrentPayroll = async () => {
  if (creatingPayroll.value) return
  creatingPayroll.value = true
  await createPayroll({ month: currentMonth, year: currentYear })
  creatingPayroll.value = false
}

const formatMonth = (month?: number) => {
  if (!month) return '-'
  return new Date(2000, month - 1, 1).toLocaleDateString('es-ES', { month: 'long' })
}

const formatDate = (value?: string | Date | null) => {
  if (!value) return '-'
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleDateString('es-ES')
}

const formatStatus = (status?: string | null) => {
  switch (status) {
    case 'pending':
      return 'Pendiente'
    case 'approved':
      return 'Aprobada'
    case 'denied':
      return 'Denegada'
    default:
      return status ?? '-'
  }
}

const monthOptions = computed(() =>
  payroll.value
    .map((item) => item.month)
    .filter((value): value is number => !!value)
    .map((value) => ({ value, label: formatMonth(value) }))
)

const yearOptions = computed(() =>
  payroll.value
    .map((item) => item.year)
    .filter((value): value is number => !!value)
    .map((value) => ({ value, label: String(value) }))
)

const statusOptions = computed(() =>
  Array.from(new Set(payroll.value.map((item) => item.status).filter(Boolean))).map((value) => ({
    value: value as string,
    label: formatStatus(value as string)
  }))
)

const creatorOptions = computed(() =>
  payroll.value
    .map((item) => (item as any).creator)
    .filter((value): value is WorkerDetailed => !!value)
    .map((worker) => ({ value: worker.id, label: getDisplayName(worker) }))
)

const reviewerOptions = computed(() =>
  payroll.value
    .map((item) => (item as any).reviewer)
    .filter((value): value is WorkerDetailed => !!value)
    .map((worker) => ({ value: worker.id, label: getDisplayName(worker) }))
)

const filteredPayroll = computed(() => {
  return payroll.value.filter((item) => {
    if (selectedMonth.value && item.month !== selectedMonth.value) return false
    if (selectedYear.value && item.year !== selectedYear.value) return false
    if (selectedStatus.value && item.status !== selectedStatus.value) return false
    const creator = (item as any).creator
    if (selectedCreator.value && creator?.id !== selectedCreator.value) return false
    const reviewer = (item as any).reviewer
    if (selectedReviewer.value && reviewer?.id !== selectedReviewer.value) return false
    return true
  })
})

const columns: TableColumn<PayrollInfo>[] = [
  {
    id: 'month',
    accessorKey: 'month',
    header: 'Mes',
    cell: ({ row }) => formatMonth(row.original.month)
  },
  {
    id: 'year',
    accessorKey: 'year',
    header: 'Año',
    cell: ({ row }) => row.original.year ?? '-'
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => formatStatus(row.original.status)
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: 'Creada',
    cell: ({ row }) => formatDate(row.original.created_at)
  },
  {
    id: 'creator',
    header: 'Confeccionada por',
    cell: ({ row }) => {
      const creator = (row.original as any).creator
      if (!creator) return '-'
      return getDisplayName(creator)
    }
  },
  {
    id: 'reviewer',
    header: 'Revisada por',
    cell: ({ row }) => {
      const reviewer = (row.original as any).reviewer
      if (!reviewer) return '-'
      return getDisplayName(reviewer)
    }
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => h(UButton, {
      label: 'Ver',
      size: 'xs',
      variant: 'ghost',
      onClick: () => navigateTo(`/payroll/${row.original.id}`)
    })
  }
]
const table = useTemplateRef('table')
</script>
<template>
  <div class="flex flex-col w-full p-4">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-semibold text-lg">Prenóminas</h3>
      <div class="flex items-center gap-2">
        <DataViewToggle v-model="viewMode" />
        <UButton icon="mdi:refresh" variant="ghost" @click="handleReload" />
        <show-if-user v-if="!loadingPayroll" :roles="[UserRole.system_admin, UserRole.hr_manager]">
          <UButton
            v-if="!currentPayroll && !loadingPayroll"
            icon="i-lucide-plus"
            variant="soft"
            color="primary"
            :loading="creatingPayroll"
            @click="handleCreateCurrentPayroll"
          >
            Generar prenómina de {{ currentPayrollLabel }}
          </UButton>
        </show-if-user>
      </div>
    </div>

    <div class="border border-muted bg-muted/70 rounded-md">
      <Flex v-if="viewMode === 'table'" class="pt-2 px-2 flex-wrap gap-2 justify-between">
        <Flex class="gap-2 flex-wrap">
          <USelect v-model="selectedMonth" :items="monthOptions" placeholder="Mes" class="min-w-36" clearable />
          <USelect v-model="selectedYear" :items="yearOptions" placeholder="Año" class="min-w-28" clearable />
          <USelect v-model="selectedStatus" :items="statusOptions" placeholder="Estado" class="min-w-40" clearable />
          <USelect v-model="selectedCreator" :items="creatorOptions" placeholder="Confeccionada por" class="min-w-56" clearable />
          <USelect v-model="selectedReviewer" :items="reviewerOptions" placeholder="Revisada por" class="min-w-56" clearable />
          <UButton
            variant="ghost"
            color="neutral"
            @click="() => { selectedMonth = null; selectedYear = null; selectedStatus = null; selectedCreator = null; selectedReviewer = null; }"
          >
            Limpiar
          </UButton>
        </Flex>
        <TableSearch :table="table" column-id="created_at" placeholder="Buscar por fecha" input-class="max-w-sm" />
        <ColumnsControl :table="table" />
      </Flex>
      <UTable
        v-if="viewMode === 'table'"
        v-model:sorting="sorting"
        ref="table"
        :data="filteredPayroll"
        :columns="columns"
        class="w-full h-full min-h-96"
        :paginate="true"
        :page-size="10"
        sticky
      />
      <DataGrid v-else class="p-4" :data="filteredPayroll" :columns="columns" />
      <div v-if="viewMode === 'table'" class="flex justify-center py-4">
        <UPagination v-model="page" :total="filteredPayroll.length" :page-size="10" />
      </div>
    </div>
  </div>
</template>
