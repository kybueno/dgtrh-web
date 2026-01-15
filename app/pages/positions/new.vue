<script lang="ts" setup>
definePageMeta({
  title: 'Nuevo Cargo'
})
useHead({
  title: 'Nuevo Cargo'
})

import PositionsForm from '~/components/positions/PositionsForm.vue';
</script>

<template>
  <div>
    <PositionsForm></PositionsForm>
  </div>
</template>

