<template>
  <div>
    <dt class="text-sm text-muted">
      <USkeleton v-if="loading" class="h-4 w-24" />
      <template v-else>{{ label }}</template>
    </dt>
    <dd class="text-sm font-medium">
      <USkeleton v-if="loading" class="h-4 w-32 mt-1" />
      <template v-else><slot>{{ value }}</slot></template>
    </dd>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ 
  label?: string; 
  value?: string | number | null;
  loading?: boolean;
}>(), {
  loading: false
});
</script>
