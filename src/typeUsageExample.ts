/**
 * 型定義の使い方サンプル
 * 
 * globals.d.ts と types.ts の使い分けの実例
 */

import { point, rectangle, size } from './clsAttrData';

// ==================== パターン1: グローバル型の使用 ====================
// globals.d.ts で定義された型は import 不要

function _exampleGlobalTypes(): void {
    // point, rectangle, size など既存のグローバルクラス
    const _p: point = new point(10, 20);
    const _rect: rectangle = new rectangle(0, 100, 0, 50);
    const _sz: size = new size(100, 50);
    
    // globals.d.ts に追加したインターフェース
    const _fileData: FileData = {
        file: new File([], 'test.txt'),
        name: 'test.txt',
        extension: 'txt'
    };
    
    const _mapFile: MapFileInfo = {
        name: 'japan.mpfj',
        type: 'mpfj'
    };
    
    const _layer: LayerInfo = {
        id: 1,
        name: '都道府県',
        visible: true
    };
}

// ==================== パターン2: types.ts からのimport ====================
// モジュールスコープの型は明示的に import

import type { 
    EventHandler, 
    Dictionary, 
    Nullable,
    Optional,
    DialogCallback 
} from './types';

function _exampleModuleTypes(): void {
    // イベントハンドラー型
    const _clickHandler: EventHandler<MouseEvent> = (event) => {
        console.warn('Example:', event.clientX, event.clientY);
    };
    
    // 辞書型
    const _dataMap: Dictionary<MapFileInfo> = {
        'japan': { name: 'japan.mpfj', type: 'mpfj' },
        'world': { name: 'world.mpfj', type: 'mpfj' }
    };
    
    // Null許容型
    const _nullableValue: Nullable<string> = null;
    const _optionalValue: Optional<number> = undefined;
    
    // コールバック型
    const _callback: DialogCallback = (result, data) => {
        if (result) {
            console.warn('OK clicked', data);
        }
    };
}

// ==================== パターン3: 混在使用 ====================
// グローバル型とモジュール型を組み合わせて使用

import type { DataLoadResult, DataLoader } from './types';

// グローバル型(MapFileInfo)とモジュール型(DataLoadResult)を組み合わせ
async function loadMapFile(filename: string): Promise<DataLoadResult<MapFileInfo>> {
    try {
        // 仮の実装
        const mapFile: MapFileInfo = {
            name: filename,
            type: 'mpfj'
        };
        
        return {
            success: true,
            data: mapFile
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : String(error)
        };
    }
}

// DataLoaderジェネリック型の使用例
const _mapLoader: DataLoader<MapFileInfo> = async (file) => {
    const filename = typeof file === 'string' ? file : file.name;
    return loadMapFile(filename);
};

// ==================== パターン4: 将来の推奨パターン ====================
// ドメイン別の型定義ファイルを作成（今後の改善）

/*
// types/geometry.ts
export interface Point2D {
    x: number;
    y: number;
}

export interface Point3D extends Point2D {
    z: number;
}

// types/map.ts
export interface MapLayer {
    id: string;
    type: 'vector' | 'raster';
    source: MapFileInfo;
    visible: boolean;
}

// 使用側
import type { Point2D } from '@/types/geometry';
import type { MapLayer } from '@/types/map';
*/

// ==================== ベストプラクティス ====================

/**
 * 推奨事項:
 * 
 * 1. 新しいコードでは types.ts (または types/* ) からimport
 *    → 明示的で、テスト可能、依存関係が明確
 * 
 * 2. レガシーコードは globals.d.ts の型を使用
 *    → 既存コードとの互換性維持
 * 
 * 3. グローバル型とモジュール型は必要に応じて併用
 *    → 段階的な移行が可能
 * 
 * 4. ドメイン固有の型は専用ファイルに分離
 *    → メンテナンス性向上
 */

export {};
