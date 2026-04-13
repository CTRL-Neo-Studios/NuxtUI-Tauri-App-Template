// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},

    extends: [["github:CTRL-Neo-Studios/nuxt-ui-extras#dev", { install: true }]],

    modules: [
      "@nuxt/ui",
      "nuxt-auth-utils",
      "@vueuse/nuxt",
      "@nuxt/image",
      "@nuxt/icon",
      "@nuxt/fonts",
      "@nuxtjs/i18n",
      "@type32/nuxt-cs-utils",
    ],

    css: ["~/assets/css/main.css"],

    compatibilityDate: "2026-01-20",

    // Enable SSG
    ssr: false,
    // Enables the development server to be discoverable by other devices when running on iOS physical devices
    devServer: {host: "0"},
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
        optimizeDeps: {
            include: [
                "@tauri-apps/plugin-store",
                "@tauri-apps/plugin-fs",
                "@tauri-apps/plugin-dialog",
                "@tauri-apps/plugin-clipboard-manager",
                "@tauri-apps/api/path",
                "@tauri-apps/plugin-os",
                "@tauri-apps/plugin-notification",
                "@tauri-apps/plugin-opener",
                "@tauri-apps/api/menu",
                "@tauri-apps/api/webviewWindow",
                "@tauri-apps/api/webview",
                "@tauri-apps/api/window",
                "@tauri-apps/plugin-process",
                "@tauri-apps/api/event",
                "@tauri-apps/api/core",
                "tailwindcss/colors",
                "@vue/devtools-core",
                "@vue/devtools-kit",
                "@internationalized/date",
                "zod",
            ]
        }
    },
});