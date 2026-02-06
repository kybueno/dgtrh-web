<script setup lang="ts">
withDefaults(defineProps<{
  leading?: string
}>(), {
  leading: ''
})
</script>

<template lang="pug">
.flex.flex-col.items-center.h-full
  span(v-if="leading").text-sm.text-muted.whitespace-nowrap {{ leading }}
  .flex-1.w-px.bg-muted.mx-3
</template>
