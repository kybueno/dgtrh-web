<script setup lang="ts">
definePageMeta({
  title: 'Inicio de Sesión UCI'
})
useHead({
  title: 'Inicio de Sesión UCI'
})

const goToLogin = () => navigateTo('/auth/login')
</script>

<template>
  <div class="space-y-4">
    <p>Este método de acceso ya no está disponible. Use el inicio de sesión estándar.</p>
    <Button @click="goToLogin">Ir a Inicio de Sesión</Button>
  </div>
</template>
