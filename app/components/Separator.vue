<script setup lang="ts">
withDefaults(defineProps<{
  leading?: string
}>(), {
  leading: ''
})
</script>

<template lang="pug">
.flex.items-center.gap-3.w-full
  span(v-if="leading").text-sm.text-muted
    slot {{ leading }}
  hr.flex-1.w-full.border-t-1.border-muted
</template>
