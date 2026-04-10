
# Apache 設定差分案

対象:

- サイト: `webgis.celas.osaka-u.ac.jp`
- 配備先: `/var/www/html`
- 配備物: `dist/` の静的ファイル
- 想定 OS: Debian / Ubuntu 系
- 想定 Apache: 2.4 系

この文書は、前回作成した推奨設定リストを、実際のサーバー構成向けの差分案に落としたものです。
まだ実ファイルを見ていないため、ここでは「そのまま貼れる候補」を示します。

## 前提

まず、現在の有効設定を確認します。

```bash
sudo apache2ctl -S
sudo apache2ctl -M
ls -1 /etc/apache2/sites-enabled/
ls -1 /etc/apache2/conf-enabled/
```

特に確認したいこと:

- 実際に使っている VirtualHost ファイル名
- `mod_headers`, `mod_ssl`, `mod_rewrite`, `mod_http2`, `mod_deflate`, `mod_expires` の有無
- `autoindex` が有効かどうか

## 差分 1: apache2.conf

対象ファイル:

- `/etc/apache2/apache2.conf`

目的:

- サーバー情報の露出抑制
- directory listing 停止
- `.htaccess` 無効化

追加または確認する内容:

```apache
ServerTokens Prod
ServerSignature Off

<Directory /var/www/>
    Options -Indexes +FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>
```

置換の考え方:

- `Options Indexes FollowSymLinks` なら `Options -Indexes +FollowSymLinks` に変更
- `AllowOverride All` なら `AllowOverride None` に変更

今回のサイトでの効果:

- `/assets/`, `/data/`, `/map/` の一覧表示停止

## 差分 2: HTTP 側 VirtualHost

対象候補:

- `/etc/apache2/sites-available/000-default.conf`
- `/etc/apache2/sites-available/webgis.celas.osaka-u.ac.jp.conf`

目的:

- HTTP を HTTPS に統一

差分案:

```apache
<VirtualHost *:80>
    ServerName webgis.celas.osaka-u.ac.jp
    Redirect permanent / https://webgis.celas.osaka-u.ac.jp/
</VirtualHost>
```

補足:

- 既に別サイトと共有している場合は、対象 `ServerName` の VirtualHost だけに入れる
- `RewriteRule` でもよいが、この用途なら `Redirect permanent` の方が単純

## 差分 3: HTTPS 側 VirtualHost

対象候補:

- `/etc/apache2/sites-available/default-ssl.conf`
- `/etc/apache2/sites-available/webgis.celas.osaka-u.ac.jp-le-ssl.conf`

目的:

- 443 番の本体設定
- 配備先、ログ、Directory 制御の明示

差分案:

```apache
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName webgis.celas.osaka-u.ac.jp
    DocumentRoot /var/www/html

    SSLEngine on
    Protocols h2 http/1.1

    SSLCertificateFile /etc/ssl/certs/webgis.celas.osaka-u.ac.jp/fullchain.pem
    SSLCertificateKeyFile /etc/ssl/private/webgis.celas.osaka-u.ac.jp/privkey.pem

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

証明書パスについて:

- 実サーバーの証明書配置先に合わせて置換する
- `certbot` 管理なら通常は `/etc/letsencrypt/live/...` になる
- NII / SECOM 系の配布証明書なら学内運用の実パスに合わせる

## 差分 4: source map と dotfile を止める conf 追加

新規ファイル:

- `/etc/apache2/conf-available/security-mandara.conf`

目的:

- `.map` を外部公開しない
- dotfile を拒否
- 不要メソッドを拒否

新規ファイル内容:

```apache
TraceEnable Off

<Location />
    <LimitExcept GET HEAD OPTIONS>
        Require all denied
    </LimitExcept>
</Location>

<FilesMatch "(?i)\.(map|log|bak|old|orig|swp)$">
    Require all denied
</FilesMatch>

<FilesMatch "^\.">
    Require all denied
</FilesMatch>
```

補足:

- `.md` を拒否対象に入れるかは、サーバー上に置いているなら判断する
- `.map` は本番では拒否推奨

## 差分 5: セキュリティヘッダ用 conf 追加

新規ファイル:

- `/etc/apache2/conf-available/headers-mandara.conf`

目的:

- セキュリティヘッダ追加
- ブラウザ側の露出抑制

新規ファイル内容:

```apache
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"

    Header always set Strict-Transport-Security "max-age=31536000"

    Header always set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://cyberjapandata.gsi.go.jp https://tile.openstreetmap.org https://b.tile.opentopomap.org https://tiles.wmflabs.org https://gbank.gsj.jp https://ktgis.net; frame-src https://www.youtube.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests"
