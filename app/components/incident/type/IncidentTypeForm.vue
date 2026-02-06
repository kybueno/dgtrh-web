<template>
    <UCard class="mx-auto">
        <div class="flex flex-col">
            <ULabel>
                Código
                <UInput v-model="incident.code" />
            </ULabel>
            <ULabel>
                Nombre
                <UInput v-model="incident.name" />
            </ULabel>
            <ULabel>
                Descripción
                <UInput v-model="(incident as any).description" />
            </ULabel>
        </div>

        <template #footer>
            <UButton @click="handleSubmit"> Añadir Nueva Incidencia</UButton>
        </template>
    </UCard>
</template>
<script setup lang="ts">
const emit = defineEmits<
    {
        (e: 'submit', payload: IncidentTypeInsert): void
    }>()

const incident = ref<IncidentTypeInsert>({
    avg: true,
    classification: 'Autorizada',
    code: 99,
    deductible: false,
    description: `Una descripción de prueba ${Math.random()}`,
    incentive: false,
    name: `Prueba ${Math.random()}`,
    pay_for: null,
    sum: true,
    time_classification: ''
})

function handleSubmit() {
    if (incident.value.code === null || incident.value.code === undefined || Number.isNaN(incident.value.code)) {
        notifyWarning({ title: 'Validación', description: 'El código es obligatorio.' })
        return
    }
    if (!incident.value.name) {
        notifyWarning({ title: 'Validación', description: 'El nombre es obligatorio.' })
        return
    }
    emit('submit', incident.value)
}

</script>
