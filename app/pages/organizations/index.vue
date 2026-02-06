<template>
    <div class="flex flex-col w-full p-4">
        <div class="flex items-center justify-between mb-6">
            <h3 class="font-semibold text-lg">Lista de organizaciones</h3>
            <div class="flex items-center gap-2">
                <DataViewToggle v-model="viewMode" />
                <UButton icon="mdi:refresh" variant="ghost" @click="loadOrganizations()"
                    :disabled="organizationsPending">
                </UButton>
                <UButton icon="i-lucide-plus" to="/organizations/new" variant="ghost">Nueva organización</UButton>
            </div>
        </div>
        <div class="border border-muted bg-muted/70 rounded-md">
            <Flex v-if="viewMode === 'table'" class="pt-2 px-2 flex-wrap gap-2 justify-between">
                <Flex class="gap-2 flex-wrap">
                    <USelect v-model="selectedCode" :items="codeOptions" placeholder="Filtrar código" class="min-w-40" clearable />
                    <USelect v-model="selectedAcronym" :items="acronymOptions" placeholder="Filtrar siglas" class="min-w-40" clearable />
                    <USelect
                        v-model="imageFilter"
                        :items="[
                            { value: 'all', label: 'Todas' },
                            { value: 'with', label: 'Con imagen' },
                            { value: 'without', label: 'Sin imagen' }
                        ]"
                        class="min-w-40"
                    />
                    <UButton
                        variant="ghost"
                        color="neutral"
                        @click="() => { selectedCode = null; selectedAcronym = null; imageFilter = 'all'; }"
                    >
                        Limpiar
                    </UButton>
                </Flex>
                <TableSearch :table="table" column-id="name" placeholder="Buscar organización" input-class="max-w-sm" />
                <ColumnsControl :table="table" />
            </Flex>
            <UTable
                v-if="viewMode === 'table'"
                v-model:sorting="sorting"
                ref="table"
                :data="filteredOrganizations"
                :columns="columns"
                class="w-full h-full"
                :paginate="true"
                :page-size="10"
                sticky
            />
            <DataGrid v-else class="p-4" :data="filteredOrganizations" :columns="columns" />
            <div v-if="viewMode === 'table'" class="flex justify-center py-4">
                <UPagination v-model="page" :total="filteredOrganizations.length" :page-size="10" />
            </div>
        </div>
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
import { page } from '#build/ui'

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

const viewMode = ref<'table' | 'grid'>('table')
const table = useTemplateRef('table')
const sorting = ref([])

const selectedCode = ref<string | null>(null)
const selectedAcronym = ref<string | null>(null)
const imageFilter = ref<'all' | 'with' | 'without'>('all')

const codeOptions = computed(() =>
    organizations.value
        .map((org) => org.code)
        .filter((code): code is string => !!code)
        .map((code) => ({ value: code, label: code }))
)

const acronymOptions = computed(() =>
    organizations.value
        .map((org) => org.acronym)
        .filter((acronym): acronym is string => !!acronym)
        .map((acronym) => ({ value: acronym, label: acronym }))
)

const filteredOrganizations = computed(() => {
    return organizations.value.filter((org) => {
        if (selectedCode.value && org.code !== selectedCode.value) return false
        if (selectedAcronym.value && org.acronym !== selectedAcronym.value) return false
        if (imageFilter.value === 'with' && !org.img) return false
        if (imageFilter.value === 'without' && org.img) return false
        return true
    })
})

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
        id: "avatar",
        header: "Logo",
        cell: ({ row }) => h('img', {
            src: row.original.img || '',
            alt: row.original.acronym || row.original.name || 'Logo',
            class: 'h-10 w-10 object-contain rounded bg-white/80 p-1'
        }),
        enableSorting: false
    },
    {
        id: "name",
        accessorKey: 'name',
        header: "Nombre",
        cell: ({ row }) => h('div', { class: 'max-w-[280px] whitespace-normal break-words' }, row.original.name)
    },
    {
        id: "description",
        accessorKey: 'description',
        header: "Descripción",
        cell: ({ row }) => h('div', {
            class: 'max-w-[420px] whitespace-normal break-words',
            style: 'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;'
        }, row.original.description || '')
    },
    {
        id: "acronym",
        accessorKey: 'acronym',
        header: "Siglas",
        cell: ({ row }) => row.original.acronym || row.original.code?.toUpperCase() || '—'
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => h('div', { class: 'flex items-center gap-2' }, [
            h(UButton, {
                size: 'sm',
                icon: 'i-lucide-edit',
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
