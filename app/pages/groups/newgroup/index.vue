<template>
    <div  class="center flex flex-col w-full max-w-sm gap-2">
        <Card>
            <CardHeader>
                <CardTitle>Registrar nuevo grupo</CardTitle>   
            </CardHeader>
            <CardContent>
                <fieldset class="flex flex-col w-full max-w-sm gap-1.5">
                    <div class="flex flex-col gap-2">

                    <label> Nombre:
                        <UInput  placeholder="Nombre de grupo" v-model="name"/>
                    </label>

                    <label> Jefe de grupo:
                        <UInput  placeholder="Nombre del jefe de grupo" v-model="leaderId"/>
                    </label>

                    <label> Integrantes:
                        <select>
                            <option v-for="workers in workerStore.workers">{{ workers.first_name }}</option>
                        </select>
                    </label>
                    


                    </div>

                         
                    
                    <CardDescription>Los campos marcados con (*) son requeridos.</CardDescription>
                    <UButton @click="handleAddGroup">
                        Añadir grupo
                    </UButton>


                </fieldset>
            </CardContent>

        </Card>

    </div>

</template>

<script setup lang="ts">
import type { id } from '@nuxt/ui/runtime/locale/index.js'
import { useWorkerStore } from '~/stores/workerStore'

const supabase = useSupabaseClient()

const workerStore = useWorkerStore()

const name = ref('')
const leaderId = ref('')

async function handleAddGroup(){
    const newGroup = {leader_id: leaderId.value, name: name.value}
 addGroup(newGroup)
}


onMounted(() => workerStore.loadWorkers(supabase))


  

</script>