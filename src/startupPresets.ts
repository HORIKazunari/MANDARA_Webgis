export type StartupPreset = {
  label: string;
  filePath: string;
};

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

export type StartupPresetId = keyof typeof startupPresets;

function stripPrefix(value: string, prefix: string): string {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

function parseParams(value: string, prefix: string): URLSearchParams {
  const normalized = stripPrefix(value, prefix).trim();
  if (normalized === '') {
    return new URLSearchParams();
  }

  const query = normalized.startsWith('?') ? normalized.slice(1) : normalized;
  return new URLSearchParams(query);
}

export function getStartupPresetRequest(search: string, hash: string): string | null {
  const searchParams = parseParams(search, '?');
  const hashParams = parseParams(hash, '#');

  const requestedPreset = hashParams.get('preset') ?? searchParams.get('preset');
  return requestedPreset?.trim() || null;
}

export function getStartupPresetById(presetId: string | null | undefined): StartupPreset | undefined {
  if (!presetId) {
    return undefined;
  }

  return startupPresets[presetId as StartupPresetId];
}

export function hasLegacyFileRequest(search: string, hash: string): boolean {
  return parseParams(search, '?').has('file') || parseParams(hash, '#').has('file');
}

export function isSafeStartupFilePath(path: string): boolean {
  if (path === '' || path.includes('..') || path.includes('://') || path.startsWith('//')) {
    return false;
  }

  return /^(data|map)\/[A-Za-z0-9_.-]+$/.test(path);
}