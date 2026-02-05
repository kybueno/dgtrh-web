<script lang="ts" setup>
import { workers } from '~/stores/workerStoreC';
import type { WorkerDetailed } from '~/types/worker';

definePageMeta({
    title: 'Anexo 14'
})
useHead({
    title: 'Anexo 14'
})

import { UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';

onMounted(loadWorkers)
onMounted(loadPositions);

function handleDeletePosition(position: PositionInfo) {
    if (confirm(`¿Está seguro de que desea eliminar el cargo ${position.description}?`)) deleteGroup(position.code)
}


interface Props {
    data: PositionInfo[]
}
const { data } = defineProps<Props>()

const columns: TableColumn<PositionInfo>[] = [
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
        header: "Código",
        cell: ({ row }) => row.original.code
    }, {
        id: 'description',
        accessorKey: 'description',
        header: "Descripción",
        cell: ({ row }) => row.original.description
    }, {
        id: 'category',
        accessorKey: 'category',
        header: "Categoría",
        cell: ({ row }) => row.original.category
    }, {
        id: 'count',
        header: "Cantidad",
        cell: ({ row }) => {
          const positionCode = row.original.code;
          const count = workers.value.filter((worker: WorkerDetailed) => worker.position_code === positionCode).length;
          return count || 0;
        }
    }, {
        id: 'level',
        accessorKey: 'level',
        header: "Nivel",
        cell: ({ row }) => row.original.level
    }, {
        id: 'group_escale',
        accessorKey: 'group_escale',
        header: "Grupo/Escala",
        cell: ({ row }) => row.original.group_escale
    },
]
const table = useTemplateRef('table')



</script>

<template>
    <div class="flex flex-col p-8 w-full">

        <div class="flex items-center justify-between p-2 ">
            <h3 class="font-semibold text-lg">Anexo 14</h3>

            <div class="flex gap-2">
                <TableSearch :table="table" column-id="description" placeholder="Buscar cargo..." input-class="max-w-sm" />
                <UButton icon="mdi:refresh" variant="ghost" @click="loadPositions()" :disabled="positionsPending">
                </UButton>

                <UButton icon="i-lucide-plus" to="/positions/new">Añadir</UButton>
            </div>
        </div>
        <UTable ref="table" :data="positions" :columns="columns" class="w-full h-full" />

    </div>
</template>
