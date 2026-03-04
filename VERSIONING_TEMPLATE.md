# Git / GitHub バージョン管理テンプレート

このテンプレートは、ローカル Git 運用と GitHub 公開運用を同時に回すための実務用ひな形です。  
本プロジェクトは **元ソフト最終版 1.003** から再構成したため、**2.001 から再スタート**します。

---

## 1. バージョン規則

### 1.1 公開バージョン（Gitタグ / GitHub Release）
- 正式版: `2.001`, `2.002`, `2.003` ...
- 緊急修正版: `2.001.1`（必要な場合のみ）
- 事前版: `2.002-rc.1`, `2.002-beta.1`
- 破壊的変更（互換性を壊す）: `3.001` へ繰り上げ

### 1.2 package.json との対応（推奨）
`package.json` の `version` は semver 推奨のため、以下の対応にすると安全です。

| 表示用バージョン | package.json(version) |
|---|---|
| 2.001 | 2.1.0 |
| 2.002 | 2.2.0 |
| 2.010 | 2.10.0 |

※ GitHub のタグ/Release 表示は `v2.001` 形式を使います。

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
- `chore(release): 2.001`

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
git checkout -b release/2.001

npm run build

git add .
git commit -m "chore(release): 2.001"

# release ブランチを使った場合
git checkout main
git merge --no-ff release/2.001

git tag -a v2.001 -m "Release 2.001"
git push origin main
git push origin v2.001
```

---

## 4. GitHub 運用テンプレート

### 4.1 Milestone テンプレート
- タイトル: `v2.001`
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
- Milestone: v2.001
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
- Milestone: v2.001
```

### 4.4 GitHub Release ノートテンプレート（コピペ用）
```markdown
# v2.001

## 概要
2.001 系列の初回リリース。

## 追加
-

## 修正
-

## 変更
-

## 既知の注意点
-

## ハッシュ
- Tag: v2.001
- Commit: <SHA>
```

---

## 5. 初回導入テンプレート（v2.001）

### 5.1 初回だけ実施
- [ ] リポジトリに Milestone `v2.001` を作成
- [ ] ブランチ保護（`main`）を設定（PR 必須・レビュー必須）
- [ ] `CHANGELOG.md` に `v2.001` セクション作成
- [ ] タグ `v2.001` を作成
- [ ] GitHub Release を公開

### 5.2 以降の繰り返し
- [ ] 次版 Milestone（`v2.002` など）を先に作成
- [ ] Issue を Milestone に必ず紐付け
- [ ] リリース時にタグ + Release ノートを同時作成

---

## 6. 運用メモ
- バージョン番号の「正本」は **Git タグ** と **GitHub Release**。
- 実装履歴の「正本」は **Issue / PR**。
- 変更履歴の「読者向け正本」は **CHANGELOG.md**。
