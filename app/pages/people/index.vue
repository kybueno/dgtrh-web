<script setup lang="ts">
import { useWorkerStore } from '~/stores/workerStore'
const supabase = useSupabaseClient()

const workerStore = useWorkerStore()

onMounted(() => workerStore.loadWorkers(supabase))

</script>
<template>
    <div class="flex flex-col gap-8">
        <div class="flex justify-between">

            <h1> Listado de Trabajadores</h1>
            <div class="flex gap-2">


                <Button @click="console.log('Add worker')">
                    <PlusIcon /> Registrar trabajador
                </Button>
                <Button @click="workerStore.loadWorkers(supabase)">
                    <RefreshCwIcon />
                </Button>
            </div>
        </div>

        <WorkerTable :data="workerStore.workers" />
        <WorkerForm></WorkerForm>




    </div>

</template>
