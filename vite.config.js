import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, "");
  const apiPort = env.PORT || "4000";

  return {
    plugins: [react()],
    assetsInclude: ["**/*.glb"],

    server: {
      /**
       * In production the site and the API share an origin, because Vercel
       * serves /api/* from api/index.js alongside the static build. This proxy
       * reproduces that locally, so the browser code can always call /api/...
       * with no base URL and no environment specific branch.
       *
       * Run both halves together with: npm run dev:all
       */
      proxy: {
        "/api": {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
          // Adds X-Forwarded-Host with the browser's own host, so the admin
          // routes' same origin check sees the page's origin and not the
          // proxy target. Vercel sends the same header in production.
          xfwd: true,
        },
      },
    },
  };
});
