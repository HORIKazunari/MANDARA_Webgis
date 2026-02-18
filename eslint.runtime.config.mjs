// @ts-check

import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'tests/**',
      'dist/**',
      'node_modules/**',
      'src/encoding.min.ts',
      'src/zlibrev.ts',
      'src/worldmap.ts',
      'src/japanmap.ts',
      'src/japanLatLonMap.ts',
      'src/**/*.d.ts',
    ],
  },
  {
    files: ['src/**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-undef': 'off',
      'no-restricted-globals': ['error',
        { name: 'Generic', message: 'Import Generic from clsGeneric.ts.' },
        { name: 'CheckedListBox', message: 'Import CheckedListBox from clsGeneric.ts.' },
        { name: 'ListBox', message: 'Import ListBox from clsGeneric.ts.' },
        { name: 'ListViewTable', message: 'Import ListViewTable from clsGeneric.ts.' },
        { name: 'spatial', message: 'Import spatial from clsGeneric.ts.' },
        { name: 'latlon', message: 'Import latlon from clsGeneric.ts.' },
        { name: 'point', message: 'Import point from clsAttrData.ts.' },
        { name: 'size', message: 'Import size from clsAttrData.ts.' },
        { name: 'rectangle', message: 'Import rectangle from clsAttrData.ts.' },
        { name: 'colorRGBA', message: 'Import colorRGBA from clsAttrData.ts.' },
        { name: 'strYMD', message: 'Import strYMD from clsAttrData.ts.' },
        { name: 'Zahyo_info', message: 'Import Zahyo_info from clsMapdata.ts.' },
        { name: 'strCompass_Attri', message: 'Import strCompass_Attri from clsMapdata.ts.' },
        { name: 'Arrow_Data', message: 'Import Arrow_Data from clsTime.ts.' },
        { name: 'Mark_Property', message: 'Import Mark_Property from clsTime.ts.' },
        { name: 'LineEdge_Connect_Pattern_Data_Info', message: 'Import LineEdge_Connect_Pattern_Data_Info from clsTime.ts.' },
        { name: 'clsMapdata', message: 'Import clsMapdata from clsMapdata.ts.' },
        { name: 'clsBase', message: 'Import clsBase from clsTime.ts.' },
        { name: 'clsTime', message: 'Import clsTime from clsTime.ts.' },
        { name: 'clsDrawTile', message: 'Import clsDrawTile from clsDraw.ts.' },
        { name: 'enmLayerMode_Number', message: 'Import enmLayerMode_Number from constants/legacyEnums.ts.' },
        { name: 'enmCircleMDLegendLine', message: 'Import enmCircleMDLegendLine from constants/legacyEnums.ts.' },
        { name: 'enmTripPositionType', message: 'Import enmTripPositionType from constants/legacyEnums.ts.' },
        { name: 'enmZahyo_mode_info_enum', message: 'Import enmZahyo_mode_info_enum from constants/legacyEnums.ts.' },
        { name: 'SpatialPointType', message: 'Import SpatialPointType from constants/legacyEnums.ts.' },
      ],
    },
  },
);
