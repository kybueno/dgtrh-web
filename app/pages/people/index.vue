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
    if (!workersPending.value) loadWorkers()
}

const {loggedUserProfile:user} = useAuthStore()
</script>
<template>
    <div class="space-y-8 mt-8">
        <div class="flex justify-between">
            <UInput v-model="searchTerm" class="max-w-lg" icon="i-lucide-search" placeholder="Buscar trabajadores..." />
{{ user?.roles }}
            <div class="flex gap-3">
                <UButton v-if="user?.roles?.some((r)=>(['director','hr_manager'].includes(r)))" icon="i-lucide-plus" to="people/new" variant="ghost">Nuevo trabajador</UButton>
                <UButton @click="handleLoadWorkers" variant="ghost" icon="i-lucide-refresh-cw"
                    title="Refrescar lista" :disabled="workersPending" :loading="workersPending" />
            </div>
        </div>


        <WorkerTable :loading="workersPending" :data="workers" />
    </div>
</template>
