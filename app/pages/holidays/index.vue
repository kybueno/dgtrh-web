<script setup lang="ts">
const data = ref([
  {
    no_exp: '4600',
    name:'Joseito Perez',
    área: 'GAT',
    desde: '10/10/2025',
    hasta:'20/10/2025',
    días_disponibles: '14',
    incorporacion:'22/10/25',
    motivo:'vacaciones',
  },
])
</script>

<template>
    <div>Registro de Vacaciones</div>
  <UTable :data="data" class="flex-1" />
  <div>
  <UButton>Añadir</UButton>
  </div>
</template>