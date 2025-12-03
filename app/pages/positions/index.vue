<script lang="ts" setup>
import { UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';


onMounted(loadPositions);

function handleDeletePosition(position:PositionInfo){
    if(confirm(`¿Está seguro de que desea eliminar el cargo ${position.description}?`)) deleteGroup(position.code)
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
        header: "Código",
        cell: ({ row }) => row.original.code
    }, {
        header: "Descripción",
        cell: ({ row }) => row.original.description
    }, {
        header: "Categoría",
        cell: ({ row }) => row.original.category
    }, {
        header: "Cantidad",
        cell: ({ row }) => row.original.cant
    }, {
        header: "Nivel",
        cell: ({ row }) => row.original.level
    }, {
        header: "Grupo/Escala",
        cell: ({ row }) => row.original.group_escale
    },
]



</script>

<template>
    <UButton
                        icon="mdi:refresh"
                        variant="ghost"
                        @click="loadPositions()"
                        :disabled="positionsPending"
                    ></UButton>
    <p v-if="positionsPending">Cargando cargos</p>
   
  <div class="flex items-center justify-between p-2">
                <h3 class="font-semibold text-lg">Anexo 14</h3>
            </div>
                <div class="flex gap-2">
                    <UButton icon="i-lucide-plus" to="/positions/new">Añadir</UButton>             
            </div>
 <UTable :data="positions" :columns="columns" class="w-full h-full" /> 

    
  
  
</template>



