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

<script setup lang="ts">
definePageMeta({
  title: 'Organizaciones'
})
useHead({
  title: 'Organizaciones'
})

import { UButton, UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';

onMounted(loadOrganizations);

function handleDeleteOrganization(organization: OrganizationInfo) {
  if (confirm(`¿Está seguro de que desea eliminar la organización ${organization.name}?`)) {
    deleteOrganization(organization.id)
  }
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
        header: "Logo",
        cell: ({ row }) => h('img', {
            src: row.original.img || '',
            alt: row.original.acronym || row.original.name || 'Logo',
            class: 'h-10 w-10 object-contain rounded bg-white/80 p-1'
        }),
        enableSorting: false
    },
    {
        header: "Nombre",
        cell: ({ row }) => h('div', { class: 'max-w-[280px] whitespace-normal break-words' }, row.original.name)
    },
    {
        header: "Descripción",
        cell: ({ row }) => h('div', {
            class: 'max-w-[420px] whitespace-normal break-words',
            style: 'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;'
        }, row.original.description || '')
    },
    {
        header: "Siglas",
        cell: ({ row }) => row.original.acronym || row.original.code?.toUpperCase() || '—'
    },
    {
        header: "Acciones",
        cell: ({ row }) => h('div', { class: 'flex items-center gap-2' }, [
            h(UButton, {
                size: 'sm',
                icon: 'i-lucide-pencil',
                color: 'neutral',
                variant: 'ghost',
                title: 'Editar',
                to: `/organizations/${row.original.id}`
            }),
            h(UButton, {
                size: 'sm',
                icon: 'i-lucide-trash-2',
                color: 'neutral',
                variant: 'ghost',
                title: 'Eliminar',
                onClick: () => handleDeleteOrganization(row.original)
            })
        ]),
        enableSorting: false,
        enableHiding: false
    }
]
</script>
