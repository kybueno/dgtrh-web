<script setup lang="ts">

import { useWorkerStore } from '~/stores/workerStore';
import { onMounted } from 'vue';
import { exportSignSheet, generateSignSheet } from './signSheetUtils';
const supabase = useSupabaseClient()
const workerStore = useWorkerStore();

onMounted(async () => {
  await workerStore.loadWorkers(supabase);
});



</script>

<template>

  <div class="p-4 space-y-4">
    <div class="flex items-center gap-4">
      <UButton icon="lucide:refresh-cw" @click="workerStore.loadWorkers(supabase)"></UButton>
    </div>

    <UCard @click="generateSignSheet(worker)" v-for="worker in workerStore.workers"
      class="p-4 flex gap-4 cursor-pointer hover:scale-105 transition-all active:scale-100">{{
        getProfileDisplayName(worker) }}
    </UCard>
    <div>
    </div>

  </div>
</template>
