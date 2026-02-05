<script setup lang="ts">
withDefaults(defineProps<{
  table: any
  columnId: string
  placeholder?: string
  inputClass?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}>(), {
  placeholder: 'Buscar...'
})
</script>

<template>
  <UInput
    :model-value="(table?.tableApi?.getColumn(columnId)?.getFilterValue() as string) || ''"
    :placeholder="placeholder"
    :size="size"
    :class="inputClass"
    icon="i-lucide-search"
    @update:model-value="table?.tableApi?.getColumn(columnId)?.setFilterValue($event)"
  />
</template>
