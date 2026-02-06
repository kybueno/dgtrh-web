<template>
    <div class="p-4 w-full flex flex-col items-center">
        <UCard>
            <template #header>
                <strong>Registrar nuevo grupo</strong>
            </template>

            <div class="flex flex-col gap-2">

                <UFormField label="Nombre">
                    <UInput class="w-full" placeholder="Economía.." v-model="name" />
                </UFormField>
                <UFormField label="Jefe">
                    <SelectWorker
                        v-model="leaderId"
                        class="w-full"
                        :items="noLeaderWorkers"
                        :placeholder="pending ? 'Cargando..' : noLeaderWorkers.length > 0 ? 'Seleccione el jefe del grupo' : 'No hay jefes libres'"
                        :loading="loadingWorkers"
                        :disabled="noLeaderWorkers.length == 0"
                    />
                </UFormField>

            </div>

            <template #footer>
                <div class="flex gap-3 justify-between">
                    <UButton to="/groups" variant="subtle" color="neutral">
                        Cancelar
                    </UButton>
                    <UButton @click="handleAddGroup">
                        Guardar
                    </UButton>
                </div>
            </template>


        </UCard>

    </div>

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Nuevo Grupo'
})
useHead({
  title: 'Nuevo Grupo'
})
import { useWorkerStore } from '~/stores/workerStore'
const toast = useToast()

const workerStore = useWorkerStore()
const loadingWorkers = ref(false)

const noLeaderWorkers = computed<WorkerInfo[]>(() => {
    const leadersIds = workGroups.value.map((group) => group.leader.id)

    return workerStore.workers.filter((worker: WorkerInfo) => !leadersIds.includes(worker.id))
}
)


const name = ref('')
const leaderId = ref('')
const pending = ref(false)
const errorMessage = ref<string | null>(null)

async function handleAddGroup() {
    const newGroup = { leader_id: leaderId.value, name: name.value }

    pending.value = true
    const response = await addGroup(newGroup)
    pending.value = false

    if (response.data) {
        toast.add({
            title: 'Guardado con éxito',
            icon: 'mdi:check'
        })
        name.value = ''
        leaderId.value = ''
        navigateTo('/groups')
    }
    if (response.error) {
        toast.add({
            title: 'Hubo un error al guardar',
            description: response.error.message,
            color: 'error',
            icon: 'mdi:error'
        })
        errorMessage.value = response.error.message
    }
}


async function loadInitialData() {
    loadingWorkers.value = true
    await workerStore.loadWorkers()
    loadingWorkers.value = false
    loadGroups()
}

onMounted(loadInitialData)




</script>
