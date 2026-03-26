"use client";

import dynamic from "next/dynamic";
import { NoteBoard } from "@/components/notes/NoteBoard";

// react-konva は window/canvas に依存するため SSR を無効化して読み込む
const Canvas = dynamic(() => import("./Canvas").then((m) => m.Canvas), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center bg-muted/20">
      <p className="text-muted-foreground text-sm animate-pulse">
        キャンバスを読み込み中...
      </p>
    </div>
  ),
});

export const CanvasWrapper = () => {
  return (
    <div className="relative flex-1 overflow-hidden">
      <Canvas />
      {/* メモレイヤー（キャンバスの上に重ねて表示、メモが無い領域はクリック透過） */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <NoteBoard />
      </div>
    </div>
  );
};
