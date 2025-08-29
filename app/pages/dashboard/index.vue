<script setup lang="ts">
import { ref } from 'vue'

import { Toggle } from 'reka-ui'
const supabase = useSupabaseClient()
const mode = ref<'login' | 'signup'>('signup') // 'login' or 'signup'
const username = ref('')
const password = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showPassword = ref(false)
const router = useRouter()
const handleAuth = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  // Derive UCI email from username
  const email = `${username.value}@uci.cu`

  try {
    if (mode.value === 'signup') {
      // Sign up new user
      const { data, error } = await supabase.auth.signUp({
        email,
        password: password.value
      })

      if (error) throw error

      successMessage.value = '¡Registro exitoso! Por favor verifica tu correo electrónico para completar el proceso.'
    } else {
      // Log in existing user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password.value
      })

      if (error) throw error

      successMessage.value = '¡Inicio de sesión exitoso! Redirigiendo...'
      // Redirect to dashboard after successful login
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Authentication error:', error)
    errorMessage.value = (error as Error).message || 'Ocurrió un error. Por favor inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}

const toggleMode = () => {
  mode.value = mode.value === 'signup' ? 'login' : 'signup'
  username.value = ''
  password.value = ''
  errorMessage.value = ''
  successMessage.value = ''
}
const authStore = useAuthStore()
</script>

<template>
  <div class="flex flex-col items-center justify-center p-4 h-[80%]">
    <template v-if="authStore.loggedUserProfile">
      <p class="font-semibold text-3xl text-gray-400">
        No hay noticias por ahora, {{
          authStore.loggedUserProfile.value?.worker?.first_name }}
      </p>
    </template>
  </div>
</template>