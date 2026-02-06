<script setup lang="ts">
import { loadGroups, workGroups } from '@/stores/groupStore'
const workerStore = useWorkerStore();

const formData = ref<WorkerInsert>({
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    record_number: '',
    second_last_name: '',
    ci: '',
    organizations_codes: [],
    level: null,
    address: null,
    gender: null,
    tel: null,
    position_code: null,
    group_id: null,
})

const loading = ref(false)

function getCiError(ci: string | null | undefined) {
    if (!ci) return 'El CI es obligatorio.'
    if (!/^\d{11}$/.test(ci)) return 'El CI debe tener exactamente 11 dígitos.'
    return null
}

function getEmailError(email: string | null | undefined) {
    if (!email) return null
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return 'El correo no es válido.'
    return null
}

function getTelError(tel: string | null | undefined) {
    if (!tel) return null
    if (!/^\\d+$/.test(tel)) return 'El teléfono solo puede tener números.'
    return null
}

function getRecordNumberError(value: string | null | undefined) {
    if (!value) return null
    if (!/^[A-Z0-9-]+$/.test(value)) return 'El expediente solo puede tener letras mayúsculas, números o guiones.'
    return null
}

function sanitizeRecordNumber(value: string) {
    return value.toUpperCase().replace(/[^A-Z0-9-]/g, '')
}

function sanitizeCi(value: string) {
    return value.replace(/\D/g, '').slice(0, 11)
}

async function handleAddWorker() {
    const ciError = getCiError(formData.value.ci)
    const emailError = getEmailError(formData.value.email)
    const telError = getTelError(formData.value.tel)
    const recordNumberError = getRecordNumberError(formData.value.record_number)
    const secondLastNameError = !formData.value.second_last_name ? 'El segundo apellido es obligatorio.' : null

    const firstError = ciError || emailError || telError || recordNumberError || secondLastNameError
    if (firstError) {
        notifyWarning({ title: 'Validación', description: firstError })
        return
    }
    loading.value = true
    try {
        const payload = {
            ...formData.value,
            group_id: formData.value.group_id ?? null,
        }
        await workerStore.createWorker(payload);

        formData.value = {
            email: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            record_number: '',
            second_last_name: '',
            ci: '',
            organizations_codes: [],
            level: null,
            address: null,
            gender: null,
            tel: null,
            position_code: null,
            group_id: null,
        };

        navigateTo('/people')
    } catch (error) {
        console.error('Error al crear trabajador:', error);
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    if (!organizations.value.length) loadOrganizations()
    if (!positions.value.length) loadPositions()
    loadGroups()
})
</script>

