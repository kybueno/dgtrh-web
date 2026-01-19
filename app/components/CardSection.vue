<template lang="pug">
    section
        SectionTitle(v-if="title" :title="title")
        slot
</template>
<script setup lang="ts">
defineProps<{ title?: string }>()
</script>