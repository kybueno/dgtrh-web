<template>
    <div class="flex flex-col w-full p-4">
        <div class="flex items-center justify-between mb-6">
            <h3 class="font-semibold text-lg">Lista de organizaciones</h3>
            <div class="flex items-center gap-2">
        <UButton icon="mdi:refresh" variant="ghost" @click="loadOrganizations()" :disabled="organizationsPending">
        </UButton>
                <UButton icon="i-lucide-plus" to="/organizations/new">Añadir</UButton>
            </div>
        </div>
        <UTable :data="organizations" :columns="columns" class="w-full h-full" />
    </div>
</template>

<script lang="ts" setup>
import { UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';

onMounted(loadOrganizations);

function handleDeleteOrganization(organization: OrganizationInfo) {
    if (confirm(`¿Está seguro de que desea eliminar el cargo ${organization.name}?`)) deleteGroup(organization.id)
}

interface Props {
    data: OrganizationInfo[]
}
const { data } = defineProps<Props>()

const columns: TableColumn<OrganizationInfo>[] = [
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
        header: "Código",
        cell: ({ row }) => row.original.code
    }, {
        header: "Descripción",
        cell: ({ row }) => row.original.description
    }, {
        header: "Nombre",
        cell: ({ row }) => row.original.name
    }, {
        header: "Siglas",
        cell: ({ row }) => row.original.acronym
    },
]
</script>
