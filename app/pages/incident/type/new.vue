<script setup lang="ts">
definePageMeta({
  title: 'Nuevo tipo de Incidencia'
})
useHead({
  title: 'Nuevo tipo de Incidencia'
})

import IncidentTypeForm from '~/components/incident/type/IncidentTypeForm.vue';
</script>

<template>
    <IncidentTypeForm/>
</template>