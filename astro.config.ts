import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import rehypeWrapAll from 'rehype-wrap-all';

export default defineConfig({
  site: 'https://pixari.dev',
  trailingSlash: 'always',
  output: 'static',
  vite: {
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
      },
    },
  },
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
    rehypePlugins: [
      [rehypeWrapAll, { selector: 'table', wrapper: 'div.table-wrap' }],
    ],
  },
});
