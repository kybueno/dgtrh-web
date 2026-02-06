<script setup lang="ts">
definePageMeta({
  title: 'Vacaciones'
})
useHead({
  title: 'Vacaciones'
})

</script>

<template>
  <div class="flex flex-col w-full p-4">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-semibold text-lg">Registro de Vacaciones</h3>
    </div>
    <UAlert
      color="amber"
      variant="subtle"
      title="Vista pendiente de migrar"
      description="Las vacaciones ahora se registrarán como incidencias. Esta vista se actualizará para mostrar incidencias del tipo vacaciones."
    />
  </div>
</template>
