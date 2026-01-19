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
                    
                    <h2>1ra.Prenatal</h2>

                    <label> Desde:
                        <UInput  placeholder=""/>
                    </label>

                    <label> Hasta:
                        <UInput  placeholder=""/>
                    </label>

                    <label> Pago en:
                        <UInput  placeholder=""/>
                    </label>

                    <h2>1ra.Posnatal</h2>

<label> Desde:
    <UInput  placeholder=""/>
</label>

<label> Hasta:
    <UInput  placeholder=""/>
</label>

<label> Pago en:
    <UInput  placeholder=""/>
</label>


<h2>2da.Posnatal</h2>

<label> Desde:
    <UInput  placeholder=""/>
</label>

<label> Hasta:
    <UInput  placeholder=""/>
</label>

<label> Pago en:
    <UInput  placeholder=""/>
</label>

<h2>Presentación Social</h2>
                    <label> Desde:
                        <UInput  placeholder="Fecha de incorporación"/>
                    </label>

                    <label> Hasta:
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
  title: 'Nueva Licencia de Maternidad'
})
useHead({
  title: 'Nueva Licencia de Maternidad'
})

import { useWorkerStore } from '~/stores/workerStore'
const supabase = useSupabaseClient()

const workerStore = useWorkerStore()

onMounted(() => workerStore.loadWorkers())

</script>