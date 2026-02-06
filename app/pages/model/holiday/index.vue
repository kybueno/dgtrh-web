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
    <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      <div />
      <h3 class="text-base font-semibold text-center tracking-wide">{{ pageTitle.toUpperCase() }}</h3>
      <div class="flex justify-end">
        <UButton variant="subtle" icon="lucide:printer" @click="printHolidayModel">Imprimir</UButton>
      </div>
    </div>
    <separator leading="Imagen fotocopiada"/>
    <div class="m-auto p-4 bg-muted rounded-lg"><img src="/Picture.png" width="700" alt="Preview"></div>
  </Stack>
</template>
