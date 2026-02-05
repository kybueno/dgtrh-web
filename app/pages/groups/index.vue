<script setup lang="ts">
definePageMeta({
  title: 'Grupos de trabajo'
})
useHead({
  title: 'Grupos de trabajo'
})


onMounted(loadGroups);

function handleDeleteGroup(group:WorkGroupInfo){
    if(confirm(`¿Está seguro de que desea eliminar el grupo ${group.name}? (Tiene ${group.workers.length} miembros)`)) deleteGroup(group.id)
}
</script>

<template>
    <div class="flex flex-col w-full">
        <div class="max-w-6xl mx-auto p-6 w-full">
            <!-- Encabezado -->
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-lg font-semibold">Grupos de trabajo</h2>
                <div class="space-x-2">
                    <UButton
                        icon="mdi:refresh"
                        variant="ghost"
                        @click="loadGroups()"
                        :disabled="groupsPending"
                    ></UButton>
                    <UButton icon="mdi:add" to="/groups/new" variant="subtle"
                        >Crear nuevo grupo</UButton
                    >
                </div>
            </div>

            <!-- Contenedor de grupos -->
            <div v-if="!groupsPending && workGroups.length === 0">
                <EmptyState
                    message="No hay grupos de trabajo para mostrar"
                    @retry="loadGroups()"
                />
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <template v-if="groupsPending">
                    <USkeleton v-for="i in 6" class="h-52" />
                </template>

                <template v-for="group in workGroups" :key="group.id" >
                    <UCard variant="subtle" @click="navigateTo('/groups/'+group.id)" class="cursor-pointer">
                        <template #header>
                            <strong>{{ group.name }}</strong>
                            <p class="text-muted text-sm">
                                Jefe: {{ getDisplayName(group.leader) }}
                            </p>
                        </template>
                            <div class="flex justify-between items-center mb-1">
                                <p class="text-sm font-semibold">Miembros</p>
                                <!-- <UButton icon="mdi:add" variant="ghost" color="neutral" /> -->
                            </div>
                            <div class="space-y-1">
                                <template v-for="member in group.workers">
                                    <UButton class="block w-full text-start" variant="soft" color="neutral">{{ getDisplayName(member) }}</UButton>
                                </template>
                            </div>
                        <template #footer >
                            <div class="flex justify-end">
                                <UButton
                                    @click="handleDeleteGroup(group)"
                                    icon="mdi:delete"
                                    color="neutral"
                                    variant="ghost"
                                    size="sm"
                                    label="Eliminar grupo"
                                />
                            </div>
                        </template>
                    </UCard>
                </template>
            </div>
        </div>
    </div>
</template>
