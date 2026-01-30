<script setup lang="ts">
definePageMeta({
  title: 'Inicio de Sesión UCI'
})
useHead({
  title: 'Inicio de Sesión UCI'
})

const supabase = useSupabaseClient()
const username = ref('')

const signInWithOtp = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    email: username.value + '@uci.cu',
    options: {
      emailRedirectTo: 'http://dgtrrhh.pages.dev/',
    }
  })
  if (error) console.log(error)
}
</script>
<template>
  <div>
    <Button @click="signInWithOtp">
      Iniciar sesión
    </Button>
    <Label>
      Nombre de usuario UCI
      <Input v-model="username" />
    </Label>
  </div>
</template>
