<template>
    <div class="flex flex-col p-4 gap-4">
        <div class="flex gap-2 items-center">
            <UButton icon="mdi:arrow-back" variant="ghost" color="neutral" to="/groups" />
            <h2>Detalles del Grupo de Trabajo</h2>
        </div>
        <UCard v-if="group" @click="navigateTo('/groups/' + group.id)" class="cursor-pointer max-w-sm" variant="subtle">
            <template #header>
                <strong>{{ group.name }}</strong>
                <div class="text-muted text-sm">
                    <p>Jefe: {{ getDisplayName(group.leader) }}</p>
                    <p>{{ group.leader.email }}</p>
                </div>
            </template>
           
            <UFormField class="mb-2" label="Añadir miembro">
                <div class="flex gap-1">
                    <USelect placeholder="Seleccione un trabajador" class="w-full" label-key="first_name" value-key="id" v-model="newMemberId"
                        :items="workersNotMembers" />
                    <UButton v-if="newMemberId" variant="subtle" color="neutral" @click="handleAddNewMember(newMemberId,group.id)">Añadir
                    </UButton>
                </div>
            </UFormField> 
            <div v-if="group.workers.length>0" class="flex justify-between items-center mb-1">
                <p class="text-sm font-semibold">Miembros</p>
                <!-- <UButton icon="mdi:add" variant="ghost" color="neutral" /> -->
            </div>
            <div class="space-y-1">
                <template v-for="member in group.workers">
                    <div class="flex justify-between w-full text-start p-2 rounded-md">
                        <div>
                            <p>
                                {{ getDisplayName(member)
                                }}
                            </p>
                            <p class="text-muted">{{ member.email }}</p>
                        </div>
                        <UButton icon="mdi:close" color="neutral" variant="ghost" size="sm" title="Retirar miembro de este grupo" @click="handleRemoveMember(member.id)" />
                    </div>
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
useHead({
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

async function handleAddNewMember(workerId:string,groupId?:number) {
    // workerStore TODO: Update worker with the new group and refetch group
    let updatedWorkerData = {group_id:groupId ?? group.value?.id}
    await updateWorker(workerId,updatedWorkerData).then(async()=>{
        await loadGroups()
        group.value = getGroupById(Number(route.params.id))
    }).catch((error)=>{
     useToast().add({title:"Error añadiendo usuario al grupo",description:error.message,color:"error"})
    })
}
async function handleRemoveMember(workerId:string) {
    // workerStore TODO: Update worker with the new group and refetch group
    await updateWorker(workerId,{group_id:null}).then(async()=>{
        await loadGroups()
        group.value = getGroupById(Number(route.params.id))
    }).catch((error)=>{
     useToast().add({title:"Error retirando usuario del grupo",description:error.message,color:"error"})
    })
}
</script>