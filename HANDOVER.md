# SHIP Website 引き継ぎ書

別の Claude アカウント／別の担当者がこのリポジトリの作業を引き継ぐためのドキュメントです。
**新しいセッションを始めたら、まずこのファイルを読んでください。**

- リポジトリ: `takemoko-0556/SHIP-website`
- 公開ドメイン（メタタグ上の想定）: https://ship-nanbo.com/
- 最終更新: 2026-09-06（画像最適化・ハッシュタグ整理・下層ページ統合）

---

## 1. プロジェクト概要

千葉県南房総市・岩井にある複合施設「SHIP」の公式サイト。
廃・保養所をリノベーションし、カフェ／民泊／イベント等を運営している施設の紹介サイトです。

**技術構成はきわめてシンプルで、ビルド工程は一切ありません。**

| 項目 | 内容 |
|---|---|
| 種別 | 静的サイト（素の HTML / CSS / JavaScript） |
| フレームワーク | なし（React・Vue・SSG いずれも不使用） |
| パッケージ管理 | なし（`package.json` は存在しない） |
| ビルド | 不要。HTML を直接編集して push するだけ |
| CMS | microCMS（お知らせ・コンテンツページ本文） |
| フォント | Google Fonts `Zen Maru Gothic` |
| 言語 | 日本語（`<html lang="ja">`）、UI ラベルは英語＋和文併記 |

ローカル確認は任意の静的サーバでよい（例: `python3 -m http.server 8000` → http://localhost:8000 ）。
`file://` で直接開くと microCMS への fetch が CORS で失敗するので、必ずサーバ経由で確認すること。

---

## 2. ディレクトリ構成

```
/
├── index.html          … トップページ（全セクションを内包する一枚もの）
├── css/
│   ├── style.css       … 全ページ共通（デザイントークン・サイドバー・トップ各セクション）
│   ├── page.css        … 下層ページ共通（page-hero / gallery / cms-body 等）
│   ├── stay.css        … 宿泊ページ専用
│   └── goat.css        … ヤギページ専用
├── js/
│   ├── script.js       … トップ専用（ローディング／ハンバーガー／スクロール演出／ヒーロー画像切替）
│   ├── page.js         … 下層ページ共通（ハンバーガー／ギャラリーのタップ表示）
│   ├── news.js         … microCMS「news」API とお知らせ描画
│   ├── content.js      … microCMS「contents」API とコンテンツページ描画
│   ├── stay.js         … 宿泊ページのタブ＆スライダー
│   └── goat.js         … ヤギカードのタップ表示
├── pages/              … 下層ページ（詳細は §4）
├── images/             … 画像一式（カテゴリごとのディレクトリ）
└── .github/workflows/auto-merge.yml … claude/** ブランチを main に自動マージ
```

---

## 3. トップページ（index.html）の構造

上から順に以下のブロックで構成されています。

1. **Loading Cover** — `images/common/logo-ship.png` を 1 秒表示してフェードアウト（`js/script.js`）
2. **Mobile Header + ハンバーガーメニュー** — 820px 以下で表示。メニュー先頭に LINE 友だち追加 CTA
3. **左サイドバー（PC 固定）** — ロゴ／ハッシュタグ（公開中の 6 個）／LINE CTA／ナビゲーション
4. **Hero Visual** — 大きな画像 1 枚＋キャッチコピー
5. **`#news`** — microCMS から最新 3 件を描画、4 件以上あれば「もっとみる」ボタン
6. **`#about`** — SHIP について（本文＋挿入画像 3 点）
7. **`#concept`** — Friendship / Partnership / Relationship の「-ship」コンセプト
8. **`#access`** — Google Maps 埋め込み、所在地、車／電車／高速バス、営業時間
9. **`#contact`** — 案内文＋メールアドレス直書き＋SNS ボタン（Instagram / X / LINE）
10. **Footer** — ロゴ、ナビ、コピーライト

### ナビゲーションの並び順（統一ルール）
`News → About → Concept → Access → Contact`
サイドバー・モバイルメニュー・フッターの 3 か所すべてで同じ順序に揃えてあります。
**ナビ項目を増減するときは 3 か所＋`pages/` 配下の全 HTML を同時に直す必要があります。**

