<template>
    <UCard class="px-4">
        <div class="p-4 mb-4 flex gap-4 items-center">
            <slot name="heading-leading">
                <UAvatar v-if="icon" size="xl" :icon="icon"/>
            </slot>
            <div class="flex-1">
                <strong>{{ heading }}</strong>
                <p v-if="description" class="text-muted">{{ description }}</p>
            </div>
        </div>
        <form @submit.prevent="emit('done')">

            <slot></slot>

            <div class="flex gap-2 justify-end p-3 pt-4 mt-8 border-t-muted">
                <slot name="actions-leading">
                    <UButton @click="emit('cancel')" variant="outline" color="neutral">Cancelar</UButton>
                </slot>
                <slot name="actions">
                    <UButton type="submit" :disabled="loading" :loading="loading">Guardar</UButton>
                </slot>
            </div>

        </form>


    </UCard>
</template>
<script setup lang="ts">

interface FormCardProps {
    heading: string
    description?: string
    loading?: boolean
    icon?: string | false
}

withDefaults(defineProps<FormCardProps>(),{icon:'mdi:edit'})

const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'cancel'): void;
}>()
</script>