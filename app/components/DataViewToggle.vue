<script setup lang="ts">
interface Props {
  modelValue: 'table' | 'grid'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: 'table' | 'grid'): void
}>()

function setMode(mode: 'table' | 'grid') {
  if (mode !== props.modelValue) emit('update:modelValue', mode)
}
</script>

<template>
  <div class="flex items-center gap-1 rounded-md bg-muted p-1">
    <UButton
      size="xs"
      :variant="modelValue === 'table' ? 'subtle' : 'ghost'"
      color="primary"
      icon="i-lucide-table"
      @click="setMode('table')"
    >
      Tabla
    </UButton>
    <UButton
      size="xs"
      :variant="modelValue === 'grid' ? 'subtle' : 'ghost'"
      color="primary"
      icon="i-lucide-layout-grid"
      @click="setMode('grid')"
    >
      Tarjetas
    </UButton>
  </div>
</template>
