import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBase = env.VITE_API_BASE || "";
  const apiPort = env.API_PORT || "3000";
  const apiTarget = `http://localhost:${apiPort}`;
  return {
    server: {
      host: "::",
      port: 8080,
      proxy: apiBase
        ? undefined
        : {
            "/api": {
              target: apiTarget,
              changeOrigin: true,
            },
          },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name][extname]",
        },
      },
    },
  };
});
