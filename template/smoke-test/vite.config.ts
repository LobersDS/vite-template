import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { vueTemplateLangMarkdown } from 'vite-plugin-vue-template-lang-markdown';

export default defineConfig({
  plugins: [vueTemplateLangMarkdown(), vue()],
  server: { port: 5174 },
  preview: { port: 5174 },
});
