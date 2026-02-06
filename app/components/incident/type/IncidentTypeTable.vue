<script setup lang="ts">
import { UCheckbox } from '#components';
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
        id: 'code',
        accessorKey: 'code',
        header: "Code",
        cell: ({ row }) => row.original.code,
    }, {
        id: 'description',
        accessorKey: 'description',
        header: "Descripción",
        cell: ({ row }) => row.original.description
    }, {
        id: 'classification',
        accessorKey: 'classification',
        header: "Clasificación",
        cell: ({ row }) => row.original.classification
    }, {
        id: 'pay_for',
        accessorKey: 'pay_for',
        header: "A pagar por",
        cell: ({ row }) => row.original.pay_for
    }, {
        header: "%",
        cell: () => 0.00

    }, {
        id: 'deductible',
        accessorKey: 'deductible',
        header: "Deductible",
        cell: ({ row }) => row.original.deductible
    }, {
        id: 'time_classification',
        accessorKey: 'time_classification',
        header: "Clasifc. Fondo Tiempo",
        cell: ({ row }) => row.original.time_classification
    },


]
const table = useTemplateRef('table')
</script>
<template>
    <UCard class="border border-muted rounded-md overflow-auto max-w-full">
        <template #header>
            <Flex class="justify-between gap-2 px-2 pt-2">
                <TableSearch :table="table" column-id="description" placeholder="Buscar por descripción..." input-class="max-w-sm" />
                <UButton to="/incident-types/new">Añadir</UButton>
            </Flex>
        </template>
        <UTable ref="table" :columns="columns" :data="data" />
    </UCard>
</template>
