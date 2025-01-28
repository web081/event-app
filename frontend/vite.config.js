import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env, // To make env vars accessible globally (if needed)
  },
  build: {
    outDir: "build", // Output directory for the production build
  },
});
