<script setup lang="ts">
import { upperFirst } from 'scule'

withDefaults(defineProps<{
  table: any // You might want to type this properly with your table type
  variant?:  "ghost" | "soft" | "outline" | "solid" | "subtle"
}>(), {
  variant: 'ghost'
})
</script>

<template>
  <UDropdownMenu
    :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({
      label: column.columnDef.header || upperFirst(column.id),
      type: 'checkbox' as const,
      checked: column.getIsVisible(),
      onUpdateChecked(checked: boolean) {
        table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
      },
      onSelect(e: Event) {
        e.preventDefault()
      }
    }))"
    :content="{ align: 'end' }"
  >
    <UButton
      label="Columnas"
      color="neutral"
      :variant="variant"
      trailing-icon="i-lucide-chevron-down"
      class="ml-auto"
      aria-label="Selección de columnas"
    />
  </UDropdownMenu>
</template>
