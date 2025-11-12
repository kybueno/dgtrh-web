<script setup lang="ts">
import { useWorkerStore } from '~/stores/workerStore'
const supabase = useSupabaseClient()
const workerStore = useWorkerStore()


onMounted(loadGroups)





</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
  <div class="max-w-6xl mx-auto p-6 w-full">

    <!-- Encabezado -->
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-3xl font-bold flex-1 text-center flex items-center justify-center gap-2">
        <User class="w-8 h-8 text-blue-600" />
        Grupos de trabajo
      </h2>
      <UButton icon="i-lucide-plus" to="/groups/newgroup">Añadir grupo</UButton>
    </div>

    <!-- Contenedor de grupos -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    <UCard v-for="group in workGroups" variant="soft">
      <template #header>
      <strong>{{ group.name }}</strong>
    </template>

    <li v-for="member in group.workers">{{ member.first_name }}</li>


    <template #footer>
    <strong>Jefe: {{group.leader.first_name}}</strong>
    </template>
      
    </UCard>



    </div>
  </div>
</div>

    
</template>
