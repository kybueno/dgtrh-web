<script setup lang="ts">
import { h, defineComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

type Column<T> = TableColumn<T> & {
  accessorKey?: string
}

interface Props<T> {
  data: T[]
  columns: Column<T>[]
  rowKey?: keyof T | ((row: T, index: number) => string | number)
  emptyText?: string
}

const props = defineProps<Props<any>>()

const visibleColumns = computed(() =>
  props.columns.filter((col) =>
    col.id !== 'select' &&
    col.id !== 'actions' &&
    col.id !== 'name' &&
    col.id !== 'description' &&
    col.id !== 'avatar'
  )
)

const actionsColumn = computed(() => props.columns.find((col) => col.id === 'actions'))
const nameColumn = computed(() => props.columns.find((col) => col.id === 'name'))
const descriptionColumn = computed(() => props.columns.find((col) => col.id === 'description'))
const avatarColumn = computed(() => props.columns.find((col) => col.id === 'avatar'))

const CellRenderer = defineComponent({
  name: 'DataGridCellRenderer',
  props: {
    render: { type: Function, required: true },
    column: { type: Object, required: true },
    row: { type: Object, required: true },
    rowIndex: { type: Number, required: true },
  },
  setup(innerProps) {
    return () => innerProps.render(innerProps.column, innerProps.row, innerProps.rowIndex)
  },
})

function getRowKey(row: any, index: number) {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index)
  if (typeof props.rowKey === 'string' && row?.[props.rowKey] != null) return row[props.rowKey]
  if (row?.id != null) return row.id
  return index
}

function getLabel(col: Column<any>) {
  if (typeof col.header === 'string') return col.header
  if (typeof col.accessorKey === 'string') return col.accessorKey
  if (typeof col.id === 'string') return col.id
  return '—'
}

function renderCell(col: Column<any>, row: any) {
  const rowApi = {
    original: row,
    getValue: (key: string) => row?.[key],
  }

  if (col.cell) return col.cell({ row: rowApi } as any)
  if (typeof col.accessorKey === 'string') return row?.[col.accessorKey] ?? '—'
  if (typeof col.id === 'string') return row?.[col.id] ?? '—'
  return '—'
}
</script>

<template>
  <div>
    <div v-if="!data.length" class="text-sm text-gray-500">{{ emptyText || 'Sin datos' }}</div>
    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <UCard v-for="(row, rowIndex) in data" :key="getRowKey(row, rowIndex)" class="h-full">
        <template v-if="nameColumn || avatarColumn" #header>
          <div class="flex items-center gap-3">
            <div v-if="avatarColumn" class="shrink-0">
              <CellRenderer :render="renderCell" :column="avatarColumn" :row="row" :row-index="rowIndex" />
            </div>
            <div v-if="nameColumn" class="text-sm font-semibold leading-tight">
              <CellRenderer :render="renderCell" :column="nameColumn" :row="row" :row-index="rowIndex" />
            </div>
          </div>
        </template>
        <div class="grid gap-3">
          <div v-if="descriptionColumn" class="text-xs text-gray-500">
            <CellRenderer :render="renderCell" :column="descriptionColumn" :row="row" :row-index="rowIndex" />
          </div>
          <div
            v-for="col in visibleColumns"
            :key="col.id || col.accessorKey || getLabel(col)"
            class="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] items-start gap-2"
          >
            <div class="text-xs text-gray-500">{{ getLabel(col) }}</div>
            <div class="text-sm break-words text-right">
              <CellRenderer :render="renderCell" :column="col" :row="row" :row-index="rowIndex" />
            </div>
          </div>
        </div>
        <template v-if="actionsColumn" #footer>
          <div class="flex items-center justify-end gap-2">
            <CellRenderer :render="renderCell" :column="actionsColumn" :row="row" :row-index="rowIndex" />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
