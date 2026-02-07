<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  /* filter: blur(0.2rem); */
  filter: saturate(0);

  transform: translateY(-2rem) scale(0.98);
}
</style>
