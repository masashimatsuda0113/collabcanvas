"use client";

import {
  MousePointer2,
  Pencil,
  Square,
  Circle,
  MoveRight,
  Type,
  Undo2,
  Redo2,
  Trash2,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCanvasStore } from "@/stores/canvasStore";
import type { ToolType } from "@/types/canvas";
import { cn } from "@/lib/utils";

// ツール定義
const tools: { type: ToolType; icon: React.ElementType; label: string }[] = [
  { type: "select", icon: MousePointer2, label: "選択" },
  { type: "pen", icon: Pencil, label: "ペン" },
  { type: "rectangle", icon: Square, label: "矩形" },
  { type: "circle", icon: Circle, label: "円" },
  { type: "arrow", icon: MoveRight, label: "矢印" },
  { type: "text", icon: Type, label: "テキスト" },
];

// カラーパレット
const palette = [
  "#222222",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#ffffff",
];

// 線幅プリセット
const strokeWidths = [1, 2, 4, 6, 10];

export const Toolbar = () => {
  const {
    tool,
    strokeColor,
    fillColor,
    strokeWidth,
    selectedId,
    setTool,
    setStrokeColor,
    setFillColor,
    setStrokeWidth,
    deleteElement,
    pushHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCanvasStore();

  const handleDelete = () => {
    if (!selectedId) return;
    deleteElement(selectedId);
    pushHistory();
  };

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-xl border border-border bg-background/95 backdrop-blur-sm px-2 py-1.5 shadow-lg">
      {/* ツール選択 */}
      <div className="flex items-center gap-0.5">
        {tools.map(({ type, icon: Icon, label }) => (
          <Button
            key={type}
            variant={tool === type ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setTool(type)}
            title={label}
            className={cn(
              tool === type && "bg-primary/10 text-primary ring-1 ring-primary/30"
            )}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* セパレーター */}
      <div className="mx-1 h-6 w-px bg-border" />

      {/* カラーパレット */}
      <div className="flex items-center gap-1">
        {/* 線の色 */}
        <div className="flex items-center gap-0.5" title="線の色">
          {palette.map((color) => (
            <button
              key={`stroke-${color}`}
              onClick={() => setStrokeColor(color)}
              className={cn(
                "h-5 w-5 rounded-full border-2 transition-transform hover:scale-110",
                strokeColor === color
                  ? "border-primary scale-110"
                  : "border-border"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* セパレーター */}
      <div className="mx-1 h-6 w-px bg-border" />

      {/* 塗りつぶし色トグル */}
      <div className="flex items-center gap-0.5" title="塗りつぶし">
        <button
          onClick={() =>
            setFillColor(fillColor === "transparent" ? strokeColor : "transparent")
          }
          className={cn(
            "h-5 w-5 rounded border-2 transition-transform hover:scale-110",
            fillColor !== "transparent"
              ? "border-primary scale-110"
              : "border-border bg-background"
          )}
          style={{
            backgroundColor:
              fillColor !== "transparent" ? fillColor : undefined,
            backgroundImage:
              fillColor === "transparent"
                ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)"
                : undefined,
            backgroundSize: "6px 6px",
            backgroundPosition: "0 0, 3px 3px",
          }}
          title={fillColor === "transparent" ? "塗りなし" : "塗りあり"}
        />
      </div>

      {/* セパレーター */}
      <div className="mx-1 h-6 w-px bg-border" />

      {/* 線の太さ */}
      <div className="flex items-center gap-0.5" title="線の太さ">
        {strokeWidths.map((w) => (
          <button
            key={w}
            onClick={() => setStrokeWidth(w)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
              strokeWidth === w
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            <Minus
              className="text-current"
              style={{ strokeWidth: w, width: 16, height: 16 }}
            />
          </button>
        ))}
      </div>

      {/* セパレーター */}
      <div className="mx-1 h-6 w-px bg-border" />

      {/* Undo / Redo / Delete */}
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={undo}
          disabled={!canUndo()}
          title="元に戻す (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={redo}
          disabled={!canRedo()}
          title="やり直し (Ctrl+Shift+Z)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleDelete}
          disabled={!selectedId}
          title="削除 (Delete)"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
