"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/button-variants";
import { Input } from "@/components/ui/input";

export default function NewBoardPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");

  const handleCreate = () => {
    if (!title.trim()) return;
    // TODO: APIを呼び出してボードを作成し、IDを取得する
    const newId = Date.now().toString();
    router.push(`/board/${newId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4">
      <div className="w-full max-w-md">
        {/* 戻るリンク */}
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-6 gap-1.5 -ml-2"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          ダッシュボードに戻る
        </Link>

        <h1 className="text-2xl font-bold tracking-tight mb-1">
          新規ボード作成
        </h1>
        <p className="text-muted-foreground text-sm mb-7">
          ボードに名前をつけてコラボレーションを始めましょう
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              ボード名
            </label>
            <Input
              placeholder="例：プロジェクト計画、デザインレビュー..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
            />
          </div>

          <Button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="w-full gap-2"
          >
            <Wand2 className="h-4 w-4" />
            ボードを作成
          </Button>
        </div>
      </div>
    </div>
  );
}
