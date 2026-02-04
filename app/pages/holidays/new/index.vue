<template>
    <div  class="center flex flex-col w-full max-w-sm gap-2">
        <Card>
            <CardHeader>
                <CardTitle>Registrar Trabajador</CardTitle>   
            </CardHeader>
            <CardContent>
                <fieldset class="flex flex-col w-full max-w-sm gap-1.5">
                    <div class="flex flex-col gap-2">

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
definePageMeta({
  title: 'Nueva Vacaciones'
})
useHead({
  title: 'Nueva Vacaciones'
})

import { useWorkerStore } from '~/stores/workerStore'

const workerStore = useWorkerStore()

onMounted(() => workerStore.loadWorkers())

</script>
