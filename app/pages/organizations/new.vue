<script lang="ts" setup>
definePageMeta({
  title: 'Nueva Organización'
})
useHead({
  title: 'Nueva Organización'
})

import OrganizationsForm from '~/components/organizations/OrganizationsForm.vue';
</script>

<template>
  <Flex class="p-4 flex-col h-full items-center justify-center">
    <OrganizationsForm/>
  </Flex>
</template>

