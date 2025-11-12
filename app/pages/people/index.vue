<script setup lang="ts">
import { useWorkerStore } from '~/stores/workerStore'
const supabase = useSupabaseClient()

const workerStore = useWorkerStore()

onMounted(() => workerStore.loadWorkers(supabase))

</script>
<template>
    <div class="flex flex-col gap-8 p-4">
        <div class="flex justify-between">

        </div>

        <WorkerTable :data="workerStore.workers" />
        <!-- <WorkerForm></WorkerForm> -->





    </div>

</template>