<template>
    <div class="flex flex-col w-fit max-w-2xl mx-auto justify-center">
        <FormCard icon="mdi:user-plus" heading="Registrar nuevo trabajador"
            description="Complete el formulario para registrar un nuevo trabajador" @done="handleAddWorker"
            @cancel="navigateTo('/people')">

            <div class="grid grid-cols-2 gap-4 p-2">
                <!-- Primer Nombre -->
                <UFormField label="Primer Nombre *" class="col-span-1">
                    <UInput v-model="formData.first_name" required />
                </UFormField>

                <!-- Segundo Nombre -->
                <UFormField label="Segundo Nombre" class="col-span-1">
                    <UInput v-model="formData.middle_name" />
                </UFormField>

                <!-- Primer Apellido -->
                <UFormField label="Primer Apellido *" class="col-span-1">
                    <UInput v-model="formData.last_name" required />
                </UFormField>

                <!-- Segundo Apellido -->
                <UFormField label="Segundo Apellido" class="col-span-1">
                    <UInput v-model="formData.second_last_name" required />
                </UFormField>

                <!-- CI -->
                <UFormField label="Carnet de Identidad *" class="col-span-1">
                    <UInput
                        :model-value="formData.ci"
                        @update:model-value="(value) => (formData.ci = sanitizeCi(value || ''))"
                        required
                        maxlength="11"
                        inputmode="numeric"
                        autocomplete="off"
                    />
                </UFormField>

                <!-- Número expediente -->
                <UFormField label="Número de expediente" class="col-span-1">
                    <UInput :model-value="formData.record_number"
                        @update:model-value="(value) => (formData.record_number = sanitizeRecordNumber(value || ''))"
                        pattern="[A-Z0-9-]+" autocomplete="off" />
                </UFormField>

                <!-- Nivel -->
                <UFormField class="col-span-2" label="Nivel educativo">
                    <USelect class="w-full"
                        :items="(EDUCATION_LEVELS as unknown as EducationLevel[]).map(e => ({ value: e.code, label: e.label, description: e.description }))"
                        v-model="(formData.level as EducationLevelCode)">
                    </USelect>
                </UFormField>

                <!-- Dirección -->
                <UFormField label="Dirección" class="col-span-2">
                    <UTextarea class="w-full" v-model="formData.address" />
                </UFormField>

                <!-- Email -->
                <UFormField label="Correo Electrónico" class="col-span-1">
                    <UInput v-model="formData.email" type="email" autocomplete="email" />
                </UFormField>

                <!-- Teléfono -->
                <UFormField label="Teléfono" class="col-span-1">
                    <UInput v-model="formData.tel" inputmode="numeric" pattern="\\d+" autocomplete="tel" />
                </UFormField>

                <!-- Género -->
                <UFormField label="Género" class="col-span-1">
                    <USelect class="w-full" :items="GENDER_OPTIONS" value-key="value" label-key="label"
                        v-model="(formData.gender as GenderCode)" />
                </UFormField>

                <!-- Organizaciones -->
                <UFormField class="col-span-2" label="Organizaciones">
                    <USelect multiple class="w-full"
                        :items="organizations.map(o => ({ img: o.img, value: o.code, label: o.acronym || o.code?.toUpperCase(), description: o.name || '' }))"
                        v-model="formData.organizations_codes" :loading="organizationsPending"
                        :disabled="organizations.length == 0">
                        <span v-for="o in formData.organizations_codes">{{ o.toUpperCase() }}</span>
                        <template #item-leading="{ item }">
                            <UAvatar :src="item.img || undefined" :alt="item.label || undefined" />
                        </template>
                        <template #content-top>
                            <UButton to="/organizations/new" color="neutral" variant="ghost" icon="mdi:plus">Nueva
                                organización</UButton>
                        </template>
                    </USelect>
                </UFormField>

                <!-- Cargo -->
                <UFormField label="Cargo que ocupa" class="col-span-2">
                    <USelect required v-model="(formData.position_code as number | undefined)"
                        :items="positions.map(p => ({ value: p.code, label: p.description }))" class="w-full">
                        <!-- <template #content-top>
                            <UButton to="/positions/new" color="neutral" variant="ghost" icon="mdi:plus">Nuevo cargo
                            </UButton>
                        </template> -->
                    </USelect>
                </UFormField>

                <!--Grupo de Trabajo-->
                <UFormField label="Grupo de Trabajo" class="col-span-2">
                    <USelect v-model="formData.group_id" :items="workGroups" class="w-full" value-key="id"
                        label-key="name">
                        <template #content-top>
                            <UButton to="/groups/new" color="neutral" variant="ghost" icon="mdi:plus">Nuevo grupo
                            </UButton>
                        </template>
                    </USelect>
                </UFormField>

                <!-- Estado -->
                <UFormField label="Estado" class="col-span-2">
                    <USelect required v-model="formData.status" :items="WORKER_STATUS_OPTIONS" class="w-full" />
                </UFormField>
            </div>
            <template #actions>
                <UButton type="submit" color="primary" :loading="loading">
                    {{ loading ? 'Guardando...' : 'Registrar Trabajador' }}
                </UButton>
            </template>
        </FormCard>
    </div>
</template>
