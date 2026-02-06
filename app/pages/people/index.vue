<script setup lang="ts">
import { workers, loadWorkers, workersPending } from '~/stores/workerStoreC'
import type { WorkerStatus } from '~~/prisma/generated/enums'

definePageMeta({
    title: 'Trabajadores'
})
useHead({
    title: 'Trabajadores'
})

const viewMode = ref<'table' | 'grid'>('table')
const selectedStatus = ref<WorkerStatus | null>('active')
const selectedGender = ref<GenderValue | null>(null)
const selectedGroupId = ref<number | null>(null)
const selectedPositionCode = ref<number | null>(null)
const selectedOrganizationCode = ref<string | null>(null)

onMounted(() => {
    if (!workersPending.value && !workers.value.length) loadWorkers()
    if (!organizations.value.length) loadOrganizations()
    if (!positions.value.length) loadPositions()
    if (!workGroups.value.length) loadGroups()
})

function handleLoadWorkers() {
    if (!workersPending.value) loadWorkers()
}

const authStore = useAuthStore()

const statusOptions = computed(() => WORKER_STATUS_OPTIONS)
const genderOptions = computed(() => GENDER_OPTIONS)
const groupOptions = computed(() => workGroups.value.map((group) => ({ value: group.id, label: group.name || `Grupo ${group.id}` })))
const positionOptions = computed(() => positions.value.map((position) => ({ value: position.code, label: position.description })))
const organizationOptions = computed(() =>
    organizations.value
        .filter((org) => !!org.code)
        .map((org) => ({ value: org.code as string, label: org.acronym || org.code?.toUpperCase() || org.name || '' }))
)

const filteredWorkers = computed(() => {
    return workers.value.filter((worker) => {
        if (selectedStatus.value && worker.status !== selectedStatus.value) return false
        if (selectedGender.value && worker.gender !== selectedGender.value) return false
        if (selectedGroupId.value) {
            const isMember = worker.group_id === selectedGroupId.value
            const isLeader = worker.leaderAtGroup?.id === selectedGroupId.value
            if (!isMember && !isLeader) return false
        }
        if (selectedPositionCode.value && worker.position_code !== selectedPositionCode.value) return false
        if (selectedOrganizationCode.value && !worker.organizations_codes?.includes(selectedOrganizationCode.value)) return false
        return true
    })
})
</script>
<template>
    <div class="flex flex-col w-full p-4">
        <div class="flex items-center justify-between mb-6">
            <h3 class="font-semibold text-lg">Trabajadores</h3>
            <div class="flex items-center gap-2">
                <DataViewToggle v-model="viewMode" />
                <!-- v-if="user?.roles?.some((r)=>(['director','hr_manager'].includes(r)))"  -->
                <UButton icon="i-lucide-plus" to="people/new" variant="subtle">Nuevo trabajador</UButton>
                <UButton @click="handleLoadWorkers" variant="ghost" icon="mdi:refresh" title="Refrescar lista"
                    :disabled="workersPending" :loading="workersPending" />
            </div>
        </div>

        <div class="flex flex-wrap gap-2 pb-3">
            <ClearableSelect v-model="selectedStatus" :items="statusOptions" placeholder="Estado" class="min-w-40" />
            <ClearableSelect v-model="selectedGender" :items="genderOptions" placeholder="Género" class="min-w-40" />
            <ClearableSelect v-model="selectedGroupId" :items="groupOptions" placeholder="Grupo" class="min-w-40" v-if="groupOptions.length" />
            <ClearableSelect v-model="selectedPositionCode" :items="positionOptions" placeholder="Cargo" class="min-w-56" />
            <ClearableSelect v-model="selectedOrganizationCode" :items="organizationOptions" placeholder="Organización" class="min-w-56" />
            <UButton variant="subtle" color="primary" icon="lucide:brush-cleaning" @click="() => { selectedStatus = 'active'; selectedGender = null; selectedGroupId = null; selectedPositionCode = null; selectedOrganizationCode = null; }"></UButton>
        </div>

        <WorkerTable :loading="workersPending" :data="filteredWorkers" :view-mode="viewMode" />
    </div>
</template>
