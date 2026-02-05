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
  <UFieldGroup size="sm" >
    <UButton
      :variant="modelValue === 'table' ? 'subtle' : 'outline'"
      color="primary"
      icon="i-lucide-table"
      @click="setMode('table')"
    >
      Tabla
    </UButton>
    <UButton
      :variant="modelValue === 'grid' ? 'subtle' : 'outline'"
      color="primary"
      icon="i-lucide-layout-grid"
      @click="setMode('grid')"
    >
      Tarjetas
    </UButton>
  </UFieldGroup>
</template>
