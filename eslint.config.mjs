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

      // Runtime safety: avoid legacy implicit globals that caused white-screen ReferenceErrors
      'no-restricted-globals': ['error',
        {
          name: 'clsSettingData',
          message: 'Use appState().settingData instead of legacy global clsSettingData.',
        },
        {
          name: 'mapMouse',
          message: 'Import mapMouseInternal (or alias) from frmPrint instead of relying on global mapMouse.',
        },
        {
          name: 'mousePointingSituations',
          message: 'Define/import mousePointingSituations in module scope; do not rely on implicit global declarations.',
        },
        {
          name: 'TKY2JGD',
          message: 'Use TKY2JGDInfo import from clsGeneric instead of legacy global TKY2JGD.',
        },
        {
          name: 'tileMapClass',
          message: 'Use appState().tileMapClass instead of implicit global tileMapClass.',
        },
        {
          name: 'Setting_Info',
          message: 'Import Setting_Info from clsTime.ts instead of relying on implicit global Setting_Info.',
        },
        {
          name: 'clsSortingSearch',
          message: 'Use SortingSearch import from SortingSearch.ts instead of implicit global clsSortingSearch.',
        },
        {
          name: 'clsGrid',
          message: 'Import clsGrid from clsGrid.ts instead of relying on implicit global clsGrid.',
        },
      ],
      
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
  {
    files: ['src/clsSubWindows.ts'],
    rules: {
      'no-restricted-globals': ['error',
        {
          name: 'Frm_Print',
          message: 'Use appState().frmPrint instead of legacy global Frm_Print.',
        },
      ],
    },
  },
  {
    files: ['src/clsWindow.ts'],
    rules: {
      'no-restricted-globals': ['error',
        {
          name: 'attrData',
          message: 'Use state.attrData (or local binding synchronized with AppState) instead of legacy global attrData.',
        },
        {
          name: 'Frm_Print',
          message: 'Use state.frmPrint (AppState) instead of legacy global Frm_Print.',
        },
        {
          name: 'propertyWindow',
          message: 'Use state.propertyWindow (AppState) instead of legacy global propertyWindow.',
        },
        {
          name: 'settingModeWindow',
          message: 'Use state.settingModeWindow (AppState) instead of legacy global settingModeWindow.',
        },
      ],
    },
  },
  {
    files: ['src/frmPrint.ts'],
    rules: {
      'no-restricted-globals': ['error',
        {
          name: 'Frm_Print',
          message: 'Use state.frmPrint (AppState) instead of legacy global Frm_Print.',
        },
      ],
    },
  },
  {
    files: ['src/clsGeneric.ts', 'src/clsDraw.ts', 'src/clsMapdata.ts', 'src/SpatialIndexSearch.ts', 'src/MeshContour.ts'],
    rules: {
      'no-restricted-globals': ['error',
        {
          name: 'cstRectangle_Cross',
          message: 'Import cstRectangle_Cross from clsAttrData instead of using implicit global.',
        },
        {
          name: 'chvValue_on_twoValue',
          message: 'Import chvValue_on_twoValue from clsAttrData instead of using implicit global.',
        },
      ],
    },
  },
);
