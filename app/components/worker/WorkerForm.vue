<script setup lang="ts">
import { useWorkerStore } from '~/stores/workerStore';
const supabase = useSupabaseClient()
const workerStore = useWorkerStore();
const formData = ref<WorkerInsert>({
    email: 'jeduardo@uci.cu',
    first_name: 'Jose',
    last_name: 'Gomez',
    record_number: '25548',
    second_last_name: 'Perez',
    ci:'5445877825',
    parent1_name:'Juan',
    parent2_name:'Jo',
    middle_name:'Eduardo',
    organization_codes:['CTC'],
    level:'Tecnico',
    address:'Calle 51/ 5ta y 7ma',
    gender:'Masculino',
    tel:'55555555',   
    
})

async function handleAddWorker() {
    try {
        await workerStore.createWorker(formData.value, supabase);

        formData.value = {
            email: '',
            first_name: '',
            last_name: '',
            record_number: '',
            second_last_name: '',
            ci:'',

        };
    } catch (error) {
        console.error('Error al crear trabajador:', error);

    }
}
</script>

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
                        <UInput  placeholder="Segundo nombre" v-model="formData.middle_name"/>
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
                        <UInput  placeholder="Dirección particular" v-model="formData.address"/>
                    </label>

                    
                     <label>Sexo:
                     <UInput v-model="formData.gender" /> 
                      </label>

                    <label > Correo:
                        <UInput trailing-icon="i-lucide-at-sign" placeholder="Enter email" size="md" v-model="formData.email"/>
                    </label>

                    <label > Madre:
                        <UInput  placeholder="Nombre y apellido de la madre" v-model="formData.parent1_name"/>
                    </label>

                    <label > Padre:
                        <UInput  placeholder="Nombre y apellido del padre" v-model="formData.parent2_name"/>
                    </label>

                    <label > Número de teléfono:
                        <UInput  placeholder="tel:" v-model="formData.tel"/>
                    </label>

                    <label class="block font-medium mb-1">Cargo a ocupar:</label>
                    <select v-model="formData.position_code" class="border rounded-md p-2 w-full"> 
    
                      <option v-for="position in workerStore.workers" 
                            :key="position.id" 
                           :value="position.position_code">
                            {{ position.position_code }}
                               </option>
                    </select>


                    <label > Grupo de Trabajo a pertenecer:
                        <UInput  placeholder="Grupo de Trabajo al que va a pertenecer el trabajador" v-model="formData.group_id"/>
                    </label>

                    <label class="block font-medium mb-1">Organización de masas:</label>
                    <select v-model="formData.organization_codes" class="w-full border rounded-md p-2">
                     
                    <option 
                       v-for="masa in workerStore.workers" 
                       :key="masa.id" 
                       :value="masa.organization_codes"
                         >
                            {{ masa.organization_codes }}
                     </option>
                    </select>

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

