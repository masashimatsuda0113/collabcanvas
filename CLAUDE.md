# CollabCanvas

リアルタイムコラボレーション ホワイトボード＆メモアプリ

## 技術スタック

- Next.js 15 (App Router) / TypeScript strict
- Tailwind CSS v4 / shadcn/ui
- react-konva (キャンバス描画)
- Liveblocks (リアルタイム同期)
- Zustand (ローカル状態管理)
- Framer Motion (アニメーション)

## ディレクトリ構成

```
src/
  app/              → ページ・レイアウト・APIルート
    (board)/        → ボード関連ページ（グループルート）
    api/            → APIエンドポイント
  components/
    canvas/         → ホワイトボード関連コンポーネント
    notes/          → スティッキーメモ関連
    ui/             → shadcn/ui + 共通UIパーツ
    layout/         → ヘッダー・サイドバー等
  hooks/            → カスタムフック
  lib/              → ユーティリティ・ヘルパー
  stores/           → Zustandストア
  types/            → 型定義
  liveblocks/       → Liveblocks設定・型
```

## コーディング規約

- 関数コンポーネント（アロー関数）
- Props型はinterface定義（type aliasではなく）
- `"use client"` は必要な最小単位に
- Server Componentsをデフォルトとする
- barrel export（index.ts）は使わない
- コミットはConventional Commits（日本語OK）
- テストファイルは `__tests__/` に配置

## 使用ライブラリ詳細

| ライブラリ | バージョン | 用途 |
|---|---|---|
| next | 15.x | フレームワーク |
| react | 19.x | UIライブラリ |
| typescript | 5.x | 型システム |
| tailwindcss | 4.x | スタイリング |
| react-konva / konva | 19.x / 10.x | キャンバス描画 |
| @liveblocks/react | 3.x | リアルタイム同期 |
| zustand | 5.x | クライアント状態管理 |
| framer-motion | 12.x | アニメーション |
| lucide-react | latest | アイコン |

## 環境変数

`.env.local` に以下を設定すること：

```
LIVEBLOCKS_SECRET_KEY=sk_...
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_...
```

## 開発コマンド

```bash
pnpm dev       # 開発サーバー起動
pnpm build     # プロダクションビルド
pnpm lint      # ESLint実行
pnpm format    # Prettier実行
```
