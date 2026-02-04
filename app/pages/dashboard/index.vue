<script setup lang="ts">
definePageMeta({
  title: 'Panel principal'
})
useHead({
  title: 'Panel principal'
})

import { ref } from 'vue'
const authStore = useAuthStore()
const extraWork = ref([])
const extraWorkPending = ref(false)


onMounted(async () => {
  if (!workers.value.length) loadWorkers()
  if (!incidents.value.length) loadIncidents()
  if (!workGroups.value.length) loadGroups()
  if (!extraWork.value.length) {
    
    const response = await loadExtraWorks()
  if(response.data) extraWork.value = response.data
  }
})

</script>

<template>
  <UContainer class="p-4 gap-8 h-full flex flex-col">
    <UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px ">
      <dashboard-stat to="/people" :loading="!workers.length && workersPending" icon="mdi:account" title="Empleados" :value="workers.length" />
      <dashboard-stat to="/groups" :loading="!workGroups.length && groupsPending" icon="mdi:account-group" title="Grupos de Trabajo" :value="workGroups.length" color="secondary" />
      <dashboard-stat to="/incident" :loading="!incidents.length && incidentsPending" icon="mdi:alert" title="Incidencias" :value="incidents.length" color="warning" />
      <dashboard-stat to="/extra" :loading="!extraWork.length && extraWorkPending" icon="mdi:account-clock" title="Trabajo Extraordinario" :value="extraWork.length" color="green" />
    </UPageGrid>
    <UCard class="flex-1" variant="subtle">
      <template v-if="authStore.loggedUserProfile">
        <div class="flex flex-col items-center justify-center h-full text-muted/50 gap-8">
          <u-icon name="mdi:support" size="6rem" class="text-muted/20" />
          <p class="font-semibold text-xl">
            No hay noticias por ahora, {{
              authStore.loggedUserProfile.value?.worker?.first_name }}
          </p>
        </div>
      </template>
    </UCard>
  </UContainer>
</template>
