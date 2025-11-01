<script setup lang="ts">
import { useWorkerStore } from '~/stores/workerStore'
const supabase = useSupabaseClient()

const workerStore = useWorkerStore()

onMounted(() => workerStore.loadWorkers(supabase))



</script>

<template>
    <div class="flex flex-col">
        <div class="max-w-4xl mx-auto p-6">

            <h2 class="text-3xl font-bold mb-6 flex items-center gap-2">
                <User class="w-8 h-8 text-blue-600" />
                Grupos de trabajo
            </h2>

            <div class="space-y-4">
               <UButton icon="i-lucide-plus" to="groups/newgroup">Añadir grupo</UButton>

            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 border">

                <h2 class="text-xl font-semibold mb-2">Grupo de Asistencia Técnica</h2>

                <select>
               Jefe: <option v-for="workers in workerStore.workers">{{ workers.first_name}}</option>
                </select>

                
            </div>
           
            <div class="grid grid-cols-2 gap-4 border">
                <h2 class="text-xl font-semibold mb-2">Operadores</h2>

                <select>
                Jefe:<option v-for="workers in workerStore.workers">{{ workers.first_name}}</option>
                </select>
        
            </div>


             <div class="grid grid-cols-2 gap-4 border">
                <h2 class="text-xl font-semibold mb-2">Telefonía</h2>

                <select>
                Jefe:<option v-for="workers in workerStore.workers">{{ workers.first_name}}</option>
                </select>
            
            </div>


                    <div class="grid grid-cols-2 gap-4 border">
                <h2 class="text-xl font-semibold mb-2">Aseguramiento</h2>

                <select>
                Jefe:<option v-for="workers in workerStore.workers">{{ workers.first_name}}</option>
                </select>
        
            </div>


                    <div class="grid grid-cols-2 gap-4 border">
                <h2 class="text-xl font-semibold mb-2">Economía</h2>

                <select>
                Jefe:<option v-for="workers in workerStore.workers">{{ workers.first_name}}</option>
                </select>

            </div>
        
    </div>
    
</template>