</IfModule>
```

重要:

- `includeSubDomains` は、配下サブドメイン全部を HTTPS 管理している場合だけ付ける
- このアプリは YouTube 埋め込みと外部タイル取得があるため、CSP はこの初期案から始める
- まずは `Content-Security-Policy-Report-Only` で試す運用も安全

Report-Only で始める場合の差分案:

```apache
Header always set Content-Security-Policy-Report-Only "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://cyberjapandata.gsi.go.jp https://tile.openstreetmap.org https://b.tile.opentopomap.org https://tiles.wmflabs.org https://gbank.gsj.jp https://ktgis.net; frame-src https://www.youtube.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests"
```

## 差分 6: 圧縮とキャッシュ制御用 conf 追加

新規ファイル:

- `/etc/apache2/conf-available/compression-mandara.conf`

目的:

- 静的ファイルの圧縮
- キャッシュ制御の整理

新規ファイル内容:

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

- `index.html` と `mandarawebgis.html` は短キャッシュ
- ハッシュ付き `assets/*.js`, `assets/*.css` は長くしてもよいが、まずは 7 日でも十分

## 差分 7: AutoIndex を無効化

確認コマンド:

```bash
apache2ctl -M | grep autoindex
```

もし不要なら:

```bash
sudo a2dismod autoindex
```

補足:

- 全サーバー共通で directory listing を使っていないなら無効化してよい
- ただし学内共用サーバーなら、他サイト影響を見て判断する

## 差分 8: 必要モジュールの有効化

有効化候補:

```bash
sudo a2enmod headers
sudo a2enmod rewrite
sudo a2enmod ssl
sudo a2enmod http2
sudo a2enmod deflate
sudo a2enmod expires
```

conf 有効化:

```bash
sudo a2enconf security-mandara
sudo a2enconf headers-mandara
sudo a2enconf compression-mandara
```

## 差分 9: 反映手順

```bash
sudo apache2ctl configtest
sudo systemctl reload apache2
```

もし VirtualHost を新設した場合:

```bash
sudo a2ensite webgis.celas.osaka-u.ac.jp.conf
sudo a2dissite 000-default.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

## 差分 10: 反映後の確認コマンド

### 1. 基本ヘッダ確認

```bash
curl -I https://webgis.celas.osaka-u.ac.jp/
curl -I https://webgis.celas.osaka-u.ac.jp/mandarawebgis.html
```

見る項目:

- `Strict-Transport-Security`
- `Content-Security-Policy` または `Content-Security-Policy-Report-Only`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `X-Frame-Options`

### 2. directory listing 停止確認

```bash
curl -I https://webgis.celas.osaka-u.ac.jp/assets/
curl -I https://webgis.celas.osaka-u.ac.jp/data/
curl -I https://webgis.celas.osaka-u.ac.jp/map/
```

期待値:

- 200 の HTML 一覧表示ではない
- 理想は 403

### 3. source map 拒否確認

```bash
curl -I https://webgis.celas.osaka-u.ac.jp/assets/main.js.map
curl -I https://webgis.celas.osaka-u.ac.jp/assets/encoding-c49saR4o.js.map
```

期待値:

- 403 または 404

### 4. dotfile / status 確認

```bash
curl -I https://webgis.celas.osaka-u.ac.jp/.git/HEAD
curl -I https://webgis.celas.osaka-u.ac.jp/server-status
```

期待値:

- 403 または 404

## 最短でやるならこの順番

1. `apache2.conf` と HTTPS VirtualHost で `Options -Indexes` を入れる
2. `security-mandara.conf` を追加して `.map` を拒否する
3. `headers-mandara.conf` を追加して基本ヘッダを出す
4. `configtest` と `reload`
5. `curl -I` で確認

## 今回のサイト向け注意

- アプリ側が production build で `.map` を出さないことも並行で必要
- Apache 側で `.map` を止めても、配備物に残っていると運用ミス時に再露出する
- CSP は外部タイル提供元が増減すると追従が必要
- 将来サブドメイン全体を HTTPS 管理できるなら、その時点で HSTS に `includeSubDomains` を付ける

## 実作業用メモ欄

```text
[apache2.conf]
確認結果:
変更有無:

[HTTP VirtualHost]
確認結果:
変更有無:

[HTTPS VirtualHost]
確認結果:
変更有無:

[security-mandara.conf]
作成有無:

[headers-mandara.conf]
作成有無:

[compression-mandara.conf]
作成有無:

[configtest]

[curl 確認]
```
