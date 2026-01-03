<script setup lang="ts">
import { useWorkerStore } from '~/stores/workerStore'

const workerStore = useWorkerStore()

onMounted(() => workerStore.loadWorkers())

</script>
<template>
    <div class="flex flex-col gap-8 p-4 w-full">
        <div class="flex justify-between">

        </div>
        <div class="overflow-auto max-w-6xl">
            <WorkerTable :data="workerStore.workers" />
        </div>
    </div>
</template>
