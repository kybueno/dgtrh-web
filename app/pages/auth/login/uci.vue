<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'
import Input from '~/components/ui/input/Input.vue'

const supabase = useSupabaseClient()
const username = ref('')

const signInWithOtp = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    email: username.value + '@uci.cu',
    options: {
      emailRedirectTo: 'http://localhost:3000/',
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
