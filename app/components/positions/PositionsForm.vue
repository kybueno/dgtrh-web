<template>
 <div class="flex flex-col w-full max-w-2xl mx-auto justify-center">
      <Card class="shadow-xl rounded-2xl p-6">
        <CardHeader>
          <CardDescription>Nuevo Cargo</CardDescription>
        </CardHeader>

        <CardContent>
          <form class="grid grid-cols-2 gap-4">
            
            <div class="flex flex-col gap-1">
              <label class="font-medium">Código:</label>
              <UInput placeholder="Introduzca el código del nuevo cargo" v-model="formData.code" error="Please enter a valid code." />
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-medium">Descripción:</label>
              <UInput placeholder="Introduzca la descripción del cargo" v-model="formData.description" error="Please enter a valid description." />
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-medium">Categoría:</label>
              <UInput placeholder="Introduzca la categoría" v-model="formData.category" error="Please enter a valid category." />
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-medium">Cantidad :</label>
              <UInput placeholder="Introduzca la cantidad de personas con ese cargo" v-model="formData.cant" error="Please enter a valid cant." />
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-medium">Nivel de estudio:</label>
              <UInput placeholder="Introduzca el nivel" v-model="formData.level" error="Please enter a valid level." />
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-medium">Grupo/Escala:</label>
              <UInput placeholder="Introduzca la escala a la que pertenece" v-model="formData.group_escale" error="Please enter a valid escale." />
            </div>

          </form>
        </CardContent>

        <UButton @click="addPositions()" color="primary">Guardar posición</UButton>

      </Card>
    
  </div>
</template>

<script lang="ts" setup>
import { positions } from '~/stores/positionStore';

const supabase = useSupabaseClient()

const formData = ref<PositionInsert>({
  code: 0,
  description: '',
  category: '',
  cant: 0,
  group_escale: '',
  level: '',
  value: []
})

</script>

