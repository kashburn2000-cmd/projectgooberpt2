import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { SITE } from "./src/config.ts";

// https://astro.build/config
export default defineConfig({
  site: SITE.SITE_URL,
  output: "static",
  trailingSlash: "ignore",
  integrations: [
    preact({ compat: true }),
    sitemap({
      // Partition the sitemap; the index lives at /sitemap-index.xml
      entryLimit: 5000,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: "auto",
  },
});
