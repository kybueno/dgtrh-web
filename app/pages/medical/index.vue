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
    firma:'',
    enfermedad:'',
    inicial_cont:'',
    días_prenómina:'',
  },
])
</script>

<template>
    <div>Anexo E: Registro de Certificado Médico</div>
  <UTable :data="data" class="flex-1" />
  <div>
  <UButton>Añadir</UButton>
  </div>
</template>