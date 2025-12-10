// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // any型の使用を禁止（段階的にerrorに）
      '@typescript-eslint/no-explicit-any': 'error',
      
      // 未使用変数の警告
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrors: 'all'
      }],
      
      // var宣言を禁止
      'no-var': 'error',
      'prefer-const': 'error',
      
      // その他のベストプラクティス
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/explicit-function-return-type': ['warn', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true
      }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-ignore': 'allow-with-description',
        'ts-expect-error': 'allow-with-description',
        minimumDescriptionLength: 10
      }],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      
      // TypeScriptが型チェックするため無効化
      'no-undef': 'off',
    },
  },
  {
    // 除外するファイルパターン
    ignores: [
      'dist/**',
      'node_modules/**',
      'public/**',
      '*.js',
      'vite.config.ts'
    ],
  }
);
