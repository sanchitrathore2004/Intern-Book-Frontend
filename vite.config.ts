import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: "injectManifest",
      devOptions: {
        enabled: false,
      },
      srcDir: "src",
      filename: "sw.ts",
      injectRegister: null,
      registerType: "autoUpdate",
      includeAssets: ["app_icon.png", "vite.svg"],
      manifest: {
        name: "Intern Book",
        short_name: "Intern Book",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/app_icon.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // 👈 THIS IS THE FIX
      },
    },
  },
});
