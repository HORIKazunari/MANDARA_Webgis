# Apache 推奨設定リスト

対象サイト:

- `https://webgis.celas.osaka-u.ac.jp/`
- 配備物は `dist/` の静的ファイル
- Apache 2.4 系を想定
- `apache2ctl`, `systemctl apache2` を使う Debian/Ubuntu 系構成を想定

この文書は、Apache の `conf` を一つずつ確認しながら更新するためのチェックリストです。
既に設定済みの項目があっても、実ファイルと実際のレスポンスの両方で確認してください。

## 方針

- 設定は 1 ファイル 1 目的で分ける
- 変更後は毎回 `sudo apache2ctl configtest` を実行する
- 反映前に `curl -I` でレスポンスヘッダを確認する
- 本番サイトでは directory listing と source map 公開を止める
- このアプリは外部タイル取得、YouTube 埋め込み、外部サイト新規タブ表示があるため、CSP は段階的に詰める

## 推奨ファイル構成

推奨する確認対象は次の通りです。

1. `/etc/apache2/apache2.conf`
2. `/etc/apache2/ports.conf`
3. `/etc/apache2/sites-available/000-default.conf` または対象 VirtualHost ファイル
4. `/etc/apache2/sites-available/default-ssl.conf` または対象 SSL VirtualHost ファイル
5. `/etc/apache2/conf-available/security-mandara.conf`
6. `/etc/apache2/conf-available/headers-mandara.conf`
7. `/etc/apache2/conf-available/compression-mandara.conf`
8. `/etc/apache2/conf-available/logging-mandara.conf`

`security-mandara.conf` などの分離ファイルは新設前提です。既存の `security.conf` に混ぜてもよいですが、検証時に差分が追いにくくなります。

## 1. apache2.conf

主な確認項目:

- `ServerTokens Prod`
- `ServerSignature Off`
- `<Directory /var/www/>` または対象 DocumentRoot に `Options -Indexes`
- `AllowOverride None`
- 不要な `.htaccess` 利用を避ける

確認ポイント:

- 自動 directory listing を許可していないか
- `AllowOverride All` になっていないか
- グローバルな `<Directory />` が緩すぎないか

推奨例:

```apache
ServerTokens Prod
ServerSignature Off

<Directory /var/www/>
    Options -Indexes +FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>
```

今回のサイトで特に重要な点:

- 実測では `/assets/`, `/data/`, `/map/` が一覧表示されていたため、`Options Indexes` がどこかで有効です
- まずここを止める

## 2. ports.conf

主な確認項目:

- `Listen 80`
- `Listen 443`
- 不要なポート待受がない

確認ポイント:

- 8080, 8000, 81 などの不要ポートを開けていないか
- IPv6 待受が意図通りか

## 3. HTTP VirtualHost

対象例:

- `/etc/apache2/sites-available/000-default.conf`
- `/etc/apache2/sites-available/webgis.celas.osaka-u.ac.jp.conf`

役割:

- 80 番で受けたアクセスを HTTPS にリダイレクトする
- 余計な設定を持たせない

推奨例:

```apache
<VirtualHost *:80>
    ServerName webgis.celas.osaka-u.ac.jp
    Redirect permanent / https://webgis.celas.osaka-u.ac.jp/
</VirtualHost>
```

確認ポイント:

- HTTP のまま配信していないか
- 一部だけ HTTPS、他が HTTP の混在になっていないか

## 4. HTTPS VirtualHost

対象例:

- `/etc/apache2/sites-available/default-ssl.conf`
- `/etc/apache2/sites-available/webgis.celas.osaka-u.ac.jp-le-ssl.conf`

役割:

- 証明書設定
- DocumentRoot 設定
- サイト単位の `<Directory>` 制御
- ログ出力設定

最低限確認する項目:

- `ServerName webgis.celas.osaka-u.ac.jp`
- `DocumentRoot /var/www/html`
- `SSLEngine on`
- `SSLCertificateFile`
- `SSLCertificateKeyFile`
- `Protocols h2 http/1.1`

推奨例:

```apache
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName webgis.celas.osaka-u.ac.jp
    DocumentRoot /var/www/html

    SSLEngine on
    Protocols h2 http/1.1
    SSLCertificateFile /path/to/fullchain.pem
    SSLCertificateKeyFile /path/to/privkey.pem

    <Directory /var/www/html>
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/webgis-error.log
    CustomLog ${APACHE_LOG_DIR}/webgis-access.log combined
</VirtualHost>
</IfModule>
```

確認ポイント:

- `Indexes` を VirtualHost 内で再度有効化していないか
- サイト専用ログに分けているか
- `mod_status` や `cgi` のような不要機能をこの VirtualHost に載せていないか

## 5. security-mandara.conf

役割:

- 露出しなくてよいファイル種別の拒否
- 危険なメソッド制限
- source map と dotfile の遮断

推奨例:

```apache
TraceEnable Off

<Location />
    <LimitExcept GET HEAD OPTIONS>
        Require all denied
    </LimitExcept>
</Location>

<FilesMatch "(?i)\.(map|md|log|sql|bak|old|orig|swp)$">
    Require all denied
</FilesMatch>

<FilesMatch "^\.">
    Require all denied
</FilesMatch>
```

