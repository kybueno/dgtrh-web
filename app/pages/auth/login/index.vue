<script setup lang="ts">
definePageMeta({
  title: 'Inicio de Sesión'
})
useHead({
  title: 'Inicio de Sesión'
})

import { ref } from 'vue'
const supabase = useSupabaseClient()
const mode = ref<'login' | 'signup'>('login') // 'login' or 'signup'
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

      if(data.user && !data.session) successMessage.value = '¡Registro exitoso! Por favor verifica tu correo electrónico para completar el proceso.'
      if(data.user && data.session) successMessage.value = '¡Registro exitoso! Está autenticado.'
    } else {
      // Log in existing user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password.value
      })

      if (error) throw error

      if(data) {
        if(data.session) {
        successMessage.value = '¡Inicio de sesión exitoso! Redirigiendo..'
      // Redirect to dashboard after successful login
      navigateTo('/dashboard')}
      
    }
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
const loggedUser = useSupabaseUser()
</script>

<template>
  <div class=" flex items-center justify-center p-4 mx-auto">
    <UCard v-if="!loggedUser" class="w-full max-w-md shadow-lg rounded-2xl overflow-hidden">
      <template #header>
        <div class="">
          <h1 class="text-center">
            {{ mode === 'signup' ? 'Registro' : 'Inicio de Sesión' }}
          </h1>
        </div>
      </template>

      <div class="p-6">
       

        <!-- Auth Form -->
        <form @submit.prevent="handleAuth" class="space-y-6">
          <div class="space-y-4 flex flex-col items-center">

            <UFormField label="Nombre de usuario" help="Use el nombre de usuario UCI.">
              <UInput v-model="username" placeholder="Enter your email" class="w-full" />
            </UFormField>

            <UFormField label="Contraseña" :error="errorMessage.toLowerCase().includes('password') && errorMessage">
              <UInput v-model="password" placeholder="Password" :type="showPassword ? 'text' : 'password'"
                class="w-full" :ui="{ trailing: 'pe-1' }" required>
                <template #trailing>
                  <UButton color="neutral" variant="link" size="sm"
                    :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'" :aria-pressed="showPassword"
                    aria-controls="password" @click="showPassword = !showPassword" />
                </template>
              </UInput>
            </UFormField>


            <UButton class="mt-4" :loading="loading" type="submit" >

              {{ mode === 'signup' ? 'Registrarse' : 'Iniciar Sesión' }}

            </UButton>
          </div>
           <!-- Error/Success Messages -->
        <UAlert v-if="errorMessage" color="error" variant="subtle" title="¡Error!" :description="errorMessage"
          icon="lucide-user" />
        <UAlert v-if="successMessage" color="success" variant="subtle" title="¡Éxito!" :description="successMessage"
          icon="lucide-user" />
        </form>



       
      </div>
      <template #footer>
        <div class="py-2 space-y-2">
          <div class=" text-center text-sm">
            <p>
              {{ mode === 'signup' ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?' }}
              <UButton variant="link" @click="toggleMode">
                {{ mode === 'signup' ? 'Inicia sesión aquí' : 'Regístrate aquí' }}
              </UButton>
            </p>
          </div>
          <div class=" text-center">
            <p class="text-sm text-muted-foreground">
              ¿Problemas para acceder?
              <a href="#" class="text-primary hover:underline">Contactar a Recursos Humanos</a>
            </p>
          </div>
        </div>
      </template>
    </UCard>
    <template v-else>
      <NuxtLink href="/dashboard">
        <Button>Ir al Panel de Información</Button>
      </NuxtLink>
    </template>
  </div>
</template>

<style scoped>
.gradient-light {
  background-image: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
}
</style>