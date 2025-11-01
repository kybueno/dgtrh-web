<template>
    <div  class="center flex flex-col w-full max-w-sm gap-2">
        <Card>
            <CardHeader>
                <CardTitle>Registrar nuevo Trabajador</CardTitle>   
            </CardHeader>
            <CardContent>
                <fieldset class="flex flex-col w-full max-w-sm gap-1.5">
                    <div class="flex flex-col gap-2">

                    <label> Primer Nombre:
                        <UInput  placeholder="Introduzca el nombre" v-model="formData.first_name"/>
                    </label>

                    <label> Segundo Nombre:
                        <UInput  placeholder="Segundo nombre"/>
                    </label>

                    <label> Primer Apellidos:
                        <UInput  placeholder="Apellidos" v-model="formData.last_name"/>
                    </label>

                    <label> Segundo Apellidos:
                        <UInput  placeholder="Apellidos" v-model="formData.second_last_name"/>
                    </label>

                    <label > Carnet de Identidad:
                        <UInput  placeholder="CI" v-model="formData.ci"/>
                    </label>

                    <label > Número de expediente:
                        <UInput  placeholder="Expediente laboral" v-model="formData.record_number"/>
                    </label>

                    <label > Dirección:
                        <UInput  placeholder="Dirección particular"/>
                    </label>

                    <label > Sexo:
                        <UCheckbox  label="Femenino" />
                        <UCheckbox  label="Masculino" />
                    </label>

                    <label > Correo:
                        <UInput trailing-icon="i-lucide-at-sign" placeholder="Enter email" size="md" v-model="formData.email"/>
                    </label>

                    <label > Madre:
                        <UInput  placeholder="Nombre y apellido de la madre"/>
                    </label>

                    <label > Padre:
                        <UInput  placeholder="Nombre y apellido del padre"/>
                    </label>

                    <label > Número de teléfono:
                        <UInput  placeholder="tel:" />
                    </label>

                    <label > Cargo a ocupar:
                        <UInput  placeholder="Cargo que va a ocupar el trabajador"/>
                    </label>

                    <label > Grupo de Trabajo a pertenecer:
                        <UInput  placeholder="Grupo de Trabajo al que va a pertenecer el trabajador"/>
                    </label>

                    <label > Organizaciones de masa:
                        <UInput  placeholder="Organizaciones de masa a la que pertenece"/>
                    </label>
                    </div>                    
                    
                    <CardDescription>Los campos marcados con (*) son requeridos.</CardDescription>
                    <UButton @click="handleAddWorker()" >
                        Añadir trabajador
                    </UButton>


                </fieldset>
            </CardContent>

        </Card>

    </div>

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