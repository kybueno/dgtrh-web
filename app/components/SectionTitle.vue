<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template lang="pug">
  h3.text-sm.font-semibold.text-muted.uppercase.tracking-wide.mb-3
    slot {{ title }}
</template>
