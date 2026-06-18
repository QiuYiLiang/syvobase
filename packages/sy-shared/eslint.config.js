import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import importLint from 'eslint-plugin-import'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'import': importLint,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      'import/no-duplicates': ['error', { considerQueryString: true }],
    },
  },
)
