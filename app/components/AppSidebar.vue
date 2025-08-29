<script setup lang="ts">
// Define props
const props = defineProps({
    collapsed: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['toggle']);

// Create reactive navigation data with isOpen property
const navData = reactive({
    navMain: [
        {
            title: 'Salario',
            url: '#',
            icon: 'i-heroicons-currency-dollar',
            isActive: true,
            isOpen: false,
            items: [
                {
                    title: 'Prenóminas',
                    url: '/payroll',
                },
                {
                    title: 'Catálogo de Claves',
                    url: '/incident-types',
                },
            ],
        },
        {
            title: 'Personal',
            url: '/people',
            icon: 'i-heroicons-users',
            isActive: false,
            isOpen: false,
            items: [
                {
                    title: 'Trabajadores',
                    url: '/people',
                },
                {
                    title: 'Grupos de Trabajo',
                    url: '/groups',
                },
            ],
        },
        {
            title: 'Hojas de firma',
            url: '#',
            icon: 'i-heroicons-book-open',
            isActive: false,
            isOpen: false,
            items: [
                {
                    title: 'Introduction',
                    url: '#',
                },
                {
                    title: 'Get Started',
                    url: '#',
                },
                {
                    title: 'Tutorials',
                    url: '#',
                },
                {
                    title: 'Changelog',
                    url: '#',
                },
            ],
        },
        {
            title: 'Settings',
            url: '#',
            icon: 'i-heroicons-cog-6-tooth',
            isActive: false,
            isOpen: false,
            items: [
                {
                    title: 'General',
                    url: '#',
                },
                {
                    title: 'Team',
                    url: '#',
                },
                {
                    title: 'Billing',
                    url: '#',
                },
                {
                    title: 'Limits',
                    url: '#',
                },
            ],
        },
    ],
    projects: [
        {
            name: 'Design Engineering',
            url: '#',
            icon: 'i-heroicons-cube',
        },
        {
            name: 'Sales & Marketing',
            url: '#',
            icon: 'i-heroicons-chart-bar',
        },
        {
            name: 'Travel',
            url: '#',
            icon: 'i-heroicons-map',
        },
    ],
});

// Handle navigation item clicks
const handleItemClick = (item: any) => {
    // Handle navigation logic here
    console.log('Navigating to:', item.url);
};
const authStore = useAuthStore()
const loggedWorkerInfo = authStore.loggedUserProfile.value?.worker
onMounted(authStore.fetchLoggedUserProfile)
// Handle submenu toggling
const toggleSubmenu = (item: any) => {
    item.isOpen = !item.isOpen;
};
</script>

<template>
    <aside
        class="fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out"
        :class="[collapsed ? 'w-16' : 'w-64']">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <div class="flex items-center gap-2" v-if="!collapsed">
                <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                    <img class="w-5 h-5" alt="DGT RRHH Logo" src="/favicon.svg" />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate">DGT RRHH</p>
                    <p class="text-xs text-gray-500 truncate">Direcc. Gestión Tecnológica</p>
                </div>
            </div>
            <div v-else class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 mx-auto">
                <img class="w-5 h-5" alt="DGT RRHH Logo" src="/favicon.svg" />
            </div>

            <UButton v-if="!collapsed" icon="i-heroicons-chevron-up-down-20-solid" color="neutral" variant="ghost"
                size="sm" />
        </div>

        <!-- Navigation Content -->
        <div class="flex-1 overflow-y-auto py-4">
            <!-- Main Navigation -->
            <div class="space-y-1">
                <div v-for="(item, index) in navData.navMain" :key="index">
                    <div v-if="!collapsed"
                        class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer"
                        :class="{ 'bg-gray-100': item.isActive }" @click="toggleSubmenu(item)">
                        <UIcon :name="item.icon" class="w-4 h-4 mr-3" />
                        <span class="flex-1">{{ item.title }}</span>
                        <UIcon name="i-heroicons-chevron-down-20-solid"
                            class="w-4 h-4 text-gray-400 transition-transform duration-200"
                            :class="{ 'rotate-180': item.isOpen }" />
                    </div>

                    <UTooltip v-else :text="item.title" :popper="{ placement: 'right' }">
                        <UButton :icon="item.icon" color="neutral" variant="ghost" class="w-full justify-center"
                            :class="{ 'bg-gray-100': item.isActive }" />
                    </UTooltip>

                    <!-- Submenu Items -->
                    <div v-if="!collapsed && item.isOpen" class="ml-4 mt-1 space-y-1">
                        <NuxtLink :to="subItem.url" v-for="(subItem, subIndex) in item.items" :key="subIndex"
                            class="flex items-center px-4 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100 cursor-pointer"
                            @click="handleItemClick(subItem)">
                            <span class="truncate">{{ subItem.title }}</span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
        <!-- Footer with User Info -->
        <div class="p-4 border-t border-gray-200">
            <template v-if="!collapsed">
                <NavUser v-if="authStore.loggedUserProfile.value"
                    :worker-info="authStore.loggedUserProfile.value.worker" />
                <!-- <div class="flex items-center" >
                    <UAvatar src="https://avatars.githubusercontent.com/u/carlosepcc" :alt="loggedWorkerInfo?.first_name" size="sm" />
                    <div class="ml-3 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{loggedWorkerInfo?.first_name }} {{loggedWorkerInfo?.middle_name &&loggedWorkerInfo?.middle_name[0]+'.' }}  {{loggedWorkerInfo?.last_name }}</p>
                        <p class="text-xs text-gray-500 truncate">{{loggedWorkerInfo?.email }}</p>
                    </div>
                    <UButton icon="i-heroicons-cog-6-tooth" color="neutral" variant="ghost" size="sm" class="ml-auto" />
                </div> -->
            </template>
            <UTooltip v-else text="User Settings" :popper="{ placement: 'right' }">
                <UButton icon="i-heroicons-user" color="neutral" variant="ghost" class="w-full justify-center" />
            </UTooltip>
        </div>
    </aside>
</template>