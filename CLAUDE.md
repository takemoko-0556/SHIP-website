# CLAUDE.md

このリポジトリで作業する際は、**まず `HANDOVER.md`（引き継ぎ書）を最初に読んでください。**
プロジェクト概要・ディレクトリ構成・microCMS 連携・デザイン規約・既知の課題をまとめてあります。

## 最低限おさえること

- **ビルド工程はありません。** 素の HTML / CSS / JS を直接編集します。`package.json` は存在しません。
- **`claude/` で始まるブランチに push すると、GitHub Actions が自動で `main` にマージします。**
  （`.github/workflows/auto-merge.yml`）レビューを挟みたい変更を安易に push しないこと。
- 動作確認は静的サーバ経由で行うこと（`python3 -m http.server 8000`）。
  `file://` で開くと microCMS への fetch が CORS で失敗します。
- **ナビゲーション項目・SNS リンク・メールアドレスを変更するときは、
  `index.html` と `pages/*.html` の全ファイルを横断して直す必要があります。**
  ナビの順序は `News → About → Concept → Access → Contact` で統一。
- 内部リンクに `index.html` を付けないこと（`../` や `./` に統一済み）。
- 画像は追加前に必ず Web 用にリサイズ・圧縮すること（既存の `images/` は合計 236MB あり肥大化しています）。
- コミットメッセージは**日本語**で、`feat: / fix: / update: / add: / style: / chore: / copy:` のプレフィックスを付けます。
- `pages/` には microCMS 駆動の `content.html?slug=` と旧世代の静的ページが混在しています。
  リンク先の不整合が残っているため、詳細は `HANDOVER.md` の §4 を必ず確認してください。
