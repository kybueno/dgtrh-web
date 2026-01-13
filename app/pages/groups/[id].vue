<template>
    <div class="flex flex-col p-4 gap-4">
        <div class="flex gap-2 items-center">
            <UButton icon="mdi:arrow-back" variant="ghost" color="neutral" to="/groups" />
            <h2>Detalles del Grupo de Trabajo</h2>
        </div>
        <UCard v-if="group" @click="navigateTo('/groups/' + group.id)" class="cursor-pointer">
            <template #header>
                <strong>{{ group.name }}</strong>
                <div class="text-muted text-sm">
                    <p>Jefe: {{ getProfileDisplayName(group.leader) }}</p>
                    <p>{{ group.leader.email }}</p>
                </div>
            </template>
            <div class="flex justify-between items-center mb-1">
                <p class="text-sm font-semibold">Miembros</p>
                <UButton icon="mdi:add" variant="ghost" color="neutral" />
            </div>
            <UFormField class="mb-2" label="Añadir nuevo miembro">
                <div class="flex gap-1">
                    <USelect class="w-full" label-key="first_name" value-key="id" v-model="newMemberId"
                        :items="workersNotMembers" />
                    <UButton v-if="newMemberId" variant="subtle" color="neutral" @click="handleAddNewMember()">Añadir
                    </UButton>
                </div>
            </UFormField>
            <div class="space-y-1">
                <template v-for="member in group.workers">
                    <UButton class="block w-full text-start" variant="soft" color="neutral">
                        <p>
                            {{ getProfileDisplayName(member)
                            }}
                        </p>
                        <p class="text-muted">{{ member.email }}</p>
                    </UButton>
                </template>
            </div>
            <template #footer>
                <div class="flex justify-end">
                    <UButton @click="handleDeleteGroup(group)" icon="mdi:delete" color="neutral" variant="ghost"
                        size="sm" label="Eliminar grupo" />
                </div>
            </template>
        </UCard>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
  title: 'Detalles del Grupo'
})
const group = ref<WorkGroupInfo | undefined>()
const route = useRoute()
const newMemberId = ref<UUID | undefined>()
const workerStore = useWorkerStore()
const workersNotMembers = computed(() => {
    if (!group.value) return
    const membersIds = group.value.workers.map(member => member.id)
    return workerStore.workers.filter((worker) => !membersIds.includes(worker.id))
})

onMounted(async () => {
    let paramId = Number(route.params.id)
    if (isNaN(paramId)) return
    if (!workGroups.value.length) await loadGroups()
    group.value = getGroupById(paramId)
    if (!workerStore.workers.length) workerStore.loadWorkers()
})

function handleDeleteGroup(group: WorkGroupInfo) {
    if (confirm(`¿Está seguro de que desea eliminar el grupo ${group.name}? (Tiene ${group.workers.length} miembros)`)) deleteGroup(group.id)
}

async function handleAddNewMember() {
    // workerStore TODO: Update worker with the new group and refetch group
}
</script>