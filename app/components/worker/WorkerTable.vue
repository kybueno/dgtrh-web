<script setup lang="ts">
import { UCheckbox } from '#components';
import type { TableColumn } from '@nuxt/ui';

const selectedRows = ref<WorkerInfo[]>([])
const showConfirm = ref(false)
const workerToDelete = ref<WorkerInfo | null>(null)

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
        cell: ({ row }) => h('span', { class: "cursor-pointer", onClick: () => navigateTo('/people/' + row.original.email?.split('@').at(0)) }, `${row.original.first_name} ${row.original.middle_name && row.original.middle_name.at(0) + '.'}  ${row.original.last_name}  ${row.original.second_last_name}`)
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
        cell: ({ row }) => row.original.parent1_name
    }, {
        header: "Madre",
        cell: ({ row }) => row.original.parent2_name
    }, {
        header: "Dirección",
        cell: ({ row }) => row.original.address
    }, {
        header: "Organizaciones de masa",
        cell: ({ row }) => row.original.organization_codes
    },
]


</script>
<template>
    <UCard>
        <template #header>

            <div class="flex justify-between">
                <UInput placeholder="Busca.." />
                <div class="flex gap-2">
                    <UButton icon="i-lucide-plus" to="people/neworker" >Añadir</UButton>
                    <UButton variant="soft" color="neutral" icon="i-lucide-refresh-cw"/>



                </div>
            </div>
        </template>
        <div class="p-6 space-y-6">
	  <h1 class="text-center text-xl font-bold">
		UNIVERSIDAD DE LAS CIENCIAS INFORMÁTICAS
	  </h1>
	  <h2 class="text-center font-semibold">
		Listado de Trabajadores
	  </h2>
        </div>
        <UTable :data="data" :columns="columns" sticky class="h-96" />

        <UModal v-model="showConfirm">
      <UCard>
        <template #header>
          <h3 class="text-center text-lg font-semibold text-red-600">
            Confirmar eliminación
          </h3>
        </template>

        <p class="text-center">
          ¿Estás segura de eliminar al trabajador
          <strong>{{ workerToDelete?.first_name }} {{ workerToDelete?.last_name }}</strong>?
        </p>

        <template #footer>
          <div class="flex justify-center gap-4 mt-4">
            <UButton  >Aceptar</UButton>
            <UButton  @click="showConfirm = false">Cancelar</UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    </UCard>
    
</template>