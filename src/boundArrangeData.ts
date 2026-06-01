import type { Line_Property, Mark_Property } from './clsTime';
import type { Fringe_Line_Info } from './clsPrint';

/**
 * 境界線の配置調整時に使用する描画属性の作業データです。
 *
 * 印や線、フリンジ情報と並べ替え後の線コードをひとまとめに保持します。
 */
export class boundArrangeData {
    /** 配置対象の記号属性です。 */
    Mark?: Mark_Property;
    /** 配置対象の線属性です。 */
    Line?: Line_Property;
    /** 境界線に付与するフリンジ情報です。 */
    Fringe?: Fringe_Line_Info[];
    /** 並べ替え後の線コード群です。 */
    Arrange_LineCode?: number[][];
    /** 有効な配置件数です。 */
    Pon: number;

    /**
     * 空の配置調整データを初期化します。
     */
    constructor() {
        this.Pon = 0;
        this.Fringe = [];
        this.Arrange_LineCode = [];
    }
}
