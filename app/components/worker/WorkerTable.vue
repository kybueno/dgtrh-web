<script setup lang="ts">
import { page } from '#build/ui'
import { UAvatar, UButton, UCheckbox } from '#components'
import type { TableColumn } from '@nuxt/ui'

interface Props {
    data: WorkerDetailed[]
    loading?: boolean
    viewMode?: 'table' | 'grid'
}
const { data, loading, viewMode = 'table' } = defineProps<Props>()

const columns: TableColumn<typeof data[0]>[] = [
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
        id: 'record',
        accessorKey: 'record',
        accessorFn: (row) => row.record_number,
        header: "Expediente",
        cell: ({ row }) => row.original.record_number,
    }, {
        enableSorting: true,
        id:'name',
        accessorKey: 'name',
        accessorFn: (row) => getDisplayName(row),
        header: "Nombre y Apellidos",
        cell: ({ row }) => h('span', { class: "cursor-pointer", onClick: () => navigateTo(`/people/${row.original.record_number}`) }, getDisplayName(row.original))
    }, {
        id: 'ci',
        accessorKey: 'ci',
        header: "CI",
        cell: ({ row }) => row.original.ci
    }, {
        id: 'gender',
        accessorKey: 'gender',
        header: "Género",
        cell: ({ row }) => getGenderLabel(row.original.gender as GenderValue)
    }, {
        id:'tel',
        accessorKey: 'tel',
        header: "Teléfono",
        cell: ({ row }) => h('a', { href: 'tel:' + row.original.tel }, row.original.tel ?? '')

    }, {
        id:'email',
        accessorKey: 'email',
        header: "Email",
        cell: ({ row }) => h('a', { href: 'mailto:' + row.original.email }, row.original.email ?? '')

    }, {
        id:'group',
        accessorKey: 'group',
        header: "Grupo",
        cell: ({ row }) =>
          row.original.group?.name ||
          row.original.led_groups?.[0]?.name ||
          row.original.group_id
    }, {
        id:'position',
        accessorKey: 'position',
        header: "Cargo",
        cell: ({ row }) => row.original.position?.description ?? row.original.position_code
    }, {
        id:'address',
        accessorKey: 'address',
        header: "Dirección",
        cell: ({ row }) => row.original.address
    }, {
        id:'organizations',
        accessorKey: 'organizations',
        header: "Organizaciones",
        cell: ({ row }) => row.original.organizations_codes.join(", ").toUpperCase()
    }, {
        id:'level',
        accessorKey: 'level',
        header: "Nivel de preparación",
        cell: ({ row }) => getEducationLevelByCode(row.original.level as EducationLevelCode)?.label
    },
    {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => h('div', { class: 'flex items-center gap-2 justify-end' }, [
            h(UButton, {
                size: 'sm',
                icon: 'i-lucide-eye',
                color: 'neutral',
                variant: 'ghost',
                title: 'Ver',
                to: `/people/${row.original.record_number}`
            }),
            h(UButton, {
                size: 'sm',
                icon: 'i-lucide-edit',
                color: 'neutral',
                variant: 'ghost',
                title: 'Editar',
                to: `/people/${row.original.record_number}/edit`
            })
        ]),
        enableSorting: false,
        enableHiding: false
    },
]
const initialTableState = {
    columnVisibility: {
        record: false,
        ci: false,
        gender:false,
        organizations:false,
        level:false,
        address:false,
    }
}

const table = useTemplateRef('table')
const sorting = ref([])
</script>
<template>
    <div class="border border-muted bg-muted/70 rounded-md">
        <Flex v-if="viewMode === 'table'" class="pt-2 px-2 justify-end">
            <TableSearch :table="table" column-id="name" placeholder="Buscar por nombre" input-class="max-w-sm" />
            <ColumnsControl :table="table" />
        </Flex>
        <UTable
            v-if="viewMode === 'table'"
            v-model:sorting="sorting"
            :initial-state="initialTableState"
            ref="table"
            :loading="loading || workersPending"
            :data="data"
            :columns="columns"
            class="w-full h-full"
            :paginate="true"
            :page-size="10"
            sticky
        />
        <DataGrid v-else class="p-4" :data="data" :columns="columns" />
        <div v-if="viewMode === 'table'" class="flex justify-center py-4">
            <UPagination v-model="page" :total="data.length" :page-size="10" />
        </div>
    </div>
</template>
