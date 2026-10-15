import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base must match the GitHub repo name for GitHub Pages project sites.
// If you deploy to a custom domain or a user site, change base to "/".
export default defineConfig({
  plugins: [react()],
  base: "/portfolio/",
});
