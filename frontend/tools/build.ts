import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { glob } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, "../src");
const distDir = path.resolve(__dirname, "../dist");

const entries = await glob("**/*.html", { cwd: srcDir });

if (entries.length === 0) {
  console.warn("No HTML entries found in src directory.");
}

for (const entry of entries) {
  // entry: e.g. pages/app/index.html
  const entryPath = path.join(srcDir, entry);
  const componentName = path.basename(path.dirname(entryPath));
  console.log("Building:", entryPath, "->", componentName);
  await build({
    root: srcDir,
    build: {
      outDir: distDir,
      assetsDir: componentName,
      rollupOptions: {
        input: entryPath,
      },
      emptyOutDir: false,
    },
    plugins: [react(), tailwindcss(), viteSingleFile()],
    resolve: {
      alias: {
        "@": srcDir,
      },
    },
  });
}
