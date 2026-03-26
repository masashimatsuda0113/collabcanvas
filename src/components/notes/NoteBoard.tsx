"use client";

import { useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNoteStore } from "@/stores/noteStore";
import { StickyNote } from "./StickyNote";
import type { NoteColorIndex } from "@/types/note";
import { NOTE_COLORS } from "@/types/note";

export const NoteBoard = () => {
  const { notes, addNote } = useNoteStore();

  // ランダムなカラーでメモを追加
  const handleAddNote = useCallback(() => {
    const colorIndex = Math.floor(Math.random() * NOTE_COLORS.length) as NoteColorIndex;
    // 画面中央付近にランダムオフセットで配置
    const x = 100 + Math.random() * 300;
    const y = 80 + Math.random() * 200;
    addNote(x, y, colorIndex);
  }, [addNote]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* メモ追加ボタン（pointer-events-auto でクリック可能に） */}
      <div className="pointer-events-auto absolute top-3 right-3 z-20">
        <Button
          onClick={handleAddNote}
          size="sm"
          className="gap-1.5 shadow-md"
        >
          <Plus className="h-4 w-4" />
          メモ追加
        </Button>
      </div>

      {/* メモ一覧（各メモは pointer-events-auto） */}
      <AnimatePresence>
        {notes.map((note) => (
          <StickyNote key={note.id} note={note} />
        ))}
      </AnimatePresence>
    </div>
  );
};
