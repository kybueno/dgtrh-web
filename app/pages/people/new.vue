<script setup lang="ts">
import WorkerForm from '~/components/worker/WorkerForm.vue';
definePageMeta({
  title:"Nuevo trabajador"
})
useHead({
  title:"Nuevo trabajador"
})
</script>

<template>
  <div class="p-4">
    <WorkerForm />
  </div>
</template>
