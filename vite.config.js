import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

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
        target: 'http://localhost:5000', // your Spring Boot backend
        changeOrigin: true,
      },
    }
  },
});
