import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: "prompt",
      injectRegister: null,
      manifestFilename: "site.webmanifest",
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[a-z]+\.supabase\.co\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api",
              expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "cdn-assets",
              expiration: { maxEntries: 50, maxAgeSeconds: 604800 },
            },
          },
        ],
      },
      manifest: {
        name: "Chapa & Pintura VM - Sistema de Gestión",
        short_name: "VM Gestión",
        description:
          "Sistema interno de presupuestos y gestión para el taller Chapa & Pintura VM.",
        id: "/?source=pwa",
        start_url: "/?source=pwa",
        scope: "/",
        display: "standalone",
        orientation: "portrait-primary",
        categories: ["business", "productivity"],
        theme_color: "#1A1917",
        background_color: "#1A1917",
        icons: [
          {
            src: "/icon.png",
            type: "image/png",
            sizes: "96x96",
            purpose: "any",
          },
          {
            src: "/icon-maskable-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
        screenshots: [
          {
            src: "/screenshot-desktop.png",
            sizes: "1920x936",
            type: "image/png",
            form_factor: "wide",
            label: "Pantalla principal del sistema de gestión en escritorio",
          },
          {
            src: "/screenshot-mobile.png",
            sizes: "390x844",
            type: "image/png",
            form_factor: "narrow",
            label: "Vista móvil de la sección de presupuestos",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
