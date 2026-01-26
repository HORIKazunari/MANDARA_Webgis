/**
 * アプリケーション状態管理クラス
 * 
 * 従来グローバル変数として扱われていた状態を一元管理します。
 * シングルトンパターンを使用して、アプリケーション全体で単一のインスタンスを共有します。
 * 
 * 使用例:
 * ```typescript
 * import { appState } from '@/core/AppState';
 * 
 * // 状態へのアクセス
 * const state = appState();
 * state.attrData.TotalData.LV1.SelectedLayer = 0;
 * 
 * // 初期化
 * state.initialize();
 * ```
 */

import type { MapFileInfo, JsonObject, JsonValue } from '../types';
import type { TKY2JGDInfo_Impl } from '../clsGeneric';

/**
 * スクロールマージン情報
 */
export interface IScrMargin {
    top: number;
    bottom: number;
    side: number;
    scrollWidth: number;
}

/**
 * アプリケーション状態クラス
 */
export class AppState {
    private static instance: AppState | null = null;

    // ==================== アプリケーション状態 ====================
    
    /**
     * 属性データ
     */
    public attrData!: IAttrData;

    /**
     * 設定データ
     */
    public settingData!: Setting_Info;

    /**
     * 印刷フォーム
     */
    public frmPrint!: IFrmPrint;

    /**
     * プロパティウィンドウ
     */
    public propertyWindow!: IPropertyWindow;

    /**
     * メインDIV要素
     */
    public divMain!: HTMLDivElement;

    /**
     * 座標変換情報
     */
    public tky2jgd!: TKY2JGDInfo_Impl;

    /**
     * タイルマップクラス
     */
    public tileMapClass!: clsTileMap;

    /**
     * 事前読み込みマップファイル
     */
    public preReadMapFile: Record<string, JsonObject> = {};

    /**
     * スクロールマージン
     */
    public scrMargin: IScrMargin;

    /**
     * ログウィンドウ
     */
    public logWindow?: HTMLTextAreaElement;

    /**
     * 設定モードウィンドウ
     */
    public settingModeWindow?: HTMLDivElement;

    /**
     * メニュープロパティウィンドウ（チェックボックス要素）
     */
    public mnuPropertyWindow?: HTMLInputElement;

    // ==================== コンストラクタ ====================

    /**
     * プライベートコンストラクタ（シングルトンパターン）
     */
    private constructor() {
        this.scrMargin = {
            top: 30,
            bottom: 23,
            side: 0,
            scrollWidth: 0
        };
    }

    /**
     * インスタンスを取得
     */
    public static getInstance(): AppState {
        if (!AppState.instance) {
            AppState.instance = new AppState();
        }
        return AppState.instance;
    }

    // ==================== 初期化メソッド ====================

    /**
     * アプリケーション状態を初期化
     */
    public initialize(): void {
        // Setting_Info, TKY2JGDInfo, clsTileMap は各ファイルでexportされている必要がある
        // この初期化は main.ts で行うため、ここでは宣言のみ
    }

    /**
     * 状態をリセット（主にテスト用）
     */
    public static reset(): void {
        AppState.instance = null;
    }

    // ==================== ユーティリティメソッド ====================

    /**
     * ログ出力
     */
    public log(data: JsonValue): void {
        if (!this.logWindow) {
            // Generic クラスは import が必要
            // this.logWindow = Generic.createNewTextarea(...);
        }
        
        let tx: string = "";
        if (Array.isArray(data)) {
            for (const item of data) {
                tx += item + " / ";
            }
        } else {
            tx = String(data);
        }
        // console.log(tx);
        
        if (this.logWindow) {
            this.logWindow.value += tx + "\n";
        }
    }
}

/**
 * アプリケーション状態へのショートカット関数
 * 
 * 使用例:
 * ```typescript
 * import { appState } from '@/core/AppState';
 * const state = appState();
 * ```
 */
export function appState(): AppState {
    return AppState.getInstance();
}

/**
 * デフォルトエクスポート（後方互換性のため）
 */
export default AppState;
