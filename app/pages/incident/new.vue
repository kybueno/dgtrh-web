<script setup lang="ts">
import IncidentForm from '~/components/incident/IncidentForm.vue'

definePageMeta({
  title: 'Nueva Incidencia'
})
useHead({
  title: 'Nueva Incidencia'
})
</script>

<template>
  <div class="container mx-auto p-6">
    <IncidentForm />
  </div>
</template>