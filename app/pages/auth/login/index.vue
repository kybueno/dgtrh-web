<script setup lang="ts">
definePageMeta({
  title: 'Inicio de Sesión'
})
useHead({
  title: 'Inicio de Sesión'
})

import { ref, computed } from 'vue'
import type { ApiError } from '~/shared/types/http'

const mode = ref<'login' | 'signup'>('login')
const username = ref('')
const password = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showPassword = ref(false)
const authStore = useAuthStore()

const loggedUser = computed(() => authStore.loggedUserProfile.value?.user)

const handleAuth = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const email = `${username.value}@uci.cu`

  try {
    if (mode.value === 'signup') {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: { email, password: password.value }
      })
      successMessage.value = '¡Registro exitoso!'
    } else {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password: password.value }
      })
      successMessage.value = '¡Inicio de sesión exitoso! Redirigiendo..'
    }

    await authStore.fetchLoggedUserProfile()
    navigateTo('/dashboard')
  } catch (error: ApiError) {
    console.error('Authentication error:', error)
    errorMessage.value =
      error?.data?.message ||
      error?.data?.statusMessage ||
      error?.message ||
      'Ocurrió un error. Por favor inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}

const toggleMode = () => {
  mode.value = mode.value === 'signup' ? 'login' : 'signup'
  errorMessage.value = ''
  successMessage.value = ''
}

onMounted(() => {
  authStore.fetchLoggedUserProfile()
})
</script>

<template>
  <Stack class="justify-between h-full">
    <div>
      <!-- Just a spacer -->
    </div>
    <div class=" flex items-center justify-center p-4 mx-auto bg-muted rounded-xl w-full max-w-lg">
      <UCard v-if="!loggedUser" class="w-full max-w-lg">
        <Stack class="text-center items-center p-4">
          <h2 class="text-center text-2xl font-bold">
            Bienvenido
          </h2>
          <p class="max-w-xs mx-auto text-muted">{{ mode === 'signup' ? 'Puede definir su contraseña' : 'Inicie su sesión en el sistema' }}</p>
        </Stack>
        <div class="p-6">
    
          <!-- Auth Form -->
          <form @submit.prevent="handleAuth" class="space-y-6">
            <div class="space-y-4 flex flex-col items-center">
              <Stack>
                <UFormField label="Nombre de usuario" hint="@uci.cu" >
                  <UInput size="xl" v-model="username" placeholder="juanperez.." class="w-full" />
                </UFormField>
                <UFormField label="Contraseña" :error="errorMessage.toLowerCase().includes('password') && errorMessage">
                  <UInput size="xl" v-model="password"  :type="showPassword ? 'text' : 'password'"
                    class="w-full" :ui="{ trailing: 'pe-1' }" required>
                    <template #trailing>
                      <UButton color="neutral" variant="link" size="sm"
                        :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                        :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" :aria-pressed="showPassword"
                        aria-controls="password" @click="showPassword = !showPassword" />
                    </template>
                  </UInput>
                </UFormField>
    
                <UButton class="mt-4 w-full justify-center" size="lg" variant="subtle" :icon="mode==='signup' ? 'mdi:account-plus-outline' : 'mdi:login'" :loading="loading" type="submit" >
                Entrar
              </UButton>
              </Stack>
    
            </div>
             <!-- Error/Success Messages -->
          <UAlert v-if="errorMessage" color="error" variant="subtle" title="¡Error!" :description="errorMessage"
            icon="lucide-user" />
          <UAlert v-if="successMessage" color="success" variant="subtle" title="¡Éxito!" :description="successMessage"
            icon="lucide-user" />
          </form>
    
        </div>
        <template #footer>
          <div class="py-5 space-y-6 text-muted">
            <HStack class="justify-center items-center">
              <p>
                {{ mode === 'signup' ? '¿Ya tiene una cuenta?' : '¿Primera vez?' }}
              </p>
                <UButton variant="soft" @click="toggleMode">
                  {{ mode === 'signup' ? 'Entre con su contraseña' : 'Defina una contraseña' }}
                </UButton>
            </HStack>
          </div>
        </template>
      </UCard>
      <template v-else>
        <NuxtLink href="/dashboard">
          <UButton>Ir al Panel de Información</UButton>
        </NuxtLink>
      </template>
    </div>
      <Box class="text-center text-muted">
                <p>¿Problemas para acceder?</p>
                <a href="mailto:" class="text-primary hover:underline whitespace-nowrap">Contacte a Recursos Humanos</a>
            </Box>
  </Stack>
</template>

<style scoped>
.gradient-light {
  background-image: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
}
</style>
