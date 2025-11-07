<script setup lang="ts">
const supabase = useSupabaseClient()
const username = ref('')

const signInWithOtp = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    email: username.value + '@uci.cu',
    options: {
      emailRedirectTo: 'http://localhost:3004/',
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
