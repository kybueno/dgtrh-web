
<script setup lang="ts">
interface Stat {
  title: string
  icon: string
  value: number | string
}

const {icon,title,value} = defineProps<Stat>()

function formatCurrency(value: number): string {
  return value.toLocaleString('es-CU', {
    style: 'currency',
    currency: 'CUP',
    maximumFractionDigits: 0
  })
}

</script>

<template>
  <UPageCard
    :icon="icon"
    :title="title"
    to="/customers"
    variant="subtle"
    :ui="{
      container: 'gap-y-1.5',
      wrapper: 'items-start',
      leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
      title: 'font-normal text-muted text-xs uppercase'
    }"
    class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
  >
    <div class="flex items-center gap-2">
      <span class="text-2xl font-semibold text-highlighted">
        {{ value }}
      </span>

      <!-- <UBadge
        :color="stat.variation > 0 ? 'success' : 'error'"
        variant="subtle"
        class="text-xs"
      >
        {{ stat.variation > 0 ? '+' : '' }}{{ stat.variation }}%
      </UBadge> -->
    </div>
  </UPageCard>
</template>