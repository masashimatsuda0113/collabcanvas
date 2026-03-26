import Link from "next/link";
import { ArrowLeft, Users, Share2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/button-variants";
import { CanvasWrapper } from "@/components/canvas/CanvasWrapper";

interface BoardPageProps {
  params: Promise<{ id: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      {/* ボードツールバー */}
      <div className="h-11 shrink-0 border-b border-border px-3 flex items-center justify-between bg-background">
        {/* 左側：戻るボタン＋タイトル */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
            aria-label="ダッシュボードに戻る"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="font-medium text-sm truncate max-w-48">
            ボード #{id}
          </span>
        </div>

        {/* 右側：コラボレーター・共有 */}
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" className="gap-1.5 hidden sm:flex">
            <Users className="h-4 w-4" />
            コラボレーター
          </Button>
          <Button size="sm" className="gap-1.5">
            <Share2 className="h-4 w-4" />
            共有
          </Button>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* キャンバスエリア */}
      <CanvasWrapper />
    </div>
  );
}
