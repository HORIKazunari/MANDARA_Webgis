#!/bin/bash

# state参照を修正するスクリプト
# 各静的メソッドの先頭に `const state = appState();` を追加

FILES=(
  "src/clsAccessory.ts"
  "src/clsAttrData.ts"
  "src/clsGeneric.ts"
  "src/clsGrid.ts"
  "src/clsPrint.ts"
  "src/clsWindow.ts"
  "src/frmPrint.ts"
  "src/main.ts"
)

for file in "${FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "ファイルが見つかりません: $file"
    continue
  fi
  
  echo "処理中: $file"
  
  # AWKスクリプトで処理
  # メソッドの開始直後に `const state = appState();` を追加
  # - static メソッド
  # - function 宣言
  # - export function 宣言
  # ただし、既に `const state = appState();` がある場合は追加しない
  
  awk '
  BEGIN {
    in_method = 0
    method_line = 0
    has_state = 0
  }
  
  # メソッド/関数の開始を検出
  /static [a-zA-Z_][a-zA-Z0-9_]*\(/ || /^[[:space:]]*function [a-zA-Z_][a-zA-Z0-9_]*\(/ || /^[[:space:]]*export function [a-zA-Z_][a-zA-Z0-9_]*\(/ {
    in_method = 1
    method_line = NR
    has_state = 0
    print $0
    next
  }
  
  # メソッド/関数内で開き括弧を検出
  in_method && /{/ {
    print $0
    # 次の行までチェックを継続
    getline
    # 既にconst state があるかチェック
    if ($0 ~ /const state = appState\(\)/) {
      has_state = 1
      print $0
    } else if ($0 !~ /^[[:space:]]*$/ && $0 !~ /^[[:space:]]*\/\//) {
      # 空行やコメント行でなければ、state定義を挿入
      print "        const state = appState();"
      print $0
    } else {
      print $0
    }
    in_method = 0
    next
  }
  
  # その他の行はそのまま出力
  {
    print $0
  }
  ' "$file" > "${file}.tmp"
  
  # バックアップを作成して置換
  mv "$file" "${file}.backup"
  mv "${file}.tmp" "$file"
  
  echo "完了: $file (バックアップ: ${file}.backup)"
done

echo ""
echo "全ての処理が完了しました。"
echo "tscでエラーが減ったか確認してください: npm run type-check"
