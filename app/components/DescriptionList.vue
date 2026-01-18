<template>
    <dl :class="['grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3', $attrs.class]">
        <SectionTitle v-if="title" :title="title" />
        <slot></slot>
    </dl>
</template>
<script setup lang="ts">
defineProps<{ title?: string }>()
</script>