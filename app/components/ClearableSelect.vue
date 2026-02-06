<script setup lang="ts">
const props = defineProps<{
  modelValue?: unknown
  clearValue?: unknown
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

const hasValue = computed(() => {
  return props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== ''
})

function clearSelection(e?: Event) {
  e?.preventDefault()
  e?.stopPropagation()
  emit('update:modelValue', props.clearValue ?? null)
}
</script>

<template>
  <USelect
    v-bind="$attrs"
    :model-value="modelValue"
    @update:model-value="(value) => emit('update:modelValue', value)"
  >
    <template #trailing>
      <UButton
        v-if="hasValue"
        icon="i-lucide-x"
        color="neutral"
        variant="ghost"
        size="xs"
        type="button"
        @pointerdown.prevent.stop="clearSelection"
        @mousedown.prevent.stop="clearSelection"
        @click.prevent.stop="clearSelection"
      />
    </template>
  </USelect>
</template>
