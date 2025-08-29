<script setup lang="ts">
import type { IncidentType } from '~/types';

interface Props {
    data: IncidentType[]
}
const { data } = defineProps<Props>()
</script>
<template>
    <div class="border rounded-md overflow-auto">
        <table>
            <thead>
                <tr class="border-b text-xs text-gray-600">
                    <td class="p-1 ">Código</td>
                    <td class="p-1 ">Descripción</td>
                    <td class="p-1 ">Clasificación</td>
                    <td class="p-1 ">A pagar por</td>
                    <td class="p-1 ">Deducible</td>
                    <td class="p-1 ">Estímulo</td>
                    <td class="p-1 ">Suma Reporte Ausencias</td>
                    <td class="p-1 ">Prom. Trabaj.</td>
                    <td class="p-1 ">Clasif. Fondo Tiempo</td>
                </tr>
            </thead>
            <tbody>
                <tr :class="{ 'bg-gray-100': index % 2 }" class="h-14" v-for="incidentType, index in data"
                    :key="incidentType.code">
                    <td class="text-gray-400 font-bold text-lg text-center">{{ incidentType.code }}</td>
                    <td class="px-2 border-r">{{ incidentType.description }}</td>
                    <td class="ps-2">{{ incidentType.classification }}</td>
                    <td>{{ incidentType.pay_for ?? 'Nada' }}</td>
                    <td>{{ incidentType.deductible ? 'Sí' : 'No' }}</td>
                    <td>{{ incidentType.incentive ? 'Sí' : 'No' }}</td>
                    <td>{{ incidentType.sum ? 'Sí' : 'No' }}</td>
                    <td>{{ incidentType.avg ? 'Sí' : 'No' }}</td>
                    <td>{{ incidentType.time_classification }}</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>