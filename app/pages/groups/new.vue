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
                    <USelect class="w-full" :items="noLeaderWorkers"
                        :placeholder="pending ? 'Cargando..' : noLeaderWorkers.length > 0 ? 'Seleccione el jefe del grupo' : 'No hay jefes libres'"
                        value-key="id" label-key="first_name" v-model="leaderId"
                        :loading="workerStore.workers.length < 1" :disabled="noLeaderWorkers.length == 0">
                        <template #item-label="{ item }">
                            <p>{{ getProfileDisplayName(item) }}</p>
                            <small v-if="item.email" class="text-muted">{{ item.email ?? item.tel }}</small>
                        </template>
                    </USelect>
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
import { useWorkerStore } from '~/stores/workerStore'
const toast = useToast()

const workerStore = useWorkerStore()

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


onMounted(workerStore.loadWorkers)
onMounted(loadGroups)




</script>