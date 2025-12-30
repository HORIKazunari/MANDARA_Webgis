#!/bin/bash
# zlibrev.ts の var 宣言を const/let に変換するスクリプト
# 生成日: 2025-12-30

FILE="src/zlibrev.ts"

# バックアップを作成
cp "$FILE" "$FILE.backup"

echo "zlibrev.ts の var 宣言変換を開始します..."

# ========================================
# Phase 1: const に変換（再代入なし）
# ========================================

echo "Phase 1: 再代入されない変数を const に変換中..."

# グローバル定数
sed -i '' 's/^var COMPILED = false;/const COMPILED = false;/' "$FILE"
sed -i '' 's/^var USE_TYPEDARRAY =/const USE_TYPEDARRAY =/' "$FILE"
sed -i '' 's/^var ZLIB_CRC32_COMPACT =/const ZLIB_CRC32_COMPACT =/' "$FILE"
sed -i '' 's/^var ZLIB_STREAM_RAW_INFLATE_BUFFER_SIZE =/const ZLIB_STREAM_RAW_INFLATE_BUFFER_SIZE =/' "$FILE"
sed -i '' 's/^var ZLIB_RAW_INFLATE_BUFFER_SIZE =/const ZLIB_RAW_INFLATE_BUFFER_SIZE =/' "$FILE"

# 関数内で再代入されない変数（パターンマッチング）
# buildHuffmanTable 関数内
sed -i '' 's/var listSize = /const listSize = /' "$FILE"

# rev32_ 関数内の返り値計算用
sed -i '' 's/function rev32_(n) {/function rev32_(n) {/' "$FILE"

# ReverseTable の table
sed -i '' 's/var table = new /const table = new /' "$FILE"

# テーブル定義（再代入なし）
sed -i '' 's/var lengths = new (USE_TYPEDARRAY ? Uint8Array : Array)/const lengths = new (USE_TYPEDARRAY ? Uint8Array : Array)/' "$FILE"

# ========================================
# Phase 2: let に変換（再代入あり）
# ========================================

echo "Phase 2: 再代入される変数を let に変換中..."

# 非常に一般的なループ変数とカウンタ
sed -i '' 's/\bvar i\b/let i/g' "$FILE"
sed -i '' 's/\bvar j\b/let j/g' "$FILE"
sed -i '' 's/\bvar il\b/let il/g' "$FILE"
sed -i '' 's/\bvar jl\b/let jl/g' "$FILE"
sed -i '' 's/\bvar l\b/let l/g' "$FILE"
sed -i '' 's/\bvar t\b/let t/g' "$FILE"
sed -i '' 's/\bvar m\b/let m/g' "$FILE"
sed -i '' 's/\bvar n\b/let n/g' "$FILE"

# よく使われるカウンタ・インデックス変数
sed -i '' 's/\bvar pos\b/let pos/g' "$FILE"
sed -i '' 's/\bvar ip\b/let ip/g' "$FILE"
sed -i '' 's/\bvar op\b/let op/g' "$FILE"
sed -i '' 's/\bvar op1\b/let op1/g' "$FILE"
sed -i '' 's/\bvar op2\b/let op2/g' "$FILE"
sed -i '' 's/\bvar op3\b/let op3/g' "$FILE"

# インデックスとカウント
sed -i '' 's/\bvar index\b/let index/g' "$FILE"
sed -i '' 's/\bvar length\b/let length/g' "$FILE"
sed -i '' 's/\bvar count\b/let count/g' "$FILE"
sed -i '' 's/\bvar ci\b/let ci/g' "$FILE"

# ビット操作関連
sed -i '' 's/\bvar bitsbuf\b/let bitsbuf/g' "$FILE"
sed -i '' 's/\bvar bitsbuflen\b/let bitsbuflen/g' "$FILE"
sed -i '' 's/\bvar bitindex\b/let bitindex/g' "$FILE"
sed -i '' 's/\bvar bitLength\b/let bitLength/g' "$FILE"
sed -i '' 's/\bvar bits\b/let bits/g' "$FILE"
sed -i '' 's/\bvar bitlen\b/let bitlen/g' "$FILE"

