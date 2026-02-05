<script setup lang="ts">
import { workers, loadWorkers, workersPending } from '~/stores/workerStoreC'

definePageMeta({
    title: 'Trabajadores'
})
useHead({
    title: 'Trabajadores'
})

const viewMode = ref<'table' | 'grid'>('table')

onMounted(() => { if (!workersPending.value && !workers.value.length) loadWorkers() })

function handleLoadWorkers() {
    if (!workersPending.value) loadWorkers()
}

const authStore = useAuthStore()
</script>
<template>
    <div class="flex flex-col w-full p-4">
        <div class="flex items-center justify-between mb-6">
            <h3 class="font-semibold text-lg">Trabajadores</h3>
            <div class="flex items-center gap-2">
                <DataViewToggle v-model="viewMode" />
                <!-- v-if="user?.roles?.some((r)=>(['director','hr_manager'].includes(r)))"  -->
                <UButton icon="i-lucide-plus" to="people/new" variant="ghost">Nuevo trabajador</UButton>
                <UButton @click="handleLoadWorkers" variant="ghost" icon="mdi:refresh" title="Refrescar lista"
                    :disabled="workersPending" :loading="workersPending" />
            </div>
        </div>


        <WorkerTable :loading="workersPending" :data="workers" :view-mode="viewMode" />
    </div>
</template>
