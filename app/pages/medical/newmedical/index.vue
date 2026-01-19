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

                    <label> Inicio:
                        <UInput  placeholder="Inicial/Cont"/>
                    </label>

                    <label> Desde:
                        <UInput  placeholder=""/>
                    </label>

                    <label> Hasta:
                        <UInput  placeholder=""/>
                    </label>

                    <label> Enfermedad:
                        <UInput  placeholder="Días"/>
                    </label>

                    <label> Entrada:
                        <UInput  placeholder="Fecha de incorporación"/>
                    </label>

                    <label> Firma:
                        <UInput  placeholder=""/>
                    </label>

                    <label> Dias en prenomina:
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
definePageMeta({
  title: 'Nuevo Certificado Médico'
})
useHead({
  title: 'Nuevo Certificado Médico'
})

import { useWorkerStore } from '~/stores/workerStore'
const supabase = useSupabaseClient()

const workerStore = useWorkerStore()

onMounted(() => workerStore.loadWorkers())

</script>