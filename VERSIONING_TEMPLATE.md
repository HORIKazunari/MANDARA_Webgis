# Git / GitHub バージョン管理テンプレート

このテンプレートは、ローカル Git 運用と GitHub 公開運用を同時に回すための実務用ひな形です。  
本プロジェクトは **元ソフト最終版 1.003** から再構成したため、以後は **semver 形式で 2.2.6 のように管理**します。

---

## 1. バージョン規則

### 1.1 公開バージョン（Gitタグ / GitHub Release）
- 正式版: `2.2.6`, `2.2.7`, `2.3.0` ...
- 緊急修正版: patch を 1 つ上げる（例: `2.2.6` → `2.2.7`）
- 事前版: `2.2.6-rc.1`, `2.2.6-beta.1`
- 破壊的変更（互換性を壊す）: `3.0.0` へ繰り上げ

### 1.2 package.json / 表示 / タグの対応
`package.json` の `version`、UI の表示バージョン、Git タグは同じ値にそろえます。

| 用途 | 例 |
|---|---|
| 表示用バージョン | 2.2.6 |
| package.json(version) | 2.2.6 |
| Git タグ | v2.2.6 |
| GitHub Release | v2.2.6 |

※ GitHub のタグ/Release 表示は `v2.2.3` 形式を使います。

---

## 2. ローカル Git 運用ルール

### 2.1 ブランチ命名
- `main` : 常にリリース可能状態
- `feature/<機能名>` : 新機能
- `fix/<不具合名>` : 不具合修正
- `release/<version>` : リリース直前調整（任意）

### 2.2 コミット規約（例）
- `feat: ...`
- `fix: ...`
- `refactor: ...`
- `docs: ...`
- `chore(release): 2.2.3`

### 2.3 1リリースの最小チェック
- [ ] `npm run build` が成功
- [ ] 主要画面の手動確認
- [ ] `CHANGELOG.md` 更新
- [ ] バージョン番号（表示/ドキュメント）更新

---

## 3. リリース作業テンプレート（ローカル）

### 3.1 実施手順
1. `main` 最新化
2. 必要なら `release/<version>` ブランチ作成
3. `CHANGELOG.md` と関連ドキュメント更新
4. ビルド・確認
5. `main` に反映
6. タグ作成
7. GitHub へ push（`main` とタグ）

### 3.2 コマンド雛形
```bash
git checkout main
git pull origin main

# 任意: リリース調整ブランチ
git checkout -b release/2.2.6

npm run build

git add .
git commit -m "chore(release): 2.2.6"

# release ブランチを使った場合
git checkout main
git merge --no-ff release/2.2.6

git tag -a v2.2.6 -m "Release 2.2.6"
git push origin main
git push origin v2.2.3
```

---

## 4. GitHub 運用テンプレート

### 4.1 Milestone テンプレート
- タイトル: `v2.2.3`
- 期限: `YYYY-MM-DD`
- 説明:
  - 対象範囲:
  - 完了条件:
  - 除外範囲:

### 4.2 Issue テンプレート（コピペ用）
```markdown
## 背景

## 目的

## 対応内容
- [ ]
- [ ]

## 受け入れ条件
- [ ]

## 関連
- Milestone: v2.2.3
- PR:
```

### 4.3 Pull Request テンプレート（コピペ用）
```markdown
## 概要

## 変更内容
-

## 動作確認
- [ ] npm run build
- [ ] 手動確認（要点）

## 影響範囲

## 関連 Issue / Milestone
- Issue:
- Milestone: v2.2.3
```

### 4.4 GitHub Release ノートテンプレート（コピペ用）
```markdown
# v2.2.3

## 概要
2.2.3 系列のリリース。

## 追加
-

## 修正
-

## 変更
-

## 既知の注意点
-

## ハッシュ
- Tag: v2.2.3
- Commit: <SHA>
```

---

## 5. 初回導入テンプレート（v2.2.3）

### 5.1 初回だけ実施
- [ ] リポジトリに Milestone `v2.2.3` を作成
- [ ] ブランチ保護（`main`）を設定（PR 必須・レビュー必須）
- [ ] `CHANGELOG.md` に `v2.2.3` セクション作成
- [ ] タグ `v2.2.3` を作成
- [ ] GitHub Release を公開

### 5.2 以降の繰り返し
- [ ] 次版 Milestone（`v2.2.4` や `v2.3.0` など）を先に作成
- [ ] Issue を Milestone に必ず紐付け
- [ ] リリース時にタグ + Release ノートを同時作成

---

## 6. 運用メモ
- バージョン番号の「正本」は **Git タグ** と **GitHub Release**。
- 実装履歴の「正本」は **Issue / PR**。
- 変更履歴の「読者向け正本」は **CHANGELOG.md**。
