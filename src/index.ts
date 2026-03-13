// メインエントリーポイント - 動的インポートでチャンク分割
void (async () => {
	// まずユーティリティ系（圧縮/文字コード/地図補助）を先に読み込む
	await Promise.all([
		import('./encoding.min.ts'),
		import('./zlibrev.ts'),
		import('./japanmap.ts'),
		import('./worldmap.ts'),
		import('./japanLatLonMap.ts'),
	]);

	// アプリ本体モジュール群（並列ロード）
	await Promise.all([
		import('./clsAttrData.ts'),
		import('./clsTime.ts'),
		import('./clsGeneric.ts'),
		import('./clsDraw.ts'),
		import('./SortingSearch.ts'),
		import('./SpatialIndexSearch.ts'),
		import('./clsMapdata.ts'),
		import('./clsPrint.ts'),
		import('./frmPrint.ts'),
		import('./clsWindow.ts'),
		import('./clsSubWindows.ts'),
		import('./clsAccessory.ts'),
		import('./shapeFile.ts'),
		import('./MeshContour.ts'),
		import('./clsGridControl.ts'),
		import('./clsGrid.ts'),
	]);

	// エントリーポイント初期化
	await import('./main.ts');

	const globalScope = globalThis as typeof globalThis & {
		init?: () => void;
	};
	globalScope.init?.();
})();