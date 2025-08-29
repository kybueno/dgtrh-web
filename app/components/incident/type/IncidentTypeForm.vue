<template>
    <Card class="p-4">
        <Label>
            Código
            <Input v-model="incident.code" /></Label>
        <Label>
            Nombre
            <Input v-model="incident.name" /></Label>
        <Label>
            Descripción
            <Input v-model="(incident as any).description" /></Label>
        <Button @click="$emit('submit', incident)"> Submit</Button>
    </Card>
</template>
<script setup lang="ts">
import type { IncidentType, IncidentTypeInsert } from '~/types';
defineEmits<
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


</script>