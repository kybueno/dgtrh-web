<script setup lang="ts">
const data = ref([
  {
    no_exp: '4600',
    name:'Joseito Perez',
    desde: '10/10/2025',
    hasta:'20/10/2025',
    causas:'',
    clave_de_incidencias:'',
  },
])
</script>

<template>
    <div>Anexo G: Registro de Licencia sin Sueldo</div>
  <UTable :data="data" class="flex-1" />
  <div>
  <UButton to="/sin-sueldo/newsin">Añadir</UButton>
  </div>
</template>