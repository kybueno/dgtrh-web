<script setup lang="ts">
import { printHolidayModel } from './holidayPdf'

const pageTitle = 'Modelo de vacaciones'
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
      <UButton variant="subtle" icon="lucide:printer" @click="printHolidayModel">Imprimir</UButton>
    </stack-h>
    <separator leading="Imagen fotocopiada"/>
    <div class="m-auto p-4 bg-muted rounded-lg"><img src="/Picture.png" width="700" alt="Preview"></div>
  </Stack>
</template>
