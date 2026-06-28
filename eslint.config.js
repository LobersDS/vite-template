import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['node_modules/**', 'template/**', 'Vault/**', '.claude/**'],
  },
  js.configs.recommended,
  {
    files: ['bin/**'],
    languageOptions: {
      globals: globals.node,
    },
  },
  prettier,
];