# コード関連
sed -i '' 's/\bvar code\b/let code/g' "$FILE"
sed -i '' 's/\bvar codeLength\b/let codeLength/g' "$FILE"
sed -i '' 's/\bvar codeWithLength\b/let codeWithLength/g' "$FILE"
sed -i '' 's/\bvar codeDist\b/let codeDist/g' "$FILE"

# 値とサイズ
sed -i '' 's/\bvar value\b/let value/g' "$FILE"
sed -i '' 's/\bvar size\b/let size/g' "$FILE"
sed -i '' 's/\bvar current\b/let current/g' "$FILE"
sed -i '' 's/\bvar next\b/let next/g' "$FILE"
sed -i '' 's/\bvar prev\b/let prev/g' "$FILE"

# オクテット
sed -i '' 's/\bvar octet\b/let octet/g' "$FILE"

# 重複と反転
sed -i '' 's/\bvar skip\b/let skip/g' "$FILE"
sed -i '' 's/\bvar reversed\b/let reversed/g' "$FILE"
sed -i '' 's/\bvar rtemp\b/let rtemp/g' "$FILE"
sed -i '' 's/\bvar repeat\b/let repeat/g' "$FILE"
sed -i '' 's/\bvar rpt\b/let rpt/g' "$FILE"

# マッチング関連
sed -i '' 's/\bvar match\b/let match/g' "$FILE"
sed -i '' 's/\bvar matchKey\b/let matchKey/g' "$FILE"
sed -i '' 's/\bvar matchLength\b/let matchLength/g' "$FILE"
sed -i '' 's/\bvar matchMax\b/let matchMax/g' "$FILE"
sed -i '' 's/\bvar currentMatch\b/let currentMatch/g' "$FILE"

# 親子
sed -i '' 's/\bvar parent\b/let parent/g' "$FILE"
sed -i '' 's/\bvar swap\b/let swap/g' "$FILE"

# CRC とチェックサム
sed -i '' 's/\bvar crc\b/let crc/g' "$FILE"
sed -i '' 's/\bvar crc16\b/let crc16/g' "$FILE"
sed -i '' 's/\bvar crc32\b/let crc32/g' "$FILE"

# ファイル関連
sed -i '' 's/\bvar file\b/let file/g' "$FILE"
sed -i '' 's/\bvar filename\b/let filename/g' "$FILE"
sed -i '' 's/\bvar filenameLength\b/let filenameLength/g' "$FILE"
sed -i '' 's/\bvar extraField\b/let extraField/g' "$FILE"
sed -i '' 's/\bvar extraFieldLength\b/let extraFieldLength/g' "$FILE"
sed -i '' 's/\bvar comment\b/let comment/g' "$FILE"
sed -i '' 's/\bvar commentLength\b/let commentLength/g' "$FILE"

# その他の一般的な変数
sed -i '' 's/\bvar buffer\b/let buffer/g' "$FILE"
sed -i '' 's/\bvar output\b/let output/g' "$FILE"
sed -i '' 's/\bvar input\b/let input/g' "$FILE"
sed -i '' 's/\bvar offset\b/let offset/g' "$FILE"
sed -i '' 's/\bvar len\b/let len/g' "$FILE"
sed -i '' 's/\bvar nlen\b/let nlen/g' "$FILE"
sed -i '' 's/\bvar ratio\b/let ratio/g' "$FILE"
sed -i '' 's/\bvar tlen\b/let tlen/g' "$FILE"
sed -i '' 's/\bvar tmp\b/let tmp/g' "$FILE"
sed -i '' 's/\bvar str\b/let str/g' "$FILE"
sed -i '' 's/\bvar c\b/let c/g' "$FILE"
sed -i '' 's/\bvar x\b/let x/g' "$FILE"
sed -i '' 's/\bvar s\b/let s/g' "$FILE"
sed -i '' 's/\bvar r\b/let r/g' "$FILE"
sed -i '' 's/\bvar p\b/let p/g' "$FILE"

