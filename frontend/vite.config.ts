import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { globSync } from "glob";
import path, { resolve } from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  root: resolve(__dirname, "src"),
  build: {
    outDir: resolve(__dirname, "../dist"),
    rollupOptions: {
      input: Object.fromEntries(
        globSync("**/*.html", { cwd: path.resolve(__dirname, "src") }).map(
          (file) => {
            const name = path.basename(file, ".html");
            return [name, path.resolve(__dirname, "src", file)];
          },
        ),
      ),
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
