/**
 * Utility to sort values while keeping track of their original indices.
 * Supports duplicate detection and index lookups after sorting.
 */
export class SortingSearch {
    private SortNumber: number[] = [];
    private Sortrr: number[] = [];
    private DataNum: number = 0;
    DataPositionValue_Integer: number[] = [];

    /**
     * 内部配列と件数を初期状態に戻します。
     */
    init(): void {
        this.SortNumber = [];
        this.Sortrr = [];
        this.DataPositionValue_Integer = [];
        this.DataNum = 0;
    }

    /**
     * 保持しているデータ件数を返します。
     *
     * @returns 登録済みデータ数です。
     */
    NumofData(): number {
        return this.DataNum;
    }

    /**
     * 元の配列位置が、ソート後に先頭から何番目かを返します。
     *
     * @param originalPosition ソート前の配列位置です。
     * @returns ソート後の順位です。見つからない場合は -1 です。
     */
    getAfterSortPosition(originalPosition: number): number {
        return this.SortNumber.indexOf(originalPosition);
    }

    /**
     * 元の配列位置が、ソート後に末尾から何番目かを返します。
     *
     * @param originalPosition ソート前の配列位置です。
     * @returns 末尾基準の順位です。見つからない場合でも計算結果を返します。
     */
    getAfterSortPositionRev(originalPosition: number): number {
        return (this.DataNum - 1 - this.SortNumber.lastIndexOf(originalPosition));
    }
    
    /**
     * 重複している値の種類数を返します。
     *
     * @returns 同値が複数件存在する値の種類数です。
     */
    SameValue_Number(): number {
        const SV: number[] = [];
        return this.Get_Same_value(SV);
    }
    
    /**
     * 重複をまとめた値一覧と件数を返します。
     *
     * @returns 各値と出現回数の配列です。
     */
    EachValue_Array(): { value: number; num: number }[] {
        return this.Get_Each_value();
    }
    
    /**
     * 重複している値の一覧を受け取り配列へ格納します。
     *
     * @param SameValueArray 重複値の出力先配列です。
     * @returns 格納した重複値の種類数です。
     */
    SameValue_Array(SameValueArray: number[]): number {
        const n = this.Get_Same_value(SameValueArray);
        return n;
    }
    
    /**
     * 指定値と一致する元データ位置をすべて返します。
     *
     * @param SearchValue 検索する値です。
     * @returns 一致した元配列位置の一覧です。
     */
    SearchData_Array(SearchValue: number): number[] {
        const DataNumberArray: number[] = [];
        const DPosition = this.Search_Data_Multi(SearchValue);
        const EQn = DPosition.Num_of_Equal_Data;
        if (EQn !== -1) {
            for (let i = 0; i < EQn; i++) {
                DataNumberArray.push(this.SortNumber[DPosition.firstPosition + i]);
            }
        }
        return DataNumberArray;
    }

    /**
     * 指定値と一致する元データ位置を 1 件返します。
     *
     * @param SearchValue 検索する値です。
     * @returns 最初に一致した元配列位置です。未検出時は -1 です。
     */
    SearchData_One(SearchValue: number): number {
        const DPosition = this.Search_Data_Multi(SearchValue);
        if (DPosition.Num_of_Equal_Data === -1) {
            return -1;
        } else {
            return this.SortNumber[DPosition.firstPosition];
        }
    }

    /**
     * 指定順位の元データ位置を返します。
     *
     * @param Order 先頭基準の順位です。
     * @returns ソート後その順位にある元配列位置です。
     */
    DataPosition(Order: number): number {
        return this.SortNumber[Order];
    }
    
    /**
     * 指定した逆順位の元データ位置を返します。
     *
     * @param OrderReverse 末尾基準の順位です。
     * @returns ソート後その逆順位にある元配列位置です。
     */
    DataPositionRev(OrderReverse: number): number {
        return this.SortNumber[this.DataNum - OrderReverse - 1];
    }

    /**
     * 指定順位の値を返します。
     *
     * @param Order 先頭基準の順位です。
     * @returns ソート済み配列上の値です。
     */
    DataPositionValue(Order: number): number {
        return this.Sortrr[Order];
    }

    /**
     * 指定した逆順位の値を返します。
     *
     * @param OrderReverse 末尾基準の順位です。
     * @returns ソート済み配列上の値です。
     */
    DataPositionRevValue(OrderReverse: number): number {
        const n = this.DataNum - OrderReverse - 1;
        return this.Sortrr[n];
    }
    
    /**
     * ソート前データを 1 件追加します。
     *
     * @param Value 追加する値です。
     */
    Add(Value: number): void {
        this.Sortrr.push(Value);
    }

    /**
     * 値配列をまとめて設定し、ソート処理まで実行します。
     *
     * @param ValueArray 追加対象の値配列です。
     */
    AddRange(ValueArray: number[]): void {
        this.Sortrr = ValueArray.slice();
        this.AddEnd();
    }
    
    /**
     * 追加済みデータを確定し、ソート済み索引を構築します。
     */
    AddEnd(): void {
        this.DataNum = this.Sortrr.length;
        this.SortNumber = this.Sorting(this.DataNum);
        this.DataPositionValue_Integer = [...this.Sortrr];
    }

