<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: null,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: 'Seleccionar trabajador',
  },
  placeholder: {
    type: String,
    default: 'Buscar trabajador...',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  filterFn: {
    type: Function,
    default: null,
  },
  showStatus: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const {data,pending} = await useAsyncData("workers-basic", async () => {
  return await $fetch<WorkerDetailed[]>('/api/workers')
}, { server: false })

// Filter workers based on optional filter function
const filteredWorkers = computed<WorkerInfo[]>(() => {

  const workers = data?.value || []

  if (typeof props.filterFn === 'function') {
    return workers.filter(props.filterFn);
  }

  return workers
});

// Format worker display name
const formatWorkerName = (worker) => {
  if (!worker) return '';
  return `${worker.first_name} ${worker.last_name} (${worker.record_number})`;
};

// Handle selection change
const handleUpdate = (value) => {
  emit('update:modelValue', value);
};

// Get worker status text
const getStatusText = (status) => {
  if (!status) return '';
  return status === 'active' ? 'Activo' : status === 'terminated' ? 'Baja' : 'Inactivo';
};

// Get status color
const getStatusColor = (status) => {
  if (!status) return 'gray';
  return status === 'active' ? 'green' : status === 'terminated' ? 'red' : 'gray';
};
</script>

<template>
  <USelectMenu
    :model-value="modelValue"
    label-key="first_name"
    value-key="id"
    :multiple="multiple"
    :items="filteredWorkers"
    :loading="pending"
    :disabled="disabled || pending"
    :required="required"
    :placeholder="placeholder"
    :searchable="(worker) => {
      if (!worker) return '';
      return `${worker.first_name} ${worker.last_name} ${worker.record_number}`.toLowerCase();
    }"
    searchable-placeholder="Buscar por nombre o expediente..."
    @update:model-value="handleUpdate"
  >
   
    <template #item-label="{item}">
      <span>{{ item.first_name }} {{ item.middle_name && item.middle_name.at(0) + '.' }} {{ item.last_name }} {{ item.second_last_name }}</span>
    </template>
    <template #item-leading="{item}">
      <UAvatar :alt="item.first_name + ' ' + item.last_name" />
    </template>
  </USelectMenu>
</template>
