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
  <div>
    <OrganizationsForm></OrganizationsForm>
  </div>
</template>

