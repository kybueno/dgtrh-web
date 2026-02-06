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

const viewMode = ref<'table' | 'grid'>('table')
const sorting = ref([])
const creatingPayroll = ref(false)

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
  await loadPayroll()
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
        <UButton
          v-if="!currentPayroll"
          icon="i-lucide-plus"
          variant="soft"
          color="primary"
          :loading="creatingPayroll"
          @click="handleCreateCurrentPayroll"
        >
          Generar prenómina de {{ currentPayrollLabel }}
        </UButton>
      </div>
    </div>

    <div class="border border-muted bg-muted/70 rounded-md">
      <Flex v-if="viewMode === 'table'" class="pt-2 px-2 justify-end">
        <TableSearch :table="table" column-id="created_at" placeholder="Buscar por fecha" input-class="max-w-sm" />
        <ColumnsControl :table="table" />
      </Flex>
      <UTable
        v-if="viewMode === 'table'"
        v-model:sorting="sorting"
        ref="table"
        :data="payroll"
        :columns="columns"
        class="w-full h-full min-h-96"
        :paginate="true"
        :page-size="10"
        sticky
      />
      <DataGrid v-else class="p-4" :data="payroll" :columns="columns" />
      <div v-if="viewMode === 'table'" class="flex justify-center py-4">
        <UPagination v-model="page" :total="payroll.length" :page-size="10" />
      </div>
    </div>
  </div>
</template>
