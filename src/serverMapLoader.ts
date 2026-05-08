import { Generic } from './clsGeneric';
import { appState } from './core/AppState';
import type { JsonObject, MapData } from './types';

const serverMapAliases: Record<string, string> = {
    'JAPAN.MPFJ': 'JAPAN.mpfj',
    'WORLD.MPFJ': 'WORLD.mpfj',
    '日本緯度経度.MPFJ': 'japanLatLon.mpfj',
    '日本市町村緯度経度.MPFJ': 'japanadm.mpfj',
    '日本鉄道緯度経度.MPFJ': 'japanRail.mpfj',
    'WORLD2.MPFJ': 'WORLD2.mpfj',
    '日本市町村.MPFJ': 'japanadmOld.mpfj',
    'USA.MPFJ': 'USA.mpfj',
    'CHINA.MPFJ': 'CHINA.mpfj'
};

export function normalizeMapFileName(mapFileName: string): string {
    return mapFileName.trim().toUpperCase();
}

function canonicalizeReferencedMapFileName(mapFileName: string): string {
    const trimmed = mapFileName.trim();
    if (trimmed === '') {
        return '';
    }
    const baseName = getBaseMapFileName(trimmed);
    if (/\.mpfj$/i.test(baseName) === true) {
        return baseName;
    }
    return baseName + '.MPFJ';
}

function getBaseMapFileName(mapFileName: string): string {
    const trimmed = mapFileName.trim();
    const slashIndex = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'));
    return slashIndex >= 0 ? trimmed.slice(slashIndex + 1) : trimmed;
}

function isSafeMapFileName(fileName: string): boolean {
    if (fileName === '') {
        return false;
    }
    if (fileName.includes('/') || fileName.includes('\\') || fileName.includes('..')) {
        return false;
    }
    return /\.mpfj$/i.test(fileName);
}

export function getServerMapCandidates(mapFileName: string): string[] {
    const baseName = getBaseMapFileName(mapFileName);
    const normalizedName = normalizeMapFileName(baseName);
    const candidates: string[] = [];
    const alias = serverMapAliases[normalizedName];
    if (alias !== undefined) {
        candidates.push(alias);
    }
    if (isSafeMapFileName(baseName) === true) {
        candidates.push(baseName);
    }
    return [...new Set(candidates)];
}

export function getCachedServerMapData(mapFileName: string): JsonObject | undefined {
    return appState().preReadMapFile[normalizeMapFileName(mapFileName)];
}

export function extractReferencedMapFileNames(attrText: string, ext: string): string[] {
    if ((ext === 'csv') || (ext === 'clipboard')) {
        const uniqueMapNames = new Map<string, string>();
        for (const line of attrText.split(/\r?\n/)) {
            if (line.trim() === '') {
                continue;
            }
            const splitter = (line.indexOf('\t') === -1) && (line.indexOf(',') !== -1) ? ',' : '\t';
            const cells = Generic.String_Cut(line, splitter);
            if (cells.length === 0 || cells[0].trim().toUpperCase() !== 'MAP') {
                continue;
            }
            for (const mapFileName of cells.slice(1)) {
                const canonicalMapFileName = canonicalizeReferencedMapFileName(mapFileName);
                if (canonicalMapFileName === '') {
                    continue;
                }
                uniqueMapNames.set(normalizeMapFileName(canonicalMapFileName), canonicalMapFileName);
            }
        }
        return [...uniqueMapNames.values()];
    }

    if ((ext !== 'mdrj') && (ext !== 'mdrmj')) {
        return [];
    }
    try {
        const parsed = JSON.parse(attrText) as {
            LayerData?: Array<{ MapFileName?: string }>;
            mapData?: Record<string, unknown>;
        };
        if ((parsed.mapData !== undefined) && (Object.keys(parsed.mapData).length > 0)) {
            return [];
        }
        const uniqueMapNames = new Map<string, string>();
        for (const layer of parsed.LayerData ?? []) {
            const mapFileName = canonicalizeReferencedMapFileName(layer.MapFileName ?? '');
            if (mapFileName === '') {
                continue;
            }
            uniqueMapNames.set(normalizeMapFileName(mapFileName), mapFileName);
        }
        return [...uniqueMapNames.values()];
    } catch {
        return [];
    }
}

function loadMapDataByHttpRequest(url: string): Promise<JsonObject> {
    return new Promise((resolve, reject) => {
        Generic.getMapfileByHttpRequest(
            url,
            (data: MapData | string) => {
                if ((data === null) || (typeof data !== 'object') || Array.isArray(data)) {
                    reject(new Error(url + ' の地図データを解釈できませんでした。'));
                    return;
                }
                resolve(data as JsonObject);
            },
            (message: string) => {
                reject(new Error(message));
            }
        );
    });
}

export async function ensureServerMapCached(mapFileName: string): Promise<boolean> {
    const normalizedName = normalizeMapFileName(mapFileName);
    if (getCachedServerMapData(normalizedName) !== undefined) {
        return true;
    }

    for (const candidate of getServerMapCandidates(mapFileName)) {
        try {
            const jsonMapData = await loadMapDataByHttpRequest('map/' + candidate);
            appState().preReadMapFile[normalizedName] = jsonMapData;
            return true;
        } catch {
            continue;
        }
    }

    return false;
}

export function buildMissingMapGuidance(mapFileName: string): string {
    return '地図ファイル' + mapFileName + 'を読み込んでください。Webサーバーの map フォルダに存在しない場合は、地図ファイル追加またはドラッグ&ドロップで読み込んでください。';
}
