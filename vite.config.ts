import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

function collectFilesRecursively(dirPath: string): string[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectFilesRecursively(fullPath))
    } else if (entry.isFile()) {
      files.push(fullPath)
    }
  }

  return files
}

export default defineConfig({
  publicDir: false,
  plugins: [
    {
      name: 'copy-map-directory-with-original-names',
      apply: 'build',
      generateBundle() {
        const mapRoot = path.resolve(process.cwd(), 'map')
        if (!fs.existsSync(mapRoot)) return

        const mapFiles = collectFilesRecursively(mapRoot)
        for (const filePath of mapFiles) {
          const relativeFromMap = path.relative(mapRoot, filePath).replaceAll(path.sep, '/')
          this.emitFile({
            type: 'asset',
            fileName: `map/${relativeFromMap}`,
            source: fs.readFileSync(filePath)
          })
        }
      }
    },
    {
      name: 'copy-data-directory-with-original-names',
      apply: 'build',
      generateBundle() {
        const dataRoot = path.resolve(process.cwd(), 'data')
        if (!fs.existsSync(dataRoot)) return

        const dataFiles = collectFilesRecursively(dataRoot)
        for (const filePath of dataFiles) {
          const ext = path.extname(filePath).toLowerCase()
          if (ext !== '.mdrj' && ext !== '.mdrmj') continue

          const relativeFromData = path.relative(dataRoot, filePath).replaceAll(path.sep, '/')
          this.emitFile({
            type: 'asset',
            fileName: `data/${relativeFromData}`,
            source: fs.readFileSync(filePath)
          })
        }
      }
    }
  ],
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