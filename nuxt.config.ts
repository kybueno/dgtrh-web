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
    "nuxt-pdfmake",
  ],
  css: ["~/assets/css/main.css"],
  imports: {
    // Auto-import pinia stores defined in `~/stores`
    dirs: ["stores"],
  },
  icon: {
    serverBundle: "local",
    clientBundle: {
      // list of icons to include in the client bundle
      icons: ["mdi:add", "mdi:refresh"],

      // scan all components in the project and include icons
      scan: true,

      // include all custom collections in the client bundle
      includeCustomCollections: true,

      // guard for uncompressed bundle size, will fail the build if exceeds
      sizeLimitKb: 256,
    },
  },
  vite: { plugins: [tailwindcss()] },
  app: {
    head: {
      link: [{ rel: "icon", type: "x-icon/ico", href: "/favicon.svg" }], 
      titleTemplate: "%s | DGTRH"
    },
  },
  //ssr:false,//Disable SSR because it causes hydration mismatches with NuxtUI USelect item labels when there are object fields with names like label and description
    supabase: {
    redirectOptions: {
      login: "/auth/login",
      callback: "/confirm",
      include: undefined,
      exclude: ["/auth/*"],
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