補足:

- `.md` は公開したい場合だけ除外する
- `.map` は本番では基本的に拒否でよい
- `.git` は通常 `DocumentRoot` 外だが、念のため dotfile 拒否を入れる

今回のサイトで特に重要な点:

- 実測で `.js.map` が取得できていたので、ここは優先度が高い

## 6. headers-mandara.conf

役割:

- セキュリティヘッダの追加
- ブラウザ側の攻撃面の縮小

推奨例:

```apache
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

    Header always set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://cyberjapandata.gsi.go.jp https://tile.openstreetmap.org https://b.tile.opentopomap.org https://tiles.wmflabs.org https://gbank.gsj.jp https://ktgis.net; frame-src https://www.youtube.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests"
```

重要:

- この CSP は出発点です
- 実際には外部タイルの接続先をアプリ実装と合わせて再確認する
- `style-src 'unsafe-inline'` は現状のインライン style 利用を考えると当面必要
- `frame-src https://www.youtube.com` はトップページの埋め込み動画用
- `img-src https:` を厳しめに絞るなら、使っているタイルホストごとに列挙する

確認ポイント:

- ヘッダが 200, 304 の両方で付いているか
- `Header set` ではなく `Header always set` を使っているか
- CSP 導入後にアプリが壊れていないか

## 7. compression-mandara.conf

役割:

- 静的アセットの圧縮配信
- 帯域削減

推奨例:

```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/css application/javascript application/json image/svg+xml
</IfModule>

<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/html "access plus 0 seconds"
    ExpiresByType text/css "access plus 7 days"
    ExpiresByType application/javascript "access plus 7 days"
    ExpiresByType image/png "access plus 30 days"
    ExpiresByType image/jpeg "access plus 30 days"
    ExpiresByType image/gif "access plus 30 days"
    ExpiresByType image/webp "access plus 30 days"
    ExpiresByType image/x-icon "access plus 30 days"
</IfModule>
```

補足:

- Vite のハッシュ付き assets は長めのキャッシュでもよい
- `index.html` と `mandarawebgis.html` は短くする

## 8. logging-mandara.conf

役割:

- アクセスログとエラーログの明確化
- 異常検知のための材料確保

推奨項目:

- サイト専用 access log
- サイト専用 error log
- ログローテーション
- 403, 404, 5xx の定期確認

推奨例:

```apache
LogLevel warn
ErrorLog ${APACHE_LOG_DIR}/webgis-error.log
CustomLog ${APACHE_LOG_DIR}/webgis-access.log combined
```

追加で見たい観点:

- `.map` 取得
- `/data/`, `/map/`, `/assets/` への列挙アクセス
- 同一 IP からの高速連続アクセス

## 有効化したい Apache モジュール

必要候補:

- `headers`
- `ssl`
- `rewrite`
- `http2`
- `deflate`
- `expires`

確認コマンド:

```bash
apache2ctl -M | egrep 'headers|ssl|rewrite|http2|deflate|expires'
```

不要なら無効化を検討:

- `autoindex`
- `status`
- `cgi`
- `userdir`

補足:

- `autoindex` は完全に使わないなら無効化してよい
- ただし他サイト共用サーバーなら全体影響を見て判断する

## 設定後の確認コマンド

構文確認:

```bash
sudo apache2ctl configtest
```

反映:

```bash
sudo systemctl reload apache2
```

ヘッダ確認:

```bash
curl -I https://webgis.celas.osaka-u.ac.jp/
curl -I https://webgis.celas.osaka-u.ac.jp/mandarawebgis.html
curl -I https://webgis.celas.osaka-u.ac.jp/assets/main.js
```

遮断確認:

```bash
curl -I https://webgis.celas.osaka-u.ac.jp/assets/
curl -I https://webgis.celas.osaka-u.ac.jp/assets/main.js.map
curl -I https://webgis.celas.osaka-u.ac.jp/.git/HEAD
curl -I https://webgis.celas.osaka-u.ac.jp/server-status
```

期待値:

- `/assets/` は 403 または一覧非表示
- `.js.map` は 403 か 404
- `.git/HEAD` は 403 または 404
- `server-status` は外部から 403

## 今回のサイト向け優先順位

最優先:

1. `Options -Indexes` を有効化して directory listing 停止
2. `.map` の配信停止
3. セキュリティヘッダ追加
4. HTTP から HTTPS への統一

次点:

1. キャッシュ制御整理
2. ログ分離
3. 不要モジュール整理

## 変更記録の残し方

各 conf を更新したら、次の形式で残すと確認しやすいです。

```text
[日付]
- 対象ファイル:
- 変更内容:
- configtest:
- reload:
- curl確認:
- 問題有無:
```

## 注意

- CSP は一度で完成させず、まず Report-Only で試す方法もある
- このアプリは外部タイルや YouTube を使うため、極端に厳しい CSP を先に入れると動作不良になりやすい
- Apache 設定だけでは不十分で、公開用ビルドから source map を出さないことも必要
