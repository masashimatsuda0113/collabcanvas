"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import type Konva from "konva";
import { useCanvasStore } from "@/stores/canvasStore";
import { ShapeRenderer } from "./shapes/ShapeRenderer";
import { Toolbar } from "./Toolbar";
import type { CanvasElement, ToolType } from "@/types/canvas";
import { cn } from "@/lib/utils";

// ユニークID生成
const createId = () => crypto.randomUUID();

// ツールごとのカーソル
const cursorMap: Record<ToolType, string> = {
  select: "default",
  pen: "crosshair",
  rectangle: "crosshair",
  circle: "crosshair",
  arrow: "crosshair",
  text: "text",
};

export const Canvas = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 描画中の一時状態（ストアに入れない）
  const isDrawing = useRef(false);
  const drawingId = useRef<string | null>(null);
  const startPos = useRef({ x: 0, y: 0 });

  // テキスト編集用
  const [editingText, setEditingText] = useState<{
    id: string;
    x: number;
    y: number;
    width: number;
    fontSize: number;
    value: string;
  } | null>(null);

  // ステージサイズ
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  const {
    elements,
    selectedId,
    tool,
    strokeColor,
    fillColor,
    strokeWidth,
    fontSize,
    addElement,
    updateElement,
    deleteElement,
    setSelectedId,
    pushHistory,
    undo,
    redo,
  } = useCanvasStore();

  // --- コンテナサイズ監視 ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setStageSize({ width, height });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // --- Transformer の接続 ---
  useEffect(() => {
    const tr = transformerRef.current;
    if (!tr) return;

    if (selectedId && tool === "select") {
      const stage = tr.getStage();
      const node = stage?.findOne(`#${selectedId}`);
      if (node) {
        tr.nodes([node]);
        tr.getLayer()?.batchDraw();
        return;
      }
    }
    tr.nodes([]);
    tr.getLayer()?.batchDraw();
  }, [selectedId, tool, elements]);

  // --- キーボードショートカット ---
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // テキスト編集中はショートカット無効
      if (editingText) return;

      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        deleteElement(selectedId);
        pushHistory();
      }
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (
        (e.key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
        (e.key === "y" && (e.ctrlKey || e.metaKey))
      ) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId, editingText, deleteElement, pushHistory, undo, redo]);

  // --- ポインター位置取得 ---
  const getPointerPos = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    const pos = stage.getPointerPosition();
    return pos ?? { x: 0, y: 0 };
  }, []);

  // --- 新しい要素のベース属性 ---
  const baseAttrs = useCallback(
    (x: number, y: number) => ({
      id: createId(),
      x,
      y,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      strokeColor,
      strokeWidth,
    }),
    [strokeColor, strokeWidth]
  );

  // --- マウスダウン ---
  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      // テキスト編集中はクリックで確定
      if (editingText) return;

      const pos = getPointerPos();

      // select ツール — 空白クリックで選択解除
      if (tool === "select") {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
          setSelectedId(null);
        }
        return;
      }

      // text ツール — クリック位置にテキスト配置
      if (tool === "text") {
        const target = e.target;
        const clickedOnEmpty =
          target === target.getStage() ||
          target.getClassName() === "Layer";
        if (clickedOnEmpty) {
          const id = createId();
          const newText: CanvasElement = {
            ...baseAttrs(pos.x, pos.y),
            id,
            type: "text",
            text: "テキスト",
            fontSize,
            fillColor: strokeColor,
            width: 200,
          };
          addElement(newText);
          pushHistory();
          // 作成直後に編集モードへ
          setEditingText({
            id,
            x: pos.x,
            y: pos.y,
            width: 200,
            fontSize,
            value: "テキスト",
          });
        }
        return;
      }

      // 描画系ツール開始
      isDrawing.current = true;
      startPos.current = pos;

      const id = createId();
      drawingId.current = id;

      if (tool === "pen") {
        addElement({
          ...baseAttrs(0, 0),
          id,
          x: 0,
          y: 0,
          type: "pen",
          points: [pos.x, pos.y],
        });
      } else if (tool === "rectangle") {
        addElement({
          ...baseAttrs(pos.x, pos.y),
          id,
          type: "rectangle",
          width: 0,
          height: 0,
          fillColor,
        });
      } else if (tool === "circle") {
        addElement({
          ...baseAttrs(pos.x, pos.y),
          id,
          type: "circle",
          radiusX: 0,
          radiusY: 0,
          fillColor,
        });
      } else if (tool === "arrow") {
        addElement({
          ...baseAttrs(pos.x, pos.y),
          id,
          type: "arrow",
          points: [0, 0, 0, 0],
        });
      }
    },
    [
      tool,
      editingText,
      getPointerPos,
      baseAttrs,
      fillColor,
      fontSize,
      strokeColor,
      addElement,
      pushHistory,
      setSelectedId,
    ]
  );

  // --- マウスムーブ ---
  const handleMouseMove = useCallback(() => {
    if (!isDrawing.current || !drawingId.current) return;
    const pos = getPointerPos();
    const id = drawingId.current;
    const start = startPos.current;

    if (tool === "pen") {
      const el = elements.find((e) => e.id === id);
      if (el?.type === "pen") {
        updateElement(id, {
          points: [...el.points, pos.x, pos.y],
        });
      }
    } else if (tool === "rectangle") {
      updateElement(id, {
        x: Math.min(start.x, pos.x),
        y: Math.min(start.y, pos.y),
        width: Math.abs(pos.x - start.x),
        height: Math.abs(pos.y - start.y),
      });
    } else if (tool === "circle") {
      const cx = (start.x + pos.x) / 2;
      const cy = (start.y + pos.y) / 2;
      updateElement(id, {
        x: cx,
        y: cy,
        radiusX: Math.abs(pos.x - start.x) / 2,
        radiusY: Math.abs(pos.y - start.y) / 2,
      });
    } else if (tool === "arrow") {
      updateElement(id, {
        points: [0, 0, pos.x - start.x, pos.y - start.y],
      });
    }
  }, [tool, elements, getPointerPos, updateElement]);

  // --- マウスアップ ---
  const handleMouseUp = useCallback(() => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    // 極小の図形は削除
    if (drawingId.current) {
      const el = elements.find((e) => e.id === drawingId.current);
      if (el) {
        let tooSmall = false;
        if (el.type === "rectangle") tooSmall = el.width < 3 && el.height < 3;
        if (el.type === "circle") tooSmall = el.radiusX < 3 && el.radiusY < 3;
        if (el.type === "pen") tooSmall = el.points.length < 4;
        if (el.type === "arrow") {
          const [, , dx, dy] = el.points;
          tooSmall = Math.abs(dx) < 3 && Math.abs(dy) < 3;
        }
        if (tooSmall) {
          deleteElement(el.id);
          drawingId.current = null;
          return;
        }
      }
    }

    pushHistory();
    drawingId.current = null;
  }, [elements, deleteElement, pushHistory]);

  // --- 図形の選択 ---
  const handleSelect = useCallback(
    (id: string) => {
      if (tool === "select") {
        setSelectedId(id);
      }
    },
    [tool, setSelectedId]
  );

  // --- 図形の変更（ドラッグ・リサイズ後） ---
  const handleChange = useCallback(
    (id: string, attrs: Partial<CanvasElement>) => {
      updateElement(id, attrs);
      pushHistory();
    },
    [updateElement, pushHistory]
  );

  // --- テキストのダブルクリック編集 ---
  const handleTextDoubleClick = useCallback(
    (id: string) => {
      const el = elements.find((e) => e.id === id);
      if (!el || el.type !== "text") return;
      setEditingText({
        id: el.id,
        x: el.x,
        y: el.y,
        width: el.width,
        fontSize: el.fontSize,
        value: el.text,
      });
    },
    [elements]
  );

  // --- テキスト編集の確定 ---
  const commitTextEdit = useCallback(() => {
    if (!editingText) return;
    updateElement(editingText.id, { text: editingText.value });
    pushHistory();
    setEditingText(null);
  }, [editingText, updateElement, pushHistory]);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden bg-[#f8f9fa] dark:bg-[#1a1a1a]"
    >
      <Toolbar />

      {/* Konva キャンバス */}
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        style={{ cursor: cursorMap[tool] }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer ref={layerRef}>
          {elements.map((el) => (
            <ShapeRenderer
              key={el.id}
              element={el}
              draggable={tool === "select"}
              onSelect={() => handleSelect(el.id)}
              onChange={(attrs) => handleChange(el.id, attrs)}
              onTextDoubleClick={handleTextDoubleClick}
            />
          ))}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(_, newBox) => ({
              ...newBox,
              width: Math.max(5, newBox.width),
              height: Math.max(5, newBox.height),
            })}
            anchorSize={8}
            borderStroke="#3b82f6"
            anchorStroke="#3b82f6"
            anchorFill="#ffffff"
            anchorCornerRadius={2}
          />
        </Layer>
      </Stage>

      {/* テキスト編集オーバーレイ */}
      {editingText && (
        <textarea
          className={cn(
            "absolute border-2 border-primary bg-transparent p-0 leading-tight outline-none resize-none overflow-hidden",
            "text-foreground"
          )}
          style={{
            top: editingText.y,
            left: editingText.x,
            width: editingText.width,
            fontSize: editingText.fontSize,
            fontFamily: "sans-serif",
            minHeight: editingText.fontSize + 4,
          }}
          value={editingText.value}
          onChange={(e) =>
            setEditingText({ ...editingText, value: e.target.value })
          }
          onBlur={commitTextEdit}
          onKeyDown={(e) => {
            if (e.key === "Escape") commitTextEdit();
            // Shift+Enter で改行、Enter で確定
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              commitTextEdit();
            }
          }}
          autoFocus
        />
      )}
    </div>
  );
};

export default Canvas;