# ビット演算とシフト
sed -i '' 's/\bvar s1\b/let s1/g' "$FILE"
sed -i '' 's/\bvar s2\b/let s2/g' "$FILE"

# パラメータとフラグ
sed -i '' 's/\bvar flg\b/let flg/g' "$FILE"
sed -i '' 's/\bvar flags\b/let flags/g' "$FILE"
sed -i '' 's/\bvar hdr\b/let hdr/g' "$FILE"
sed -i '' 's/\bvar hlit\b/let hlit/g' "$FILE"
sed -i '' 's/\bvar hdist\b/let hdist/g' "$FILE"
sed -i '' 's/\bvar hclen\b/let hclen/g' "$FILE"

# 日付と時刻
sed -i '' 's/\bvar mtime\b/let mtime/g' "$FILE"
sed -i '' 's/\bvar date\b/let date/g' "$FILE"

# サイズ関連
sed -i '' 's/\bvar isize\b/let isize/g' "$FILE"
sed -i '' 's/\bvar plainSize\b/let plainSize/g' "$FILE"
sed -i '' 's/\bvar olength\b/let olength/g' "$FILE"
sed -i '' 's/\bvar newSize\b/let newSize/g' "$FILE"
sed -i '' 's/\bvar inflen\b/let inflen/g' "$FILE"

# テーブルと配列
sed -i '' 's/\bvar table\b/let table/g' "$FILE"
sed -i '' 's/\bvar startCode\b/let startCode/g' "$FILE"
sed -i '' 's/\bvar ti\b/let ti/g' "$FILE"

# 圧縮関連
sed -i '' 's/\bvar compressionMethod\b/let compressionMethod/g' "$FILE"
sed -i '' 's/\bvar needVersion\b/let needVersion/g' "$FILE"

# その他
sed -i '' 's/\bvar key\b/let key/g' "$FILE"
sed -i '' 's/\bvar weight\b/let weight/g' "$FILE"
sed -i '' 's/\bvar excess\b/let excess/g' "$FILE"
sed -i '' 's/\bvar half\b/let half/g' "$FILE"

# goog 関連
sed -i '' 's/\bvar namespace\b/let namespace/g' "$FILE"
sed -i '' 's/\bvar parts\b/let parts/g' "$FILE"
sed -i '' 's/\bvar part\b/let part/g' "$FILE"
sed -i '' 's/\bvar cur\b/let cur/g' "$FILE"
sed -i '' 's/\bvar path\b/let path/g' "$FILE"
sed -i '' 's/\bvar src\b/let src/g' "$FILE"
sed -i '' 's/\bvar provide\b/let provide/g' "$FILE"
sed -i '' 's/\bvar require\b/let require/g' "$FILE"

# ========================================
# Phase 3: 特殊なケース（const）
# ========================================

echo "Phase 3: 関数宣言やオブジェクトを const に変換中..."

# 関数定義を const にする（該当する場合）
# これらは通常パターンで処理されない特殊なケース

# goog オブジェクトの初期化
sed -i '' 's/^var goog = goog || {};$/const goog = goog || {};/' "$FILE"

# buildHuffmanTable などの関数参照
sed -i '' 's/var buildHuffmanTable = /const buildHuffmanTable = /' "$FILE"

# ========================================
# 検証
# ========================================

echo "変換完了！"
echo ""
echo "変換後の統計:"
echo "  const 宣言数: $(grep -c '^\s*const\s' "$FILE")"
echo "  let 宣言数: $(grep -c '^\s*let\s' "$FILE")"
echo "  残りの var 宣言数: $(grep -c '^\s*var\s' "$FILE")"
echo ""
echo "バックアップファイル: $FILE.backup"
echo ""
echo "注意: 一部の var は手動確認が必要な場合があります。"