### ハッシュタグ ⇔ ヒーロー画像の連動（js/script.js）
- ハッシュタグに `data-image` 属性でヒーロー画像パスを持たせている
- **ホバー** すると 500ms のクロスフェードでヒーロー画像が切り替わる
- **クリック** すると `pages/content.html?slug=xxx` に遷移する
- 無操作時は 4 秒ごとに自動スライド（`startAutoSlide`）
- ヒーロー画像の右下 40%×20% の平均輝度を canvas で測定し、明るければキャッチコピーを暗い文字色（`.dark`）に切り替える（`updateCatchphraseColor`）

### 主な問い合わせ先リンク（変更時は全 HTML を横断置換）
- LINE 公式: `https://lin.ee/QGhQUZm`（サイドバー／モバイルメニュー／Contact の 3 系統）
- Instagram: `https://www.instagram.com/ship_iwai_park/`
- X: `https://x.com/sh_i_p`
- メール: `info@nanbo-kikaku.jp`（Contact セクションに直書き。以前あったメールボタンは廃止済み）

---

## 4. 下層ページ（pages/）

2026-09-06 に旧世代の静的個別ページを削除し、microCMS 駆動に一本化しました。

### microCMS 駆動の汎用ページ
- **`content.html`** … `?slug=xxx` で microCMS の `contents` から取得して描画する汎用テンプレート
  - 該当コンテンツが無い／タイトルが `【非公開】` で始まる場合は「準備中です」画面を表示
  - `heroImage` / `description` / `gallery` / `body`（リッチエディタ）を描画
  - ギャラリーの alt を `「タイトル」説明文` の形式で書くと、キャプションが見出し＋本文に分解される
  - サイドバーの `.hashtag` に `data-slug` を持たせ、開いている slug のタグを `active` にする
- **`news-list.html`** … お知らせ一覧（microCMS から最大 100 件）
- **`news.html`** … お知らせ詳細（`?id=xxx`）

### ハッシュタグ（トップ・全下層ページで統一）
**トップも下層も、サイドバー／モバイルのハッシュタグは全て `content.html?slug=` を指します。**
現在表示しているのは **microCMS に公開済みの 7 個のみ**（この順）:
`cafe, coffee, training, pizzaworkshop, bbq, goat, beer`

非公開・未作成のため一旦ハッシュタグから外した slug:
`stay, bonfire, diy, park, event, fishing`
→ microCMS で公開したら、`index.html`（`sidebar-tags` と `mobile-tags-inner`）と
`pages/content.html`（`sidebar-tags`）の 3 か所にタグを追加すれば復活します。
並び順もこの 3 か所で揃えること。

（※ `pizzaworkshop` だけ画像ディレクトリ名が `images/pizza workshop/`。スペース入りなので扱いに注意。
`data-image` は従来どおり `images/pizza/hero.jpg` を使用）

### 作り込み済みの静的ページ（ハッシュタグからは未リンク）
- **`stay.html`** … 宿泊（部屋タブ＋スライダー）。宿泊事業を始めるときにハッシュタグ `#宿泊` を復活させて接続する
- **`cycle.html`** `sauna.html` … `stay.html` の有料オプションからのみリンク

### 削除済み（2026-09-06）
旧静的個別ページ `bbq/beer/bonfire/cafe/coffee/diy/event/park/pizza/training.html`（内容は microCMS へ移行済み）、
未リンクの孤児 `kitchen/workshop/news-001/news-002.html`、
`goat.html`（microCMS の `goat` に一本化）。

---

## 5. microCMS 連携

- サービス ID: `ship` / エンドポイント: `news`（お知らせ）, `contents`（コンテンツ）
- API キーは **`js/news.js` と `js/content.js` の冒頭に定数としてベタ書き**されています（2 ファイルに同じ値が重複）。
- 取得しているフィールド
  - `news`: `title`, `publishedAt`, `category.name`, `content`
  - `contents`: `slug`, `title`, `description`, `heroImage`, `gallery[]`, `body`
