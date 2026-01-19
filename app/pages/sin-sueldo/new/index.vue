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

                    <label> Desde:
                        <UInput  placeholder=""/>
                    </label>

                    <label> Hasta:
                        <UInput  placeholder=""/>
                    </label>

                    <label> Causas:
                        <UInput  placeholder=""/>
                    </label>


                    <label> Clave de incidencias:
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
  title: 'Nueva Licencia sin Sueldo'
})
useHead({
  title: 'Nueva Licencia sin Sueldo'
})

import { useWorkerStore } from '~/stores/workerStore'
const supabase = useSupabaseClient()

const workerStore = useWorkerStore()

onMounted(() => workerStore.loadWorkers())

</script>