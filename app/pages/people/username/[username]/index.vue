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
                    <p><strong>No. Expediente:</strong> {{ worker.record_number }}</p>
                    <p><strong>Teléfono:</strong>{{ worker.tel }}</p>
                    <p><strong>Grupo de trabajo:</strong>{{ worker.group_id }}</p>
                    <p><strong>Fecha de inicio:</strong>{{ worker.created_at }}</p>
                    <p><strong>Padre:</strong>{{ worker.parent1_name }}</p>
                    <p><strong>Madre:</strong>{{ worker.parent2_name }}</p>
                    <p><strong>Dirección:</strong>{{ worker.address }}</p> 
                    <p><strong>Género:</strong>{{ getGenderLabel(worker.gender as GenderValue) }}</p>
                    <p><strong>Nivel de preparación:</strong>{{ worker.level }}</p>
                    <p><strong>Cargo que ocupa:</strong>{{ worker.position_code }}</p>
                    <p><strong>Organizaciones a las que pertenece:</strong>{{ worker.organizations_codes }}</p>
                    <div class="flex gap-4 justify-end mt-4">
                        <UButton @click="handleDelete()" variant="subtle" color="error" >Eliminar trabajador</UButton>
                        <UButton :to="`/people/username/${getEmailUsername(worker.email||'')}/edit`" variant="subtle" > Modificar datos</UButton>
                    </div>
    
                </div>
            </div>
            <UAlert v-if="errorMessage" variant="subtle" color="error" title="Error" :description="errorMessage">Error: {{ errorMessage }}</UAlert>
        </div>

        <div v-else class="text-center text-gray-500 mt-20">
            Trabajador no encontrado.
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Detalles del Trabajador'
})
useHead({
  title: 'Detalles del Trabajador'
})

import { useRoute } from 'vue-router';
import { useWorkerStore } from '~/stores/workerStore';
import { onMounted, ref } from 'vue';
const supabase = useSupabaseClient()
const route = useRoute();
const username = route.params.username as string;
const workerStore = useWorkerStore();
const worker = ref<WorkerInfo | null>(null);
const errorMessage = ref<string>('')

async function handleDelete(){
    if(!worker.value?.id || !confirm("Seguro de que desea eliminar permanentemente a @"+ username )) return

    const response = await workerStore.deleteWorker(worker.value.id)
    errorMessage.value = response.error?.details || ''

}

onMounted(async () => {
    await workerStore.loadWorkers();
    worker.value = workerStore.getWorkerByUsername(username) || null;
});
</script>

