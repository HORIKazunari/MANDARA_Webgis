import { Generic } from './clsGeneric';
import { appState } from './core/AppState';
import type { JsonObject, MapData } from './types';

/**
 * 属性データ中の代表的な地図名をサーバー配置ファイル名へ解決する対応表です。
 *
 * 旧来データで使われる大文字名や日本語名を、map フォルダ内の実ファイル名へ寄せます。
 */
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

/**
 * 正規化済みの地図ファイル名を返します。
 *
 * @param mapFileName 入力された地図ファイル名です。
 * @returns 前後空白を除去し、大文字化した比較用ファイル名です。
 */
export function normalizeMapFileName(mapFileName: string): string {
    return mapFileName.trim().toUpperCase();
}

/**
 * 属性データ中で参照される地図ファイル名を拡張子付きの基本形にそろえます。
 *
 * @param mapFileName 属性データなどに含まれる地図ファイル名です。
 * @returns 拡張子を補完した地図ファイル名です。空文字入力の場合は空文字を返します。
 */
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

/**
 * パスを除いた地図ファイルのベース名を返します。
 *
 * @param mapFileName パスを含む可能性のあるファイル名です。
 * @returns 最後の区切り文字以降のファイル名です。
 */
function getBaseMapFileName(mapFileName: string): string {
    const trimmed = mapFileName.trim();
    const slashIndex = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'));
    return slashIndex >= 0 ? trimmed.slice(slashIndex + 1) : trimmed;
}

/**
 * サーバー側の map フォルダから安全に読み込めるファイル名かを判定します。
 *
 * @param fileName 検査対象のファイル名です。
 * @returns 拡張子とパス構成が許可条件を満たす場合は true です。
 */
function isSafeMapFileName(fileName: string): boolean {
    if (fileName === '') {
        return false;
    }
    if (fileName.includes('/') || fileName.includes('\\') || fileName.includes('..')) {
        return false;
    }
    return /\.mpfj$/i.test(fileName);
}

/**
 * サーバー上で探索する地図ファイル名候補を返します。
 *
 * @param mapFileName ユーザー指定または属性データ内の地図ファイル名です。
 * @returns エイリアス解決後の候補一覧です。重複は除去されます。
 */
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

/**
 * 事前読込済みキャッシュから地図データを取得します。
 *
 * @param mapFileName 検索対象の地図ファイル名です。
 * @returns キャッシュ済みの地図 JSON、未読込の場合は undefined です。
 */
export function getCachedServerMapData(mapFileName: string): JsonObject | undefined {
    return appState().preReadMapFile[normalizeMapFileName(mapFileName)];
}

/**
 * 属性データテキストから参照地図ファイル名を抽出します。
 *
 * @param attrText 属性データ本体です。
 * @param ext 入力形式の拡張子または種別です。
 * @returns 参照される地図ファイル名の重複なし一覧です。
 */
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

/**
 * HTTP 経由で地図ファイルを読み込み、JSON オブジェクトとして返します。
 *
 * @param url 読み込み先 URL です。
 * @returns 地図データの JSON オブジェクトです。
 */
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

/**
 * 指定地図ファイルをサーバーから読み込み、状態キャッシュへ格納します。
 *
 * @param mapFileName 読み込み対象の地図ファイル名です。
 * @returns キャッシュ済みまたは新規読込に成功した場合は true です。
 */
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

/**
 * 地図ファイル不足時に表示する案内文を生成します。
 *
 * @param mapFileName 不足している地図ファイル名です。
 * @returns ユーザー向けの案内メッセージです。
 */
export function buildMissingMapGuidance(mapFileName: string): string {
    return '地図ファイル' + mapFileName + 'を読み込んでください。Webサーバーの map フォルダに存在しない場合は、地図ファイル追加またはドラッグ&ドロップで読み込んでください。';
}
