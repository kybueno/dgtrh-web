<script lang="ts">
export const description = "A sidebar that collapses to icons.";
export const iframeHeight = "800px";
export const containerClass = "w-full h-full";
</script>

<script setup lang="ts">
import AppSidebar from "~/components/AppSidebar.vue";
import { useAuthStore } from "~/stores/authStore";

const authStore = useAuthStore();
const sidebarCollapsed = ref(false);

onMounted(authStore.fetchLoggedUserProfile);

// Function to toggle sidebar state
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};
</script>

<template>
  <div class="flex min-h-screen">
    <!-- App Sidebar -->
    <AppSidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />

    <!-- Main Content Area -->
    <main class="flex-1 transition-all duration-300 ease-in-out w-full" :class="[sidebarCollapsed ? 'ml-16' : 'ml-64']">
      <header class="flex h-16 items-center bg-white border-b border-gray-200 px-4">
        <div class="flex items-center gap-2">
          <!-- Sidebar Toggle Button -->
          <!-- <UButton icon="i-heroicons-bars-3" color="neutral" variant="ghost" class="-ml-1" @click="toggleSidebar" /> -->

          <!-- Vertical Separator -->
          <!-- <div class="w-px h-4 bg-gray-300 mr-2"></div> -->
          <span class="text-muted">{{ $route.fullPath }}</span>
          <!-- Breadcrumb -->
          <UBreadcrumb :links="[
            { label: 'Prenóminas', to: '/payroll' },
            { label: 'Personal', to: '/people' }
          ]" class="hidden md:flex">
            <template #divider>
              <UIcon name="i-heroicons-chevron-right-20-solid" class="text-muted" />
            </template>
          </UBreadcrumb>
        </div>
      </header>

      <div class="bg-gray-50/50 rounded-xl min-h-[calc(100vh-8rem)] md:w-[calc(100vw-16rem)] p-4">
        <NuxtPage />
      </div>
    </main>
  </div>
</template>