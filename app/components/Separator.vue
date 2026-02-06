<script setup lang="ts">
withDefaults(defineProps<{
  leading?: string
  trailing?: string
}>(), {
  leading: '',
  trailing: ''
})
</script>

<template>
  <Flex class="items-center gap-3 w-full text-sm text-muted">
    <slot>{{ leading }}</slot>
    <hr class="flex-1 w-full border-t border-muted" />
    <slot name="trailing">{{ trailing }}</slot>
  </Flex>
</template>