- **画像の最適化（2026-09-06〜）**: `js/content.js` の `optimizeImage()` が microCMS 画像 URL に
  `?w=…&q=80&auto=format,compress` を付与（ヒーロー1600 / ギャラリー1000 / 本文1200）。
  `auto=format` で対応ブラウザには WebP を自動配信。**CMS にアップする画像を事前縮小する必要はない**。
- カテゴリ名 → バッジ色のマッピングは `js/news.js` の `getBadgeClass()`。
  `更新情報`/`お知らせ` → `update`、`重要`/`イベント` → `coming-soon`。**新カテゴリを microCMS 側で増やしたらここも追記が必要。**
- 日付フォーマットは `formatDate()` で `2026.02.17` 形式に変換。

> **セキュリティ上の注意（引き継ぎ先で必ず確認）**
> API キーがフロントエンドのソースにあるため、公開サイトの閲覧者から取得可能な状態です。microCMS の GET 専用キーであれば実運用上ありがちな構成ですが、**リポジトリが公開の場合は特に、キーの権限が GET のみに限定されているか・許可リファラ（ドメイン制限）が設定されているかを microCMS 管理画面で確認してください。** 権限が広い場合は速やかにローテーションを。

---

## 6. デザイン規約

### カラートークン（`css/style.css` の `:root`）
```css
--black: #222;    --white: #fff;
--gray-100: #f7f7f7;  --gray-200: #efefef;  --gray-300: #ddd;
--gray-400: #bbb;     --gray-500: #888;     --gray-600: #666;
--accent: #c23;       --brand: #0055a0;
--max-width: 1200px;  --sidebar-width: 320px;
```

### ブレークポイント
| 幅 | 挙動 |
|---|---|
| 1024px 以下 | サイドバー幅を 240px に縮小 |
| 820px 以下 | サイドバーを隠しモバイルヘッダー＋ハンバーガーに切替 |
| 480px 以下 | フォントサイズ・余白をさらに調整 |

### スクロール演出
`.reveal` / `.reveal-left` / `.reveal-right` / `.reveal-scale` クラスを IntersectionObserver で監視し、
表示されたら `.visible` を付与。`data-delay="200"` で遅延指定。
**動的に DOM を追加した場合は `revealObserver.observe(el)` の再登録が必要**（`renderNewsList()` 内で実施済み）。
アニメーション完了後は `transform: none` にして合成レイヤーを解放している（描画負荷対策の既存修正）。

### ホバーの扱い
ギャラリーのホバー表示は `@media (hover: hover)` で本物のホバー環境に限定し、
タッチ端末では `js/page.js` / `js/goat.js` の **タップでキャプションをトグル**する実装に切り替えています。

### URL の書き方
内部リンクからは `index.html` を除去して `../` や `./` の形に統一済み（`pages/` からトップへは `../`）。
**新規リンクを書くときも `index.html` を付けないこと。**

---

## 7. Git / デプロイのワークフロー ★重要

### 自動マージ（`.github/workflows/auto-merge.yml`）
```
claude/** ブランチへ push  →  GitHub Actions が自動で main にマージして push
```
**`claude/` で始まるブランチに push した時点で、実質 main へ反映されます。**
レビューを挟みたい変更を安易に push しないこと。

### 作業手順
```bash
git checkout -b claude/<作業内容を表す名前>
# 編集
git add -A
git commit -m "update: 変更内容を日本語で簡潔に"
git push -u origin claude/<ブランチ名>
```

### コミットメッセージの慣習（既存 59 コミットの傾向）
`feat:` 機能追加 / `fix:` 不具合修正 / `update:` 文言・デザイン調整 /
`add:` 画像・ファイル追加 / `style:` 見た目のみ / `chore:` 設定・URL 差し替え / `copy:` 文言修正
**本文は日本語**で書くのが既存の統一ルールです。

### 本番反映先
`main` にマージされた内容が `https://ship-nanbo.com/` に公開されている想定ですが、
**リポジトリ内に `CNAME` もデプロイ用ワークフローも存在しません。**
GitHub Pages の設定画面、あるいは Netlify 等の外部サービス側で連携されている可能性が高いです。
**引き継ぎ先で最初に、どこにどうデプロイされているかを施設側／前任者に確認してください。**（本ドキュメント最大の未確定事項）

