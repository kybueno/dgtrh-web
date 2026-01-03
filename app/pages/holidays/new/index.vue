<template>
    <div  class="center flex flex-col w-full max-w-sm gap-2">
        <Card>
            <CardHeader>
                <CardTitle>Registrar Trabajador</CardTitle>   
            </CardHeader>
            <CardContent>
                <fieldset class="flex flex-col w-full max-w-sm gap-1.5">
                    <div class="flex flex-col gap-2">

                        <label> NoExp:
                        <UInput  placeholder="0000000"/>
                    </label>

                    
                        <label> Nombre y Apellidos:
                        <UInput  placeholder="Nombre del trabajador"/>
                    </label>

                    <label> Área:
                        <UInput  placeholder="Área a la que pertenece"/>
                    </label>

                    <label> Desde:
                        <UInput  placeholder=""/>
                    </label>

                    <label> Hasta:
                        <UInput  placeholder=""/>
                    </label>

                    <label> Tiempo:
                        <UInput  placeholder="Días"/>
                    </label>

                    <label> Incorporación:
                        <UInput  placeholder="Fecha de incorporación"/>
                    </label>

                    <label> Motivo:
                        <UInput  placeholder=""/>
                    </label>

                    


                    </div>

                         
                    
                    <CardDescription>Los campos marcados con (*) son requeridos.</CardDescription>
                    <UButton >
                        Añadir trabajador
                    </UButton>


                </fieldset>
            </CardContent>

        </Card>

    </div>

</template>

<script setup lang="ts">
import { useWorkerStore } from '~/stores/workerStore'
const supabase = useSupabaseClient()

const workerStore = useWorkerStore()

onMounted(() => workerStore.loadWorkers())

</script>