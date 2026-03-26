"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";
import { X, GripVertical } from "lucide-react";
import { NOTE_COLORS } from "@/types/note";
import type { StickyNote as StickyNoteType, NoteColorIndex } from "@/types/note";
import { useNoteStore } from "@/stores/noteStore";
import { cn } from "@/lib/utils";

interface StickyNoteProps {
  note: StickyNoteType;
}

// リサイズの最小サイズ
const MIN_WIDTH = 160;
const MIN_HEIGHT = 120;

export const StickyNote = ({ note }: StickyNoteProps) => {
  const { updateNote, deleteNote, bringToFront } = useNoteStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ドラッグ用
  const dragStart = useRef({ x: 0, y: 0, noteX: 0, noteY: 0 });

  const color = NOTE_COLORS[note.colorIndex];

  // ダブルクリックで編集モードに入る
  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  // 編集モード時にテキストエリアにフォーカス
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  // 編集を確定
  const commitEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  // カラー変更（クリックで次の色へ）
  const cycleColor = useCallback(() => {
    const next = ((note.colorIndex + 1) % NOTE_COLORS.length) as NoteColorIndex;
    updateNote(note.id, { colorIndex: next });
  }, [note.id, note.colorIndex, updateNote]);

  // ドラッグ開始（ヘッダー部分）
  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      // ボタンクリック時はドラッグしない
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
      setIsDragging(true);
      bringToFront(note.id);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        noteX: note.x,
        noteY: note.y,
      };

      const handleMove = (ev: PointerEvent) => {
        const dx = ev.clientX - dragStart.current.x;
        const dy = ev.clientY - dragStart.current.y;
        updateNote(note.id, {
          x: dragStart.current.noteX + dx,
          y: dragStart.current.noteY + dy,
        });
      };

      const handleEnd = () => {
        setIsDragging(false);
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleEnd);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleEnd);
    },
    [note.id, note.x, note.y, updateNote, bringToFront]
  );

  // リサイズ開始
  const handleResizeStart = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = note.width;
      const startH = note.height;

      const handleMove = (ev: PointerEvent) => {
        updateNote(note.id, {
          width: Math.max(MIN_WIDTH, startW + ev.clientX - startX),
          height: Math.max(MIN_HEIGHT, startH + ev.clientY - startY),
        });
      };

      const handleEnd = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleEnd);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleEnd);
    },
    [note.id, note.width, note.height, updateNote]
  );

  return (
    <motion.div
      // ポップインアニメーション
      initial={{ scale: 0.3, opacity: 0, rotate: -8 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      exit={{ scale: 0.3, opacity: 0, rotate: 8 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        opacity: { duration: 0.15 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={() => bringToFront(note.id)}
      className="pointer-events-auto absolute select-none"
      style={{
        top: note.y,
        left: note.x,
        width: note.width,
        height: note.height,
        zIndex: isDragging ? 9999 : undefined,
      }}
    >
      <div
        className={cn(
          "flex h-full w-full flex-col rounded-lg border-2 shadow-md transition-shadow",
          isDragging && "shadow-xl"
        )}
        style={{
          backgroundColor: color.bg,
          borderColor: color.border,
          color: color.text,
        }}
      >
        {/* ヘッダー（ドラッグハンドル＋操作ボタン） */}
        <div
          className="flex h-8 shrink-0 cursor-grab items-center justify-between px-2 active:cursor-grabbing"
          onPointerDown={handleDragStart}
          style={{ touchAction: "none" }}
        >
          <div className="flex items-center gap-1">
            <GripVertical className="h-3.5 w-3.5 opacity-50" />
            {/* カラー変更ボタン */}
            <button
              onClick={cycleColor}
              className="h-4 w-4 rounded-full border-2 transition-transform hover:scale-125"
              style={{
                backgroundColor:
                  NOTE_COLORS[((note.colorIndex + 1) % NOTE_COLORS.length) as NoteColorIndex].bg,
                borderColor:
                  NOTE_COLORS[((note.colorIndex + 1) % NOTE_COLORS.length) as NoteColorIndex].border,
              }}
              title="色を変更"
            />
          </div>

          {/* 削除ボタン（ホバーで表示） */}
          <AnimatePresence>
            {isHovered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.12 }}
                onClick={() => deleteNote(note.id)}
                className="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-black/10"
                title="メモを削除"
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* コンテンツエリア */}
        <div
          className="flex-1 overflow-auto px-3 pb-2"
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={note.content}
              onChange={(e) => updateNote(note.id, { content: e.target.value })}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === "Escape") commitEdit();
              }}
              className="h-full w-full resize-none bg-transparent text-sm leading-relaxed outline-none"
              style={{ color: color.text }}
              placeholder="テキストを入力...（マークダウン対応）"
            />
          ) : (
            <div
              className={cn(
                "prose prose-sm h-full max-w-none text-sm leading-relaxed",
                note.content ? "cursor-text" : "cursor-text opacity-50"
              )}
              style={{ color: color.text }}
            >
              {note.content ? (
                <Markdown>{note.content}</Markdown>
              ) : (
                <p className="italic">ダブルクリックで編集...</p>
              )}
            </div>
          )}
        </div>

        {/* リサイズハンドル（右下） */}
        <div
          onPointerDown={handleResizeStart}
          className="absolute right-0 bottom-0 h-4 w-4 cursor-nwse-resize"
          style={{ touchAction: "none" }}
        >
          <svg
            viewBox="0 0 16 16"
            className="h-full w-full opacity-30"
            style={{ color: color.text }}
          >
            <path d="M14 14L8 14L14 8Z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};
