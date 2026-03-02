import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://pixari.dev',
  trailingSlash: 'always',
  output: 'static',
  adapter: vercel(),
  integrations: [
    mdx(),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        dark: 'github-dark',
        light: 'github-light',
      },
      wrap: true,
    },
  },
});
