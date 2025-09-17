<script setup lang="ts">
const table = useTemplateRef('table')

import { useWorkerStore } from '~/stores/workerStore';
import { onMounted, ref } from 'vue';
const supabase = useSupabaseClient()
const workerStore = useWorkerStore();



onMounted(async () => {
  await workerStore.loadWorkers(supabase);
});
</script>

<template>
  <UTable ref="table" />
  <div class="p-4">

    <UButton icon="lucide:refresh-cw" @click="workerStore.loadWorkers(supabase)"></UButton>

    <UCard @click="" v-for="worker in workerStore.workers" class="p-4 flex gap-4">{{ getProfileDisplayName(worker) }}
    </UCard>
    <div>
    </div>

  </div>
</template>
