// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "shadcn-nuxt",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@compodium/nuxt",
    "@nuxt/ui",
  ],
  css: ["~/assets/css/main.css"],
  imports: {
    // Auto-import pinia stores defined in `~/stores`
    dirs: ["stores"],
  },
  vite: { plugins: [tailwindcss()] },
  app: {
    head: {
      link: [{ rel: "icon", type: "x-icon/ico", href: "/favicon.svg" }],
    },
  },
  supabase: {
    redirectOptions: {
      login: "/auth/login",
      callback: "/confirm",
      include: undefined,
      exclude: [],
      saveRedirectToCookie: false,
    },
    types: "./shared/types/database.types.ts",
    // clientOptions: {
    //   db: {
    //     schema: "public",
    //   },
    // },
  },
});
