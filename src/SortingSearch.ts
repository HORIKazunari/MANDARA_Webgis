/**
 * Utility to sort values while keeping track of their original indices.
 * Supports duplicate detection and index lookups after sorting.
 */
export class clsSortingSearch {
    private SortNumber: number[] = [];
    private Sortrr: number[] = [];
    private DataNum: number = 0;
    DataPositionValue_Integer: number[] = [];

    init() {
        this.SortNumber = [];
        this.Sortrr = [];
        this.DataPositionValue_Integer = [];
        this.DataNum = 0;
    }

    NumofData() {
        return this.DataNum;
    }

    /**元のデータのPositionのソート後の先頭からの位置を返す */
    getAfterSortPosition(originalPosition: number) {
        return this.SortNumber.indexOf(originalPosition);
    }

    /**元のデータのPositionのソート後の後ろからの位置を返す */
    getAfterSortPositionRev(originalPosition: number) {
        return (this.DataNum - 1 - this.SortNumber.lastIndexOf(originalPosition));
    }
    
    SameValue_Number() {
        /// <summary>データ中に同じ値がどれだけあるか返す</summary>
        const SV: number[] = [];
        return this.Get_Same_value(SV);
    }
    
    /**重複しない個別の値とそれぞれの数のオブジェクトの配列を返す */
    EachValue_Array() {
        return this.Get_Each_value();
    }
    
    SameValue_Array(SameValueArray: number[]) {
        /// <summary>データ中の同じ値が含まれているケースを配列で返す</summary>
        const n = this.Get_Same_value(SameValueArray);
        return n;
    }
    
    SearchData_Array(SearchValue: number) {
        /// <summary>指定した検索値と等しいデータ番号を配列で返す</summary>
        let EQn: number;
        const DataNumberArray: number[] = [];
        const DPosition = this.Search_Data_Multi(SearchValue);
        EQn = DPosition.Num_of_Equal_Data;
        if (EQn != -1) {
            for (let i = 0; i < EQn; i++) {
                DataNumberArray.push(this.SortNumber[DPosition.firstPosition + i]);
            }
        }
        return DataNumberArray;
    }

    SearchData_One(SearchValue: number) {
        /// <summary>指定した検索値と等しいデータ番号を一つ返す</summary>
        const DPosition = this.Search_Data_Multi(SearchValue);
        if (DPosition.Num_of_Equal_Data == -1) {
            return -1;
        } else {
            return this.SortNumber[DPosition.firstPosition];
        }
    }

    DataPosition(Order: number) {
        /// <summary>指定した順位のデータ番号を返す</summary>
        return this.SortNumber[Order];
    }
    
    DataPositionRev(OrderReverse: number) {
        /// <summary>指定した逆順位のデータ番号を返す</summary>
        return this.SortNumber[this.DataNum - OrderReverse - 1];
    }

    DataPositionValue(Order: number) {
        /// <summary>指定した順位のデータ値を返す</summary>
        return this.Sortrr[Order];
    }

    DataPositionRevValue(OrderReverse: number) {
        /// <summary>指定した逆順位のデータ値を返す</summary>
        const n = this.DataNum - OrderReverse - 1;
        return this.Sortrr[n];
    }
    
    Add(Value: number) {
        /// <summary>データの追加</summary>
        this.Sortrr.push(Value);
    }

    AddRange(ValueArray: number[]) {
        this.Sortrr = ValueArray.slice();
        this.AddEnd();
    }
    
    AddEnd() {
        /// <summary>データの追加終了</summary>
        this.DataNum = this.Sortrr.length;
        this.SortNumber = this.Sorting(this.DataNum);
        this.DataPositionValue_Integer = [...this.Sortrr];
    }

    private Sorting(n: number) {
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
    
    private Search_Data_Multi(SearchValue: number) {
        //'-------------------------
        //'SearchValue／探し出すデータ
        //'firstPosition／データの見つかった最初の位置
        //'Num_of_Equal_Data／同じ値のデータの個数
        //'-------------------------

        const retV: { Num_of_Equal_Data: number; firstPosition: number } = {Num_of_Equal_Data: -1, firstPosition: -1};
        if (this.DataNum == 0) {
            return retV;
        }
        let f = true;
        const mxx = this.DataNum - 1;
        let oh = mxx + 1;
        let ooh = -1;
        let H = Math.floor(mxx / 2);
        while (this.Sortrr[H] != SearchValue) {
            if (SearchValue < this.Sortrr[H]) {
                oh = H;
                H = Math.floor((ooh + H) / 2);
                if (oh == H) {
                    f = false;
                    break;
                }
            } else {
                ooh = H;
                H = Math.floor((oh + H) / 2);
                if (ooh == H) {
                    f = false;
                    break;
                }
            }

        }
    
        if (f == false) {
            return retV;
        } else {
            if (H > 0) {
                while (this.Sortrr[H - 1] == SearchValue) {
                    H--;
                    if (H == 0) {
                        break;
                    }
                }
            }
            retV.firstPosition = H;

            if (H < this.DataNum) {
                while (this.Sortrr[H] == SearchValue) {
                    H++;
                    if (H == this.DataNum) {
                        break;
                    }
                }
            }
            retV.Num_of_Equal_Data = H - retV.firstPosition;
            return retV;
        }
    }

    private Get_Same_value(SameV: number[]) {
        //同じ値が含まれているケースを返す
        SameV.length = 0;
        let f = false;
        for (let i = 1; i < this.DataNum; i++) {
            if ((this.Sortrr[i - 1] == this.Sortrr[i]) && (f == false)) {
                SameV.push(this.Sortrr[i]);
                f = true;
            } else {
                f = false;
            }
        }
        return SameV.length;
    }

    private Get_Each_value() {
        //重複しない個別の値とそれぞれの数のオブジェクトの配列を返す
        const EachV: { value: number; num: number }[] = [];
        let n = 1;
        for (let i = 1; i < this.DataNum; i++) {
            if (this.Sortrr[i - 1] != this.Sortrr[i]) {
                EachV.push({value: this.Sortrr[i - 1], num: n});
                n = 0;
            }
            n++;
        }
        EachV.push({value: this.Sortrr[this.DataNum - 1], num: n});
        return EachV;
    }
}

// Legacy global exposure for existing code paths
// TODO: progressively replace with explicit imports where used
(globalThis as typeof globalThis & { clsSortingSearch?: typeof clsSortingSearch }).clsSortingSearch = clsSortingSearch;