<script setup lang="ts">
import { useWorkerStore } from '~/stores/workerStore'

const workerStore = useWorkerStore()
const searchTerm = ref('')
onMounted(() => workerStore.loadWorkers())

</script>
<template>
    <UDashboardPanel id="workers">
        <template #header>
            <UDashboardNavbar title="Trabajadores">
             
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <UInput v-model="searchTerm" class="max-w-lg" icon="i-lucide-search" placeholder="Buscar trabajadores..." />
                
                <template #right>
                    <UButton icon="i-lucide-plus" to="people/new">Nuevo trabajador</UButton>
                    <UButton variant="ghost" color="neutral" icon="i-lucide-refresh-cw" />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <WorkerTable :data="workerStore.workers" />
        </template>
    </UDashboardPanel>
</template>
