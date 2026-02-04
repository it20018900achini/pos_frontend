import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { settings } from "./src/constant";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ map @ to src
    },
  },
  build: {
    outDir: "dist", // 👈 revert to default
  },
    server: {
    proxy: {
      '/api': {
        target: settings.url, // your Spring Boot backend
        changeOrigin: true,
      },
    }
  },
});
