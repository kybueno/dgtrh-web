<script setup lang="ts">
definePageMeta({
  title: 'Panel principal'
})
useHead({
  title: 'Panel principal'
})

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

onMounted(()=>{
  if(!workers.value.length) loadWorkers()
  if(!incidents.value.length) loadIncidents()
})

</script>

<template>
  <UContainer class="p-4 gap-8 h-full flex flex-col">
  
  <UPageGrid class="lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-px ">
    <dashboard-stat icon="mdi:account" title="Empleados" :value="workers.length"/>
    <dashboard-stat icon="mdi:alert" title="Incidencias" :value="incidents.length"/>
    <dashboard-stat icon="mdi:account-clock" title="Trabajo Extraordinario" :value="workers.length"/>
  </UPageGrid>
    <UCard class="flex-1" variant="subtle">
      <template v-if="authStore.loggedUserProfile">
        <div class="flex items-center justify-center h-full">
          <p class="font-semibold text-xl text-muted/50">
            No hay noticias por ahora, {{
              authStore.loggedUserProfile.value?.worker?.first_name }}
          </p>
        </div>
      </template>
    </UCard>
  </UContainer>
</template>