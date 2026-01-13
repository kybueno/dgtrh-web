<script setup lang="ts">
import { page } from '#build/ui';
import { UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';



const selectedRows = ref<WorkerInfo[]>([])
const showConfirm = ref(false)
const workerToDelete = ref<WorkerInfo | null>(null)






interface Props {
    data: WorkerInfo[]
    loading?: boolean
}
const { data,loading } = defineProps<Props>()

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
        cell: ({ row }) => h('span', { class: "cursor-pointer", onClick: () => navigateTo(`/people/${row.original.record_number}`) }, `${row.original.first_name} ${row.original.middle_name && row.original.middle_name.at(0) + '.'}  ${row.original.last_name}  ${row.original.second_last_name}`)
    }, {
        header: "CI",
        cell: ({ row }) => row.original.ci
    }, {
        header: "Género",
        cell: ({ row }) => getGenderLabel(row.original.gender as GenderValue)
    }, {
        header: "Teléfono",
        cell: ({ row }) => h('a', { href: 'tel:' + row.original.tel }, row.original.tel ?? '')

    }, {
        header: "Email",
        cell: ({ row }) => h('a', { href: 'mailto:' + row.original.email }, row.original.email ?? '')

    }, {
        header: "Grupo de Trabajo",
        cell: ({ row }) => row.original.group_id
    }, {
        header: "Cargo",
        cell: ({ row }) => row.original.position_code
    }, {
        header: "Dirección",
        cell: ({ row }) => row.original.address
    }, {
        header: "Organizaciones",
        cell: ({ row }) => row.original.organizations_codes.join(", ").toUpperCase()
    }, {
        header: "Nivel de preparación",
        cell: ({ row }) => row.original.level
    },
]



</script>
<template>
    <div>
        <UTable :loading="loading || workersPending" :data="data" :columns="columns" class="w-full h-full" :paginate="true" :page-size="10" />
        <div class="flex justify-center py-4">
            <UPagination v-model="page" :total="data.length" :page-size="10" />
        </div>
    </div>
</template>