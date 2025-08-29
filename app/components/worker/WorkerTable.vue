<script setup lang="ts">
import type { WorkerInfo } from '~/types';

interface Props {
    data: WorkerInfo[]
}
const { data } = defineProps<Props>()
</script>
<template>
    <div class="border rounded-md overflow-auto">
        <table>
            <thead>
                <tr class="border-b text-xs text-gray-600">
                    <td class="p-1 ">Exp</td>
                    <td class="p-1 ">Nombre</td>
                    <td class="p-1 ">S Nombre</td>
                    <td class="p-1 ">Apellido</td>
                    <td class="p-1 ">S Apellido</td>
                    <td class="p-1 ">Estado</td>
                    <td class="p-1 ">Email</td>
                </tr>
            </thead>
            <tbody>
                <tr @click="navigateTo('people/' + worker.email?.split('@')[0])" :class="{ 'bg-gray-100': index % 2 }"
                    class="h-14" v-for="worker, index in data" :key="worker.id">
                    <td class="text-gray-400 font-bold text-lg text-center">{{ worker.record_number }}</td>
                    <td class="ps-2">{{ worker.first_name }}</td>
                    <td class="ps-2">{{ worker.middle_name }}</td>
                    <td class="ps-2">{{ worker.last_name }}</td>
                    <td class="ps-2">{{ worker.second_last_name }}</td>
                    <td class="ps-2">{{ worker.status }}</td>
                    <td class="ps-2">{{ worker.email }}</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>