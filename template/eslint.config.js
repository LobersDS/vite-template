import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      'StaticSite-Vault/**',
      '.remember/**',
      '.claude/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.vue'],
    extends: [...tseslint.configs.recommended],
  },
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    // Reactive vars used only in <template lang="md"> are invisible to static analysis.
    files: ['**/*.demo.vue'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
  },
  prettier
);
