<script setup lang="ts">
import { workers, loadWorkers } from '~/stores/workerStoreC'

definePageMeta({
    title: 'Trabajadores'
})
useHead({
    title: 'Trabajadores'
})

const searchTerm = ref('')
useAsyncData('workers', loadWorkers)
onMounted(() => { if (!workersPending.value && !workers.value.length) loadWorkers() })

function handleLoadWorkers() {
    if (!workersPending) loadWorkers()
}

</script>
<template>
    <div class="space-y-8 mt-8">
        <div class="flex justify-between">
            <UInput v-model="searchTerm" class="max-w-lg" icon="i-lucide-search" placeholder="Buscar trabajadores..." />

            <div class="flex gap-3">
                <UButton icon="i-lucide-plus" to="people/new" variant="ghost">Nuevo trabajador</UButton>
                <UButton @click="handleLoadWorkers" variant="ghost" icon="i-lucide-refresh-cw"
                    title="Refrescar lista" />
            </div>
        </div>


        <WorkerTable v-if="workers.length" :data="workers" />
    </div>
</template>
