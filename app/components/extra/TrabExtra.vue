<script setup lang="ts">
const data = ref([
  {
    no_exp: '4600',
    date: '2024-03-11T15:30:00',
    status: 'paid',
    email: 'james.anderson@example.com',
    amount: 594
  },
])
</script>

<template>
  <UTable :data="data" class="flex-1" />
  <div>
  <UButton>Añadir</UButton>
  </div>
</template>