<script setup lang="ts">
import { UButton } from '#components'

withDefaults(defineProps<{
  icon?: string
  message?: string
  retryLabel?: string
  showRetry?: boolean
}>(), {
  icon: 'i-lucide-inbox',
  message: 'No hay datos para mostrar',
  retryLabel: 'Reintentar',
  showRetry: true
})

const emit = defineEmits<{
  (e: 'retry'): void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-muted bg-muted/30 p-6 text-center">
    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
      <UIcon :name="icon" class="h-5 w-5 text-muted-foreground" />
    </div>
    <div class="text-sm text-muted-foreground">
      <slot>
        {{ message }}
      </slot>
    </div>
    <UButton
      v-if="showRetry"
      variant="ghost"
      color="neutral"
      size="sm"
      @click="emit('retry')"
    >
      {{ retryLabel }}
    </UButton>
  </div>
</template>
