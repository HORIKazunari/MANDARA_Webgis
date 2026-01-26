// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'tests/**',  // テストファイルは別の設定で管理
      'playwright.config.ts',
      'eslint.config.mjs',  // 設定ファイル自体を除外
      'vite.config.ts',
      'vitest.config.ts',
      '*.cjs',
      'src/.!*',
      'src/encoding.min.ts', // minifyされた外部ライブラリを除外
      'src/zlibrev.ts', // zlibライブラリコードを除外
      'src/worldmap.ts', // JSON地図データ読み込み専用ファイル
      'src/japanmap.ts', // JSON地図データ読み込み専用ファイル
      'src/japanLatLonMap.ts', // JSON地図データ読み込み専用ファイル
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
      // any型の使用を禁止
      '@typescript-eslint/no-explicit-any': 'error', // any型の新規追加を完全に防止
      
      // 未使用変数の警告 - errorに変更して修正を促進
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrors: 'all'
      }],
      
      // var宣言を禁止
      'no-var': 'error',
      'prefer-const': 'error',  // 修正完了したのでerrorに変更
      
      // 型安全性の向上 - 段階的に修正
      '@typescript-eslint/no-unsafe-assignment': 'warn',      // 大量のため一旦warn
      '@typescript-eslint/no-unsafe-member-access': 'warn',   // 大量のため一旦warn
      '@typescript-eslint/no-unsafe-call': 'warn',            // 大量のため一旦warn
      '@typescript-eslint/no-unsafe-return': 'warn',          // 一旦warn
      
      // 関数とメソッドの型定義 - 段階的に修正
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off', // 一旦オフ: 段階的に追加
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
      // コード品質 - 段階的に修正
      '@typescript-eslint/no-empty-function': 'off',  // 意図的な空関数が多いため一旦オフ
      '@typescript-eslint/no-this-alias': 'warn',  // アロー関数への移行を段階的に
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],  // 修正完了したのでerrorに変更
      
      // TypeScriptコメント
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-ignore': 'allow-with-description',
        'ts-expect-error': 'allow-with-description',
        minimumDescriptionLength: 10
      }],
      
      // null/undefined安全性 - 段階的に修正
      '@typescript-eslint/no-non-null-assertion': 'warn',  // 50件: 段階的に修正
      '@typescript-eslint/prefer-nullish-coalescing': 'off',  // strictNullChecks有効化後に再度有効化
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'off', // 厳密すぎるので無効化
      
      // 命名規則（段階的に厳格化） - レガシーコードとの互換性のため一時的にオフ
      '@typescript-eslint/naming-convention': 'off', /* ['warn',
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
      ], */
      
      // TypeScriptが型チェックするため無効化
      'no-undef': 'off',
      
      // クラスとインターフェースのマージング - 段階的に修正
      '@typescript-eslint/no-unsafe-declaration-merging': 'warn', // レガシーパターンを段階的に修正
    },
  },
  // vscode.config.tsやvitest.config.tsなどの設定ファイルは既にignoredに含まれるため、
  // 追加の除外設定は不要
);
