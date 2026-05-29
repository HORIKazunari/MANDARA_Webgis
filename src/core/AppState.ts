/**
 * アプリケーション全体で共有する状態を管理します。
 *
 * 従来グローバル変数として分散していた参照を集約し、単一インスタンスからアクセスできるようにします。
 */

import type { /*MapFileInfo,*/ JsonObject, JsonValue } from '../types';
import type { Setting_Info as SettingInfoClass } from '../clsTime';
import type { clsTileMap as TileMapClass, clsDrawMarkFan as DrawMarkFanClass } from '../clsDraw';

/**
 * スクロール領域の余白設定を表します。
 */
export interface IScrMargin {
    top: number;
    bottom: number;
    side: number;
    scrollWidth: number;
}

/**
 * アプリケーションの共有状態を保持するシングルトンクラスです。
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
    public settingData!: SettingInfoClass;

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
     * タイルマップクラス
     */
    public tileMapClass!: TileMapClass;

    /**
     * 記号描画クラス参照（循環依存回避のため AppState 経由で保持）
     */
    public clsDrawMarkFan?: typeof DrawMarkFanClass;

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
     * シングルトンインスタンスを取得します。
     *
     * @returns 共有状態インスタンスです。
     */
    public static getInstance(): AppState {
        if (!AppState.instance) {
            AppState.instance = new AppState();
        }
        return AppState.instance;
    }

    // ==================== 初期化メソッド ====================

    /**
     * アプリケーション状態を初期化します。
     *
     * 実際の依存オブジェクト生成は各利用側で行い、このメソッドは初期化拡張の受け口として残しています。
     */
    public initialize(): void {
        // Setting_Info, TKY2JGDInfo, clsTileMap は各ファイルでexportされている必要がある
        // この初期化は main.ts で行うため、ここでは宣言のみ
    }

    /**
     * 保持中のシングルトンを破棄します。
     *
     * 主にテストや再初期化のために使用します。
     */
    public static reset(): void {
        AppState.instance = null;
    }

    // ==================== ユーティリティメソッド ====================

    /**
     * ログウィンドウへ内容を書き込みます。
     *
     * @param data 出力する値です。配列は区切り文字付きで連結します。
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
 * アプリケーション状態インスタンスを返すショートカットです。
 *
 * @returns 共有状態インスタンスです。
 */
export function appState(): AppState {
    return AppState.getInstance();
}

/**
 * 後方互換性のためのデフォルトエクスポートです。
 */
export default AppState;
