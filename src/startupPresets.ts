/**
 * 起動プリセットの表示名と読込ファイルを表します。
 */
export type StartupPreset = {
  label: string;
  filePath: string;
};

/**
 * URL パラメータから選択できる起動プリセット一覧です。
 */
export const startupPresets = {
  'japan-pref': {
    label: '日本の都道府県データ付き',
    filePath: 'data/japan_data.mdrj',
  },
  'japan-climate': {
    label: '日本の気候データ（地点データ）付き',
    filePath: 'data/japan_climate.mdrj',
  },
  'japan-landprice-2021': {
    label: '日本の地価データ（2021年地価公示）付き',
    filePath: 'data/landprice2021.mdrj',
  },
  'tokyo-mesh-pop-2015': {
    label: '東京の人口データ（4次メッシュ）付き',
    filePath: 'data/tokyo4mesh2015population.mdrj',
  },
  'world-population': {
    label: '世界各国の人口データ付き',
    filePath: 'data/worldpopulation2.mdrj',
  },
  'world-population-centered': {
    label: '世界各国の人口データ付き(経度0度中心)',
    filePath: 'data/worldpopulation3.mdrmj',
  },
  'japan-city-population': {
    label: '日本の市町村データ付き',
    filePath: 'data/japan_sityoson_pop.mdrmj',
  },
  'tokyo-census-2015': {
    label: '東京都区部小地域データ付き',
    filePath: 'data/tokyo_census2015.mdrmj',
  },
} as const satisfies Record<string, StartupPreset>;

/**
 * 定義済み起動プリセットの識別子です。
 */
export type StartupPresetId = keyof typeof startupPresets;

/**
 * 文字列先頭の指定プレフィックスを取り除きます。
 *
 * @param value 対象文字列です。
 * @param prefix 除去対象プレフィックスです。
 * @returns プレフィックス除去後の文字列です。
 */
function stripPrefix(value: string, prefix: string): string {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

/**
 * クエリ文字列またはハッシュ文字列を URLSearchParams に変換します。
 *
 * @param value 元の検索文字列です。
 * @param prefix 取り除く接頭辞です。
 * @returns 正規化済みパラメータ集合です。
 */
function parseParams(value: string, prefix: string): URLSearchParams {
  const normalized = stripPrefix(value, prefix).trim();
  if (normalized === '') {
    return new URLSearchParams();
  }

  const query = normalized.startsWith('?') ? normalized.slice(1) : normalized;
  return new URLSearchParams(query);
}

/**
 * URL の search/hash から起動プリセット要求を取得します。
 *
 * @param search location.search の値です。
 * @param hash location.hash の値です。
 * @returns 指定されたプリセット ID、未指定時は null です。
 */
export function getStartupPresetRequest(search: string, hash: string): string | null {
  const searchParams = parseParams(search, '?');
  const hashParams = parseParams(hash, '#');

  const requestedPreset = hashParams.get('preset') ?? searchParams.get('preset');
  return requestedPreset?.trim() || null;
}

/**
 * プリセット ID から起動プリセット定義を取得します。
 *
 * @param presetId 検索するプリセット ID です。
 * @returns 一致するプリセット、未定義の場合は undefined です。
 */
export function getStartupPresetById(presetId: string | null | undefined): StartupPreset | undefined {
  if (!presetId) {
    return undefined;
  }

  return startupPresets[presetId as StartupPresetId];
}

/**
 * 旧形式の file 指定パラメータが含まれているかを判定します。
 *
 * @param search location.search の値です。
 * @param hash location.hash の値です。
 * @returns 旧形式の file 指定が存在する場合は true です。
 */
export function hasLegacyFileRequest(search: string, hash: string): boolean {
  return parseParams(search, '?').has('file') || parseParams(hash, '#').has('file');
}

/**
 * 起動時に自動読込してよい相対パスかを検証します。
 *
 * @param path 検証対象パスです。
 * @returns 許可された data または map 配下の単純なファイル名であれば true です。
 */
export function isSafeStartupFilePath(path: string): boolean {
  if (path === '' || path.includes('..') || path.includes('://') || path.startsWith('//')) {
    return false;
  }

  return /^(data|map)\/[A-Za-z0-9_.-]+$/.test(path);
}