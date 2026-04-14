import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      port: 5173,
      // Dev proxy: forwards /api calls to backend so you don't need CORS locally
      proxy: {
        "/api": {
          target: env.VITE_API_URL
            ? env.VITE_API_URL.replace("/api", "")
            : "http://localhost:8080",
          changeOrigin: true,
        },
      },
    },
  };
});
