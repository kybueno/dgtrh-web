<script setup lang="ts">
import { ref } from 'vue'
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
const loggedUser = useSupabaseUser()
</script>

<template>
  <div class="min-h-screen gradient-light from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <UCard v-if="!loggedUser" class="w-full max-w-md shadow-lg rounded-2xl overflow-hidden">
      <template #header>
        <div class="bg-primary text-primary-foreground">
          <h1 class="text-center">
            {{ mode === 'signup' ? 'Registro de Trabajador' : 'Inicio de Sesión' }}
          </h1>
        </div>
      </template>

      <div class="p-6">
        <!-- Error/Success Messages -->
        <Alert v-if="errorMessage" variant="destructive" class="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{{ errorMessage }}</AlertDescription>
        </Alert>

        <Alert v-if="successMessage" class="mb-6">
          <AlertTitle>Éxito</AlertTitle>
          <AlertDescription>{{ successMessage }}</AlertDescription>
        </Alert>

        <!-- Auth Form -->
        <form @submit.prevent="handleAuth" class="space-y-6">
          <div class="space-y-4">
            <div>
              <Label for="username">Nombre de Usuario UCI</Label>
              <div class="relative">
                <Input id="username" v-model="username" type="text" placeholder="jperez" required class="pl-8" />
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">@uci.cu</span>
              </div>
              <p class="text-sm text-muted-foreground mt-1">
                Solo tu nombre de usuario sin el dominio
              </p>
            </div>

            <div>
              <Label for="password">Contraseña</Label>
              <div class="relative">
                <Input id="password" v-model="password" :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••" required class="pr-10" />
                <Button type="button" variant="ghost" size="icon" class="absolute right-0 top-0 h-full px-3"
                  @click="showPassword = !showPassword">
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                  </svg>
                </Button>
              </div>
              <p v-if="mode === 'signup'" class="text-sm text-muted-foreground mt-1">
                Mínimo 8 caracteres con números y letras
              </p>
            </div>
          </div>

          <Button type="submit" class="w-full" :disabled="loading">
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Procesando...
            </span>
            <span v-else>
              {{ mode === 'signup' ? 'Registrarse' : 'Iniciar Sesión' }}
            </span>
          </Button>
        </form>

        <div class="mt-6 text-center text-sm">
          <p>
            {{ mode === 'signup' ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?' }}
            <Button variant="link" class="p-0 text-primary underline" @click="toggleMode">
              {{ mode === 'signup' ? 'Inicia sesión aquí' : 'Regístrate aquí' }}
            </Button>
          </p>
        </div>

        <div class="mt-6 flex items-center">
          <div class="flex-grow border-t border-gray-200"></div>
          <span class="px-4 text-sm text-muted-foreground">o</span>
          <div class="flex-grow border-t border-gray-200"></div>
        </div>

        <div class="mt-6 text-center">
          <p class="text-sm text-muted-foreground">
            ¿Problemas para acceder?
            <a href="#" class="text-primary hover:underline">Contactar a Recursos Humanos</a>
          </p>
        </div>
      </div>
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