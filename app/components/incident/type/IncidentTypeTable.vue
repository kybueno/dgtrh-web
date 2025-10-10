<script setup lang="ts">
import { UCheckbox, UInput } from '#components';
import type { TableColumn } from '@nuxt/ui';


interface Props {
    data: IncidentType[]
}
const { data } = defineProps<Props>()


const columns: TableColumn<IncidentType>[] = [
    {
        id: 'select',
        header: ({ table }) => h(UCheckbox, {
            'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
            'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
            'aria-label': 'Select all'
        }),
        cell: ({ row }) => h(UCheckbox, {
            'modelValue': row.getIsSelected(),
            'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
            'aria-label': 'Select row'
        }),
        enableSorting: false,
        enableHiding: false
    },
    {
        header: "Code",
        cell: ({ row }) => row.original.code,
        
    }, {
        header: "Descripción",
        cell: ({ row }) => row.original.description
    }, {
        header: "Clasificación",
        cell: ({ row }) => row.original.classification
    }, {
        header: "A pagar por",
        cell: ({ row }) => row.original.pay_for

    }, {
        header: "%",
        cell: () => 0.00

    }, {
        header: "Deductible",
        cell: ({ row }) => row.original.deductible
    }, {
        header: "Clasifc. Fondo Tiempo",
        cell: ({ row }) => row.original.time_classification
    },


]
</script>
<template>
    <UCard class="border border-muted rounded-md overflow-auto max-w-full">
        <template #header>
            <div class="flex justify-between">
                <UInput placeholder="Busca.." icon="mdi:search" />
                <UButton to="newincident">Añadir</UButton>
            </div>
        </template>
        <UTable :columns="columns" :data="data" />
    </UCard>
</template>