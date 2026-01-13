<script setup lang="ts">
definePageMeta({
  title: 'Nueva Incidencia'
})
useHead({
  title: 'Nueva Incidencia'
})

import IncidentTypeForm from '~/components/incident/type/IncidentTypeForm.vue';
</script>

<template>
    <IncidentTypeForm/>
</template>