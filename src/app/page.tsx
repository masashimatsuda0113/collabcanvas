import Link from "next/link";
import { Plus, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/button-variants";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageTransition } from "@/components/layout/PageTransition";

// モックデータ（後でAPIから取得）
const mockBoards = [
  {
    id: "1",
    title: "プロジェクト計画",
    description: "Q2ロードマップ",
    updatedAt: "2時間前",
    color: "from-blue-500/20 to-indigo-500/10",
  },
  {
    id: "2",
    title: "デザインレビュー",
    description: "UIコンポーネント整理",
    updatedAt: "昨日",
    color: "from-violet-500/20 to-purple-500/10",
  },
  {
    id: "3",
    title: "チームブレスト",
    description: "新機能アイデア出し",
    updatedAt: "3日前",
    color: "from-emerald-500/20 to-teal-500/10",
  },
];

export default function DashboardPage() {
  return (
    <DashboardShell>
      <PageTransition className="p-8">
        {/* ヘッダー行 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">マイボード</h1>
            <p className="text-muted-foreground text-sm mt-1">
              ボードを管理・編集できます
            </p>
          </div>
          <Link
            href="/board/new"
            className={cn(buttonVariants({ size: "sm" }), "gap-2")}
          >
            <Plus className="h-4 w-4" />
            新規作成
          </Link>
        </div>

        {/* ボード一覧 */}
        {mockBoards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <LayoutGrid className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-medium mb-1">ボードがありません</h2>
            <p className="text-muted-foreground text-sm mb-5">
              最初のボードを作成して始めましょう
            </p>
            <Link
              href="/board/new"
              className={cn(buttonVariants({ size: "sm" }), "gap-2")}
            >
              <Plus className="h-4 w-4" />
              新規作成
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mockBoards.map((board) => (
              <Link key={board.id} href={`/board/${board.id}`}>
                <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group">
                  {/* サムネイルエリア */}
                  <div
                    className={cn(
                      "mx-4 mt-0 aspect-video rounded-lg bg-gradient-to-br flex items-center justify-center",
                      board.color
                    )}
                  >
                    <LayoutGrid className="h-8 w-8 text-foreground/20 group-hover:text-foreground/35 transition-colors" />
                  </div>
                  <CardHeader className="pt-2 pb-1">
                    <CardTitle>{board.title}</CardTitle>
                    <CardDescription>
                      {board.description} · {board.updatedAt}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </PageTransition>
    </DashboardShell>
  );
}
