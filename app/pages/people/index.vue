<script setup lang="ts">
import { workers, loadWorkers,workersPending } from '~/stores/workerStoreC'

definePageMeta({
    title: 'Trabajadores'
})
useHead({
    title: 'Trabajadores'
})

const searchTerm = ref('')
const viewMode = ref<'table' | 'grid'>('table')

onMounted(() => { if (!workersPending.value && !workers.value.length) loadWorkers() })

function handleLoadWorkers() {
    if (!workersPending.value) loadWorkers()
}

const authStore = useAuthStore()
</script>
<template>
    <div class="space-y-8 mt-8">
        <div class="flex justify-between">
            <UInput v-model="searchTerm" class="max-w-lg" icon="i-lucide-search" placeholder="Buscar trabajadores..." />
            <div class="flex gap-3">
                <DataViewToggle v-model="viewMode" />
                <!-- v-if="user?.roles?.some((r)=>(['director','hr_manager'].includes(r)))"  -->
                <UButton icon="i-lucide-plus" to="people/new" variant="ghost">Nuevo trabajador</UButton>
                <UButton @click="handleLoadWorkers" variant="ghost" icon="i-lucide-refresh-cw"
                    title="Refrescar lista" :disabled="workersPending" :loading="workersPending" />
            </div>
        </div>


        <WorkerTable :loading="workersPending" :data="workers" :view-mode="viewMode" />
    </div>
</template>
