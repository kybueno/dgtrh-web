<script setup lang="ts">
import { UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';


interface Props {
    data: WorkerInfo[]
}
const { data } = defineProps<Props>()

const columns: TableColumn<WorkerInfo>[] = [
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
        header: "Expediente",
        cell: ({ row }) => row.original.record_number
    }, {
        header: "Nombre y Apellidos",
        cell: ({ row }) => h('span',{class:"cursor-pointer",onClick:()=>navigateTo('/people/'+row.original.email?.split('@').at(0))},`${row.original.first_name} ${row.original.middle_name && row.original.middle_name.at(0) + '.'}  ${row.original.last_name}  ${row.original.second_last_name}`)
    }, {
        header: "CI",
        cell: ({ row }) => row.original.ci
    }, {
        header: "Teléfono",
        cell: ({ row }) => h('a', { href: 'tel:' + row.original.tel }, row.original.tel ?? '')

    }, {
        header: "Email",
        cell: ({ row }) => h('a', { href: 'mailto:' + row.original.email }, row.original.email ?? '')

    }, {
        header: "Padre",
    }, {
        header: "Padre",
    }, {
        header: "Madre",
    }, {
        header: "Dirección",
    }, {
        header: "Organizaciones de masa",
    },


]
</script>
<template>
    <UCard>
        <template #header>

            <div class="flex justify-between">
                <UInput placeholder="Busca.." />
                <div class="flex gap-2">
                    <UButton icon="i-lucide-plus">Añadir</UButton>
                    <UButton variant="soft" color="neutral" icon="i-lucide-refresh-cw" />
                </div>
            </div>
        </template>
        <div class="">Universidad de Ciencias Informáticas</div>
        <UTable :data="data" :columns="columns" sticky class="h-96" />

    </UCard>
    <DataTable />
</template>