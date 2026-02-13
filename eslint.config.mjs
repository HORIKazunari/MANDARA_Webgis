// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'tests/**',
      'playwright.config.ts',
      'eslint.config.mjs',
      'vite.config.ts',
      'vitest.config.ts',
      '*.cjs',
      'src/.!*',
      'src/encoding.min.ts',
      'src/zlibrev.ts',
      'src/worldmap.ts',
      'src/japanmap.ts',
      'src/japanLatLonMap.ts',
      'node_modules/**',
      'dist/**',
      'playwright-report/**'
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Type safety
      '@typescript-eslint/no-explicit-any': 'error',
      
      // Unused vars
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrors: 'all'
      }],
      
      // Declarations
      'no-var': 'error',
      'prefer-const': 'error',
      
      // Unsafe operations
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      
      // Function typing policy
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
      // Code quality
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      
      // TS comment policy
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-ignore': 'allow-with-description',
        'ts-expect-error': 'allow-with-description',
        minimumDescriptionLength: 10
      }],
      
      // Null safety
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      
      // Naming
      '@typescript-eslint/naming-convention': 'off',
      
      // TypeScript handles this
      'no-undef': 'off',
      
      // Prevent interface/class merge pitfalls
      '@typescript-eslint/no-unsafe-declaration-merging': 'error',
    },
  },
  {
    files: [
      'src/core/**/*.ts',
      'src/constants/**/*.ts',
      'src/SortingSearch.ts',
      'src/SpatialIndexSearch.ts',
      'src/MeshContour.ts',
      'src/shapeFile.ts',
      'src/typeUsageExample.ts',
      'src/counter.ts',
    ],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
);