---

## 8. これまでの主な作業履歴（新しい順・抜粋）

| 内容 |
|---|
| 画像最適化（236MB→19MB）、下層ページを microCMS 一本化、ハッシュタグを公開中6個に整理 |
| About リード文から「宿泊」を削除 |
| 内部リンクから `index.html` を除去し URL を整理（全ページ 4 回に分けて実施） |
| Contact のメールボタンを廃止し、案内文の下にメールアドレスを直接表示 |
| OGP 画像とメタタグを追加、絶対 URL 化。タイトルを「SHIP」に簡素化 |
| ファビコン整備（背景透過・トリミング・`favicon.ico` 同期） |
| ギャラリーのホバーを hover 対応端末に限定し、モバイルはタップ表示に |
| メニュー順を `News → About → Concept → Access → Contact` に統一 |
| お知らせ一覧ページを追加、トップは新着 3 件＋「もっとみる」導線に変更 |
| 下層ページのモバイルで固定ヘッダーにコンテンツが隠れる問題を修正 |
| 公式 LINE 友だち追加 CTA をサイドバー／モバイルメニュー／Contact に設置 |
| About セクションの文言・写真配置整理、リノベ開始時期を「2025年9月から」に |
| Access の営業時間を「土日祝 10:00〜17:00（不定期で夜カフェ）」に更新 |
| ローディングロゴを画像化、reveal 後の transform 解放で描画負荷を軽減 |

---

## 9. 引き継ぎ後に着手すべき課題

優先度順に並べています。

1. **microCMS API キーの権限確認（最優先）**（§5 の注意書き参照）
   キーが公開リポジトリに平文で入っている。管理画面で「GET 限定か」「許可オリジンに `https://ship-nanbo.com` が設定されているか」を確認。広い権限なら再発行。

2. **非公開コンテンツの公開 → ハッシュタグ復活**
   `stay, bonfire, diy, park, event, fishing` は現在ハッシュタグから外している（§4）。
   microCMS で公開したら `index.html` の 2 か所と `pages/content.html` の 1 か所にタグを追加する。

3. **`images/pizza workshop/` のディレクトリ名にスペース**
   URL エンコードが必要になり事故のもと。`images/pizza/` と中身が重複しているので、
   `pizza workshop/` を削除して `images/pizza/` に一本化するのが安全。

4. **SEO / 構造化データ**
   OGP は整備済みだが、`sitemap.xml` `robots.txt`、下層ページ個別の `description`/OGP は未整備。
   `content.html` は動的描画のみでクロール時に内容が薄い。

5. **JS 無効時のフォールバック**
   `.reveal` 系が `opacity:0` 初期値で、`prefers-reduced-motion` 対応と `<noscript>` が無い。
   IntersectionObserver が動かない環境では About〜Contact が非表示になる。

### 対応済み（2026-09-06）
- 画像最適化：`images/` を 236MB → 19MB（長辺2000px・JPEG品質80）。About/Concept に遅延読み込み。
- 下層ページのサイドバーのリンク先を `content.html?slug=` に統一。旧静的個別ページと孤児ページを削除（§4）。
- ハッシュタグを公開中の 6 個に整理。

---

## 10. 作業時のチェックリスト

- [ ] ブランチは `claude/` 始まりか（push すると自動で main にマージされる点を理解しているか）
- [ ] ナビ項目を触ったら `index.html` と `pages/*.html` 全部を直したか
- [ ] LINE / SNS / メールアドレスの変更は全 HTML を横断置換したか
- [ ] 内部リンクに `index.html` を付けていないか
- [ ] 新しい画像は Web 用にリサイズ・圧縮してから追加したか
- [ ] PC（1025px 以上）／タブレット（821〜1024px）／モバイル（820px 以下）の 3 段階で確認したか
- [ ] microCMS 由来の表示は、API 失敗時のフォールバックが壊れていないか
- [ ] コミットメッセージは日本語＋プレフィックス付きか
