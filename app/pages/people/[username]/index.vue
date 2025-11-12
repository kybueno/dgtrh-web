<template>
    <div class="max-w-4xl mx-auto p-6">
        <h1 class="text-3xl font-bold mb-6 flex items-center gap-2">
            <User class="w-8 h-8 text-blue-600" />
            Detalles del Trabajador
        </h1>

        <div v-if="worker" class="bg-white rounded-lg shadow p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h2 class="text-xl font-semibold mb-2">Información Personal</h2>
                    <p><strong>Nombre:</strong> {{ worker.first_name }} {{ worker.middle_name }} {{ worker.last_name }}
                        {{ worker.second_last_name }}</p>
                    <p><strong>CI:</strong> {{ worker.ci }}</p>
                    <p><strong>
                            Email:
                        </strong> {{ worker.email }}</p>
                    <p><strong>Estado:</strong> <span
                            :class="worker.status === 'active' ? 'text-green-600' : 'text-red-600'">
                            <CheckCircle v-if="worker.status === 'active'" class="inline w-4 h-4" />
                            <XCircle v-else class="inline size-4" />
                            {{ worker.status == 'active' ? 'Activo' : worker.status == 'terminated' ? 'Baja' :
                                worker.status
                            }}
                        </span></p>
                    <p><strong>No. Expediente:</strong> #{{ worker.record_number }}</p>
                    <p><strong>Teléfono:</strong>{{ worker.tel }}</p>
                    <p><strong>Grupo de trabajo:</strong></p>
                    <UButton to="neworker"> Añadir</UButton>
    
                </div>
            </div>
        </div>

        <div v-else class="text-center text-gray-500 mt-20">
            Trabajador no encontrado.
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useWorkerStore } from '~/stores/workerStore';
import { onMounted, ref } from 'vue';
const supabase = useSupabaseClient()
const route = useRoute();
const username = route.params.username as string;
const workerStore = useWorkerStore();
const worker = ref<WorkerInfo | null>(null);

onMounted(async () => {
    await workerStore.loadWorkers(supabase);
    worker.value = workerStore.getWorkerByUsername(username) || null;
});
</script>

