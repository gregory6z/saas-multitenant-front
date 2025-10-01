import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0', // Permite acesso via qualquer hostname
    strictPort: false,
    allowedHosts: [
      'lvh.me',
      '.lvh.me', // Wildcard para todos os subdomains (tenant1.lvh.me, gregory-test.lvh.me)
      'localhost',
    ],
    hmr: {
      host: 'localhost', // HMR via localhost
    },
  },
});
