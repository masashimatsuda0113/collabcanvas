import { create } from "zustand";
import type { StickyNote, NoteColorIndex } from "@/types/note";

interface NoteState {
  notes: StickyNote[];

  // アクション
  addNote: (x: number, y: number, colorIndex?: NoteColorIndex) => string;
  updateNote: (id: string, attrs: Partial<StickyNote>) => void;
  deleteNote: (id: string) => void;
  bringToFront: (id: string) => void;
}

export const useNoteStore = create<NoteState>((set) => ({
  notes: [],

  addNote: (x, y, colorIndex = 0) => {
    const id = crypto.randomUUID();
    const note: StickyNote = {
      id,
      x,
      y,
      width: 220,
      height: 200,
      content: "",
      colorIndex,
      createdAt: Date.now(),
    };
    set((state) => ({ notes: [...state.notes, note] }));
    return id;
  },

  updateNote: (id, attrs) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, ...attrs } : n)),
    })),

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),

  // 対象メモを配列の末尾に移動（最前面へ）
  bringToFront: (id) =>
    set((state) => {
      const idx = state.notes.findIndex((n) => n.id === id);
      if (idx === -1 || idx === state.notes.length - 1) return state;
      const note = state.notes[idx];
      const rest = state.notes.filter((n) => n.id !== id);
      return { notes: [...rest, note] };
    }),
}));
