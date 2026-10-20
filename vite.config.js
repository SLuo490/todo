import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // GitHub Pages serves this repo at /todo/ — keep in sync with the repo name.
  base: "/todo/",
  plugins: [react(), tailwindcss()],
});
