import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { vueTemplateLangMarkdown } from '@lober-ds/vite-plugin-vue-template-lang-markdown';

export default defineConfig({
  plugins: [
    vueTemplateLangMarkdown({
      demoFilePattern: 'src/**/*.demo.vue',
    }),
    vue(),
  ],
});
