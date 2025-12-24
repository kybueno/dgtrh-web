<script setup lang="ts">
import { id } from '@nuxt/ui/runtime/locale/index.js';
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
    organizations_codes:['CTC'],
    level:'Tecnico',
    address:'Calle 51/ 5ta y 7ma',
    gender:'Masculino',
    tel:'55555555', 
    position_code: 0,  
    
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

loadGroups()


</script>

<template>
    <div class="flex flex-col w-full max-w-2xl mx-auto justify-center">
      <Card class="shadow-xl rounded-2xl p-6">
        <CardHeader>
          <CardDescription>Complete el formulario para registrar un nuevo trabajador</CardDescription>
        </CardHeader>
  
        <CardContent>
          <form class="grid grid-cols-2 gap-4">
            <!-- Primer Nombre -->
            <div class="flex flex-col gap-1">
              <label class="font-medium">Primer Nombre *</label>
              <UInput placeholder="Introduzca el nombre" v-model="formData.first_name" error="Please enter a valid name." />
            </div>
  
            <!-- Segundo Nombre -->
            <div class="flex flex-col gap-1">
              <label class="font-medium">Segundo Nombre</label>
              <UInput placeholder="Segundo nombre" v-model="formData.middle_name" />
            </div>
  
            <!-- Primer Apellido -->
            <div class="flex flex-col gap-1">
              <label class="font-medium">Primer Apellido *</label>
              <UInput placeholder="Apellidos" v-model="formData.last_name" error="Please enter a valid name."/>
            </div>
  
            <!-- Segundo Apellido -->
            <div class="flex flex-col gap-1">
              <label class="font-medium">Segundo Apellido</label>
              <UInput placeholder="Apellidos" v-model="formData.second_last_name" error="Please enter a valid name."/>
            </div>
  
            <!-- CI -->
            <div class="flex flex-col gap-1">
              <label class="font-medium">Carnet de Identidad *</label>
              <UInput placeholder="CI" v-model="formData.ci" error="Please enter a valid ci." />
            </div>
  
            <!-- Número expediente -->
            <div class="flex flex-col gap-1">
              <label class="font-medium">Número de expediente</label>
              <UInput placeholder="Expediente laboral" v-model="formData.record_number" error="Please enter a valid record number." />
            </div>
  
            <!-- Dirección -->
            <div class="flex flex-col gap-1 col-span-2">
              <label class="font-medium">Dirección</label>
              <UInput placeholder="Dirección particular" v-model="formData.address" />
            </div>
  
            <!-- Sexo -->
            <div class="flex flex-col gap-1">
              <label class="font-medium">Sexo</label>
              <UInput v-model="formData.gender" />
            </div>
  
            <!-- Correo -->
            <div class="flex flex-col gap-1">
              <label class="font-medium">Correo *</label>
              <UInput trailing-icon="i-lucide-at-sign" placeholder="Email" v-model="formData.email" error="Please enter a valid email address." />
            </div>
  
            <!-- Madre -->
            <div class="flex flex-col gap-1">
              <label class="font-medium">Madre</label>
              <UInput placeholder="Nombre y apellido" v-model="formData.parent1_name" />
            </div>
  
            <!-- Padre -->
            <div class="flex flex-col gap-1">
              <label class="font-medium">Padre</label>
              <UInput placeholder="Nombre y apellido" v-model="formData.parent2_name" />
            </div>
  
            <!-- Teléfono -->
            <div class="flex flex-col gap-1 col-span-2">
              <label class="font-medium">Número de teléfono</label>
              <UInput placeholder="tel:" v-model="formData.tel" error="Please enter a valid phone."/>
            </div>
  
            <!-- Cargo -->
            <div class="flex flex-col gap-1 col-span-2">
              <label class="font-medium">Cargo a ocupar *</label>
              <USelectMenu v-model="formData.position_code" :items="positions" class="w-48" value-key="codigo" label-key="descripcion" >
              <template #content-top>
                <UButton to="/positions/new" color="neutral">Añadir</UButton>
              </template>
              </USelectMenu>
            </div>
  
            <!-- Grupo de trabajo -->
            <div class="flex flex-col gap-1 col-span-2">
              <label class="font-medium">Grupo de Trabajo</label>
              <USelectMenu v-model="formData.group_id" :items="workGroups" class="w-48" value-key="id" label-key="name">
                <template #content-top>
                <UButton to="/groups/new" color="neutral">Añadir</UButton>
              </template>
              </USelectMenu>
              </div>
  
            <!-- Organización de masas -->
            <div class="flex flex-col gap-1 col-span-2">
              <label class="font-medium">Organizaciones de masas</label>
              <USelectMenu v-model="formData.organizations_codes" :items="organizations" class="w-48" value-key="code" label-key="acronym" multiple>
                <template #content-top>
                <UButton to="/organizations/new" color="neutral">Añadir</UButton>
              </template>
              </USelectMenu>
            </div>
          </form>
  
          <CardDescription class="mt-4">Los campos marcados con (*) son requeridos.</CardDescription>
         

  
          <div class="flex justify-end gap-3 mt-6">
            <UButton to="/people">Cancelar</UButton>
            <UButton @click="handleAddWorker" color="primary">Registrar Trabajador</UButton>
          </div>
        </CardContent>
      </Card>
    </div>
  </template>
  