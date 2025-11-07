<script setup lang="ts">
import { ref } from 'vue'
const supabase = useSupabaseClient()
const username = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const router = useRouter()
const handleAuth = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  // Derive UCI email from username
  const email = `${username.value}@uci.cu`

  try {
    
      // Log in existing user
      const { data, error } = await supabase.auth.signInWithOtp({
    email: username.value + '@uci.cu',
    options: {
      emailRedirectTo: 'http://localhost:3004/',
    }
  })

      if (error) throw error

      successMessage.value = '¡Inicio de sesión exitoso! Redirigiendo...'
      // Redirect to dashboard after successful login
      navigateTo('/dashboard')
    
  } catch (error) {
    console.error('Authentication error:', error)
    errorMessage.value = (error as Error).message || 'Ocurrió un error. Por favor inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}

const loggedUser = useSupabaseUser()
</script>

<template>
  <div class="flex items-center justify-center p-4 m-auto">
    <UCard variant="soft" v-if="!loggedUser" class="w-full max-w-md shadow-lg rounded-2xl overflow-hidden">
      <template #header>

          <h1 class="text-center text-2xl">
            Le damos la bienvenida
          </h1>
<p class="text-center text-muted">Al sistema de gestión de recursos humanos</p>

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
          <div class="space-y-4 flex flex-col items-center">
              <!-- <Label for="username" class="block">Nombre de usuario UCI</Label> -->
                <UInput id="username" v-model="username" 
                  placeholder="jperez" required>
                  <template #trailing>
                    <span class="text-gray-500">@uci.cu</span>
                  </template>
                </UInput>
          </div>

          <div class="m-auto w-fit">
            <UButton type="submit" class="w-full" :loading="loading">
              Iniciar sesión
            </UButton>
          </div>
        </form>

       
        <div class="mt-20 text-center">
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