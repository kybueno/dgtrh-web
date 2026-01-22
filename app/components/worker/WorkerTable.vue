<script setup lang="ts">
import { page } from '#build/ui';
import { UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';

interface Props {
    data: WorkerDetailed[]
    loading?: boolean
}
const { data, loading } = defineProps<Props>()

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
        header: "Expediente",
        cell: ({ row }) => row.original.record_number,
    }, {
        enableSorting: true,
        id:'name',
        accessorKey: 'name',
        header: "Nombre y Apellidos",
        cell: ({ row }) => h('span', { class: "cursor-pointer", onClick: () => navigateTo(`/people/${row.original.record_number}`) }, `${row.original.first_name} ${row.original.middle_name && row.original.middle_name.at(0) + '.'}  ${row.original.last_name}  ${row.original.second_last_name}`)
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
        header: "Grupo de Trabajo",
        cell: ({ row }) => row.original.group?.name || row.original.leaderAtGroup?.name || row.original.group_id
    }, {
        id:'position',
        accessorKey: 'position',
        header: "Cargo",
        cell: ({ row }) => row.original.position.description ?? row.original.position_code
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
]
const initialTableState = {
    columnVisibility: {
        record: false,
        ci: false,
        gender:false,
        organizations:false,
        level:false,
    }
}

const table = useTemplateRef('table')
const sorting = ref([])
</script>
<template>
   <div class="border border-muted bg-muted rounded-md">
        <Flex class="pt-1 px-1 justify-end">
            <ColumnsControl :table="table" />
        </Flex>
        <UTable v-model:sorting="sorting" :initial-state="initialTableState" ref="table" :loading="loading || workersPending" :data="data"
            :columns="columns" class="w-full h-full" :paginate="true" :page-size="10" />
        <div class="flex justify-center py-4">
            <UPagination v-model="page" :total="data.length" :page-size="10" />
        </div>
    </div>
</template>