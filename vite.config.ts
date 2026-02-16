import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: false,
  esbuild: {
    // TypeScriptの変換を最小限に
    target: 'es2015'
  },
  build: {
    // より多くのチャンクサイズを許可
    chunkSizeWarningLimit: 1600,
    // ソースマップを生成してデバッグしやすく
    sourcemap: true,
    // with文のためにターゲットを変更
    target: 'es2015',
    rollupOptions: {
      // 複数のHTMLファイルをエントリーポイントとして指定
      input: {
        main: './index.html',
        mandara: './mandarawebgis.html'
      },
      // エラーを警告として扱う
      onwarn(warning, warn) {
        // 一般的な警告を無視
        if (warning.code === 'UNRESOLVED_IMPORT') return
        if (warning.code === 'CIRCULAR_DEPENDENCY') return
        warn(warning)
      },
      output: {
        // inlineDynamicImportsを無効化
        inlineDynamicImports: false,
        // 大きなバンドルを分割
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
          if (id.includes('/src/zlibrev')) return 'zlib';
          if (id.includes('/src/encoding.min')) return 'encoding';
          if (id.includes('/src/clsAttrData')) return 'mandara-attr';
          if (id.includes('/src/clsMapdata')) return 'mandara-mapdata';
          if (id.includes('/src/clsGeneric')) return 'mandara-generic';
          if (id.includes('/src/clsPrint')) return 'mandara-print';
          if (id.includes('/src/clsWindow')) return 'mandara-window';
          if (id.includes('/src/clsDraw')) return 'mandara-draw';
          if (id.includes('/src/clsGrid')) return 'mandara-grid';
          if (id.includes('/src/clsSubWindows')) return 'mandara-subwindows';
          if (id.includes('/src/clsAccessory')) return 'mandara-accessory';
          if (id.includes('/src/clsTime')) return 'mandara-time';
          if (id.includes('/src/SpatialIndexSearch')) return 'mandara-spatialindex';
          if (id.includes('/src/mesh') || id.includes('/src/MeshContour')) return 'mandara-mesh';
          return undefined;
        }
      }
    }
  },
  define: {
    // 開発時のデバッグを有効化
    __DEV__: true
  }
})