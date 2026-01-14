// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'tests/e2e/**', 
      'playwright.config.ts',
      '*.cjs',
      'src/.!*',
      'src/encoding.min.ts', // minifyされた外部ライブラリを除外
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
      // any型の使用を禁止（段階的にerrorに）
      '@typescript-eslint/no-explicit-any': 'warn', // 段階的にerrorに変更予定
      
      // 未使用変数の警告
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrors: 'all'
      }],
      
      // var宣言を禁止
      'no-var': 'error',
      'prefer-const': 'error',
      
      // 型安全性の向上
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      
      // 関数とメソッドの型定義
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/explicit-function-return-type': ['warn', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true
      }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
      // コード品質
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/await-thenable': 'error',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      
      // TypeScriptコメント
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-ignore': 'allow-with-description',
        'ts-expect-error': 'allow-with-description',
        minimumDescriptionLength: 10
      }],
      
      // null/undefined安全性
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'off', // 厳密すぎるので無効化
      
      // 命名規則（段階的に厳格化）
      '@typescript-eslint/naming-convention': ['warn',
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
          // レガシーコード対応: アンダースコア区切りを一時的に許可
          filter: {
            regex: '^(.*_.*|[A-Z][a-z]*(_[A-Z][a-z]*)*)$',
            match: false
          }
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow'
        },
        {
          selector: 'parameter',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow'
        },
        {
          selector: 'class',
          format: ['PascalCase'],
          // レガシーコード: clsで始まるクラス名を許可
          custom: {
            regex: '^(cls)?[A-Z]',
            match: true
          }
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          // I始まりのインターフェース名を許可
          custom: {
            regex: '^I?[A-Z]',
            match: true
          }
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase']
        },
        {
          selector: 'enum',
          format: ['PascalCase']
        },
        {
          selector: 'enumMember',
          format: ['PascalCase', 'UPPER_CASE']
        }
      ],
      
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
