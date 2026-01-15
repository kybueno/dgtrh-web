<script setup lang="ts">

const props = defineProps<{
    data: TablesUpdate<'workers'>;
    loading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'save', worker: TablesUpdate<'workers'>): void;
    (e: 'cancel'): void;
}>();

const formData = ref<TablesUpdate<'workers'>>({
    ...props.data
});

function handleSubmit() {
    emit('save', formData.value);
}

onMounted(() => {
    if (!organizations.value.length) loadOrganizations()
    if (!positions.value.length) loadPositions()
})
</script>

<template>
    <div class="flex flex-col w-fit max-w-2xl mx-auto justify-center">
        <FormCard icon="mdi:user-edit" :heading="'Actualizar: ' + getProfileDisplayName(data as any)"
            description="Actualice los datos del trabajador" @done="handleSubmit" @cancel="emit('cancel')">

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
                    <UInput v-model="formData.second_last_name" />
                </UFormField>

                <!-- CI -->
                <UFormField label="Carnet de Identidad *" class="col-span-1">
                    <UInput v-model="formData.ci" required />
                </UFormField>

                <!-- Número expediente -->
                <UFormField label="Número de expediente" class="col-span-1">
                    <UInput v-model="formData.record_number" />
                </UFormField>
                <!-- Nivel -->
                <UFormField class="col-span-2" label="Nivel educativo">
                    <USelect class="w-full" :items="(EDUCATION_LEVELS as unknown as EducationLevel[])" value-key="code"
                        label-key="label" v-model="(formData.level as EducationLevelCode)">
                        <template #item-label="{ item }">
                            <p>{{ item.label }}</p>
                            <span class="text-muted">{{ item.description }}</span>
                        </template>
                    </USelect>
                </UFormField>
                <!-- Dirección -->
                <UFormField label="Dirección" class="col-span-2">
                    <UTextarea class="w-full" v-model="formData.address" />
                </UFormField>

                <!-- Email -->
                <UFormField label="Correo Electrónico" class="col-span-1">
                    <UInput v-model="formData.email" type="email" />
                </UFormField>

                <!-- Teléfono -->
                <UFormField label="Teléfono" class="col-span-1">
                    <UInput v-model="formData.tel" />
                </UFormField>

                <!-- Género -->
                <UFormField label="Género" class="col-span-1">
                    <USelect class="w-full" :items="GENDER_OPTIONS" value-key="value"
                        label-key="label" v-model="(formData.gender as GenderCode)" />
                </UFormField>

                <!-- Organizaciones -->
                <UFormField class="col-span-2" label="Organizaciones">
                    <USelect multiple class="w-full" :items="organizations" value-key="code" label-key="code"
                        v-model="formData.organizations_codes" :loading="organizationsPending"
                        :disabled="organizations.length == 0">
                        <span v-for="o in formData.organizations_codes">{{ o.toUpperCase() }}</span>
                        <template #item-leading="{ item }">
                            <UAvatar :src="item.img || undefined" :alt="item.acronym || undefined" />
                        </template>
                        <template #item-label="{ item }">
                            <p class="mr-2">{{ item.acronym ?? item.code?.toUpperCase() }}</p>
                            <span v-if="item.name" class="text-muted">{{ item.name }}</span>
                        </template>
                        <template #content-top>
                            <UButton to="/organizations/new" color="neutral" variant="ghost" icon="mdi:plus">Nueva
                                organización</UButton>
                        </template>
                    </USelect>
                </UFormField>


                <!-- Cargo -->
                <UFormField label="Cargo que ocupa" class="col-span-2">
                    <USelect required v-model="formData.position_code" :items="positions" class="w-full"
                        value-key="code" label-key="description">
                        <template #content-top>
                            <UButton to="/positions/new" color="neutral" variant="ghost" icon="mdi:plus">Nuevo cargo
                            </UButton>
                        </template>
                    </USelect>
                </UFormField>

            </div>
            <template #actions>
                <UButton type="submit" color="primary" :loading="loading">
                    {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
                </UButton>
            </template>
        </FormCard>
    </div>
</template>
