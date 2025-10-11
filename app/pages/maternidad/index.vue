<script lang="ts">
const data = ref([
{
no_exp: '4600',
name:'Joseito Perez',
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
    <div>Universidad de las Ciencias Informáticas</div>


    <div>Registro de Licencia de Maternidad y PREST. Social</div>
    
    <div>MES:</div>
    <div>Área:</div>
    <div>Año:</div>
    <UTable :data="data" class="flex-1" />
  <div>
  <UButton>Añadir</UButton>
  </div>
    <div>Fecha:</div>
    </template>
