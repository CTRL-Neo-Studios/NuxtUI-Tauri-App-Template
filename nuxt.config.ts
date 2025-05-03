// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},

    modules: ["@nuxt/ui", "nuxt-auth-utils", "@vueuse/nuxt", "@nuxt/image", "@nuxt/icon", "@nuxt/fonts", "@nuxtjs/i18n"],

    css: ["~/assets/css/main.css"],

    future: {
        compatibilityVersion: 4,
    },

    compatibilityDate: "2024-11-27",

    // Enable SSG
    ssr: false,
    // Enables the development server to be discoverable by other devices when running on iOS physical devices
    devServer: {host: process.env.TAURI_DEV_HOST || "localhost"},
    vite: {
        // Better support for Tauri CLI output
        clearScreen: false,
        // Enable environment variables
        // Additional environment variables can be found at
        // https://v2.tauri.app/reference/environment-variables/
        envPrefix: ["VITE_", "TAURI_"],
        server: {
            // Tauri requires a consistent port
            strictPort: true,
        },
    },
});