<template>
    <form @submit.prevent="handleAddWorker()">
        <Card>
            <CardHeader>
                <CardTitle>Registrar nuevo Trabajador</CardTitle>
                <CardDescription>Los campos marcados con (*) son requeridos.</CardDescription>
            </CardHeader>
            <CardContent>
                <fieldset class="flex flex-col w-full max-w-sm gap-1.5">

                    <LabelBlock text="Primer nombre">
                        <Input />
                    </LabelBlock>
                    <LabelBlock text="Segundo Nombre">
                        <Input />
                    </LabelBlock>
                    <LabelBlock text="Sexo">
                        <Input />
                    </LabelBlock>
                    <LabelBlock text="Expediente">
                        <Input />
                    </LabelBlock>
                    <LabelBlock text="Carnet de identidad">
                        <Input />
                    </LabelBlock>
                    <LabelBlock type="phone" text="Teléfono">
                        <Input />
                    </LabelBlock>
                    <LabelBlock text="Correo UCI">
                        <Input type="email" list="emailList" />
                    </LabelBlock>

                    <LabelBlock text="Nombre del Padre">

                        <Input />
                    </LabelBlock>
                    <LabelBlock text="Nombre de la Madre">

                        <Input />
                    </LabelBlock>
                    <LabelBlock text="Dirección">

                        <Input />
                    </LabelBlock>
                    <LabelBlock text="Cargo a ocupar">

                        <Input />
                    </LabelBlock>
                    <LabelBlock text="Organizaciones de Masas">

                        <Input />
                    </LabelBlock>
                    <LabelBlock text="Nivel de preparación">

                        <Input />
                    </LabelBlock>
                    <UButton type="submit">
                        Añadir trabajador
                    </UButton>


                </fieldset>
            </CardContent>
        </Card>

    </form>
</template>

<script setup lang="ts">
import { useWorkerStore } from '~/stores/workerStore';
const supabase = useSupabaseClient()
const workerStore = useWorkerStore();
const formData = ref<WorkerInsert>({
    email: '',
    first_name: '',
    last_name: '',
    record_number: '',
    second_last_name: ''
})

async function handleAddWorker() {
    try {
        await workerStore.createWorker(formData.value, supabase);

        formData.value = {
            email: '',
            first_name: '',
            last_name: '',
            record_number: '',
            second_last_name: ''

        };
    } catch (error) {
        console.error('Error al crear trabajador:', error);

    }
}
</script>