<script setup lang="ts">
import { printCertificadoModel } from './certificadoPdf'

const pageTitle = 'Modelo de Certificado'
definePageMeta({
  title: pageTitle
})
useHead({
  title: pageTitle
})
</script>

<template>
  <Stack class="flex-col gap-4 p-4">
    <stack-h class="justify-between">
      <h3 class="text-lg font-semibold">{{ pageTitle }}</h3>
      <UButton variant="subtle" icon="lucide:printer" @click="printCertificadoModel">Imprimir</UButton>
    </stack-h>

    <separator leading="Modelo de certificado" />

    <div class="m-auto w-full max-w-3xl rounded-lg border border-muted bg-muted/40 p-6">
      <div class="flex justify-center">
        <img src="/uci-logo-row.png" alt="UCI" class="h-10" />
      </div>
      <div class="mt-6 space-y-4 text-sm">
        <p><strong>Área</strong> ________________________________________________</p>
        <p><strong>Nombre y Apellido</strong> ____________________________________</p>
        <p><strong>No. Expediente</strong> _____________________________________</p>
        <p><strong>Cargo</strong> _____________________________________________</p>
        <p><strong>Fecha de Solicitud</strong> _________________________________</p>
        <p><strong>Desde</strong> ____________ <strong>hasta</strong> ____________ <strong>a descontar</strong> ________</p>
        <p><strong>Entregado por</strong> ________________ <strong>recibido por</strong> ________________</p>
      </div>
    </div>
  </Stack>
</template>
