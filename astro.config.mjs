import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import node from "@astrojs/node";
export default defineConfig({

  
   site: 'https://lexingtonthemes.com',
  integrations: [tailwind(),  sitemap(), react()],
  output: 'server',
  adapter: node({
    mode: "standalone"
  }),
  server: {
    proxy: {
      '/api/': {
        target: 'https://demo.lookuptax.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

});