    /**
     * 内部配列を昇順に並べ替え、元位置の対応表を返します。
     *
     * @param n ソート対象件数です。
     * @returns ソート後配列から元配列位置へ戻すための対応表です。
     */
    private Sorting(n: number): number[] {
        //'===========================================================
        //'ShelSort 指定された配列の整数をシェルソート
        //'             （改良挿入法）でソートする
        //' 0 1 2 3 4 5 にソート
        //'---------引数----------------------------------------------
        //'sortrr()   ここのデータをソートする
        //'sortrr_n()   ソート前の配列番号
        //'n    要素の数
        //'===========================================================
  
        const sortrr_n: number[] = [];
        for (let i = 0; i < n; i++) {
            sortrr_n.push(i);
        }

        let gap = Math.floor(n / 2); //数列のとびの初期値
        let TempD: number; // 一時的な交換用変数
        //とびが１のとき、普通の基本挿入法
        while (gap > 0) {
            //'数列番号－０からgapまで
            let k = 0;
            while (k < gap) {
                //'数列kの要素と比べる最初の要素
                let j = k + gap;
                //'数列kに挿入していく
                while (j < n) {
                    //'配列数まで
                    //'まず数列kの右端の要素と比べる
                    let i = j - gap;
                    while (i >= k) {
                        //数列kの最初の要素まで
                        if (this.Sortrr[i + gap] < this.Sortrr[i]) {
                            TempD = this.Sortrr[i + gap];
                            this.Sortrr[i + gap] = this.Sortrr[i];
                            this.Sortrr[i] = TempD;
                            TempD = sortrr_n[i];
                            sortrr_n[i] = sortrr_n[i + gap];
                            sortrr_n[i + gap] = TempD;

                        } else {
                            break;
                        }
                        //'１つずつ左にずれる
                        i -= gap;
                    }
                    //'１つずつ右にずれる
                    j += gap;
                }
                //'次の数列に
                k++;
            }
            //'とびの変更
            gap = Math.floor(gap / 2);
        }
        return sortrr_n;

    }
    
    /**
     * 二分探索で一致値の開始位置と件数を求めます。
     *
     * @param SearchValue 検索する値です。
     * @returns 一致件数と最初の位置です。未検出時は件数 -1 を返します。
     */
    private Search_Data_Multi(SearchValue: number): { Num_of_Equal_Data: number; firstPosition: number } {
        //'-------------------------
        //'SearchValue／探し出すデータ
        //'firstPosition／データの見つかった最初の位置
        //'Num_of_Equal_Data／同じ値のデータの個数
        //'-------------------------

        const retV: { Num_of_Equal_Data: number; firstPosition: number } = {Num_of_Equal_Data: -1, firstPosition: -1};
        if (this.DataNum === 0) {
            return retV;
        }
        let f = true;
        const mxx = this.DataNum - 1;
        let oh = mxx + 1;
        let ooh = -1;
        let H = Math.floor(mxx / 2);
        while (this.Sortrr[H] !== SearchValue) {
            if (SearchValue < this.Sortrr[H]) {
                oh = H;
                H = Math.floor((ooh + H) / 2);
                if (oh === H) {
                    f = false;
                    break;
                }
            } else {
                ooh = H;
                H = Math.floor((oh + H) / 2);
                if (ooh === H) {
                    f = false;
                    break;
                }
            }

        }
    
        if (f === false) {
            return retV;
        } else {
            if (H > 0) {
                while (this.Sortrr[H - 1] === SearchValue) {
                    H--;
                    if (H === 0) {
                        break;
                    }
                }
            }
            retV.firstPosition = H;

            if (H < this.DataNum) {
                while (this.Sortrr[H] === SearchValue) {
                    H++;
                    if (H === this.DataNum) {
                        break;
                    }
                }
            }
            retV.Num_of_Equal_Data = H - retV.firstPosition;
            return retV;
        }
    }

    /**
     * 重複している値を列挙し、その種類数を返します。
     *
     * @param SameV 重複値を書き込む配列です。
     * @returns 重複値の種類数です。
     */
    private Get_Same_value(SameV: number[]): number {
        //同じ値が含まれているケースを返す
        SameV.length = 0;
        let f = false;
        for (let i = 1; i < this.DataNum; i++) {
            if ((this.Sortrr[i - 1] === this.Sortrr[i]) && (f === false)) {
                SameV.push(this.Sortrr[i]);
                f = true;
            } else {
                f = false;
            }
        }
        return SameV.length;
    }

    /**
     * ソート済みデータから値ごとの件数一覧を作成します。
     *
     * @returns 各値と出現回数の配列です。
     */
    private Get_Each_value(): { value: number; num: number }[] {
        //重複しない個別の値とそれぞれの数のオブジェクトの配列を返す
        const EachV: { value: number; num: number }[] = [];
        let n = 1;
        for (let i = 1; i < this.DataNum; i++) {
            if (this.Sortrr[i - 1] !== this.Sortrr[i]) {
                EachV.push({value: this.Sortrr[i - 1], num: n});
                n = 0;
            }
            n++;
        }
        EachV.push({value: this.Sortrr[this.DataNum - 1], num: n});
        return EachV;
    }
}

