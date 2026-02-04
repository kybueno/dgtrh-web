<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Trabajos Extraordinarios</h1>
      <UButton 
        icon="i-heroicons-plus"
        to="/extra/new"
      >
        Registrar trabajo extra
      </UButton>
    </div>

    <UTable 
      :columns="columns" 
      :rows="extraWorks"
      :loading="pending"
      class="w-full"
    >
      <template #actions-data="{ row }">
        <UButton
          icon="i-heroicons-pencil"
          color="neutral"
          variant="ghost"
         :to="`/extra/edit/${row.id}`"
        />
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import { loadExtraWorks } from '~/stores/extraWorkStore';

// Data fetching
const { data: extraWorks, pending } = await useAsyncData('extra-works', async () => {
  const response = await loadExtraWorks()
  if (response.error) throw response.error
  return response.data ?? []
});

// Table columns
const columns = [
  { key: 'worker_id', header: 'Trabajador' },
  { key: 'description', header: 'Descripción' },
  { key: 'hours', header: 'Horas' },
  { key: 'date', header: 'Fecha' },
  { key: 'actions', header: 'Acciones' }
];
</script>
