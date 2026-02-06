<script setup lang="ts">
type FilterFn = (worker: WorkerInfo) => boolean

const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  items?: WorkerInfo[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  allowClear?: boolean
  loading?: boolean
  filterFn?: FilterFn | null
}>(), {
  placeholder: 'Buscar trabajador...',
  disabled: false,
  required: false,
  allowClear: true,
  loading: false,
  filterFn: null
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()

const { data, pending } = await useAsyncData('workers-basic', () =>
  $fetch<WorkerInfo[]>('/api/workers')
)

const resolvedItems = computed<WorkerInfo[]>(() => {
  const source = props.items ?? data.value ?? []
  if (typeof props.filterFn === 'function') {
    return source.filter(props.filterFn)
  }
  return source
})

const hasValue = computed(() => {
  return props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== ''
})

function clearSelection(e?: Event) {
  e?.preventDefault()
  e?.stopPropagation()
  emit('update:modelValue', null)
}
</script>

<template>
  <USelectMenu
    :model-value="modelValue"
    :items="resolvedItems"
    value-key="id"
    label-key="first_name"
    :required="required"
    :disabled="disabled || loading"
    :loading="loading || pending"
    :placeholder="placeholder"
    :searchable="(worker) => {
      if (!worker) return ''
      return `${worker.first_name} ${worker.middle_name || ''} ${worker.last_name} ${worker.second_last_name || ''} ${worker.record_number || ''}`.toLowerCase()
    }"
    searchable-placeholder="Buscar por nombre o expediente..."
    @update:model-value="(value) => emit('update:modelValue', value)"
  >
    <template #item-label="{ item }">
      <div class="flex flex-col">
        <span>{{ getDisplayName(item) }}</span>
        <span class="text-xs text-muted" v-if="item.record_number">No. Exp: {{ item.record_number }}</span>
      </div>
    </template>
    <template #item-leading="{ item }">
      <UAvatar :alt="getDisplayName(item)" />
    </template>
    <template #trailing>
      <UButton
        v-if="allowClear && hasValue"
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
  </USelectMenu>
</template>
