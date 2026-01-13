<script setup lang="ts">
import { workers, loadWorkers } from '~/stores/workerStoreC'

definePageMeta({
    title: 'Trabajadores'
})

const searchTerm = ref('')
useAsyncData('workers', loadWorkers)
onMounted(() => { if (!workersPending.value && !workers.value.length) loadWorkers() })

function handleLoadWorkers(){
    if(!workersPending) loadWorkers()
}

</script>
<template>
    <div class="space-y-2">
        <UDashboardNavbar>
            <UInput v-model="searchTerm" class="max-w-lg" icon="i-lucide-search" placeholder="Buscar trabajadores..." />

            <template #right>
                <UButton icon="i-lucide-plus" to="people/new">Nuevo trabajador</UButton>
                <UButton @click="handleLoadWorkers" variant="ghost" icon="i-lucide-refresh-cw" title="Refrescar lista" />
            </template>
        </UDashboardNavbar>


        <WorkerTable v-if="workers.length" :data="workers" />
    </div>
</template>
