module.exports = {
    root: true,
    env: {
      browser: true,
      es2020: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
      '@typescript-eslint/recommended',
      'prettier',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  }