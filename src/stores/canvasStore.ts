import { create } from "zustand";
import type { CanvasElement, ToolType } from "@/types/canvas";

interface CanvasState {
  // 要素
  elements: CanvasElement[];
  selectedId: string | null;

  // ツール設定
  tool: ToolType;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  fontSize: number;

  // 履歴（スナップショット方式）
  history: CanvasElement[][];
  historyIndex: number;

  // --- アクション ---

  // 要素操作（履歴は自動で積まない — 呼び出し側で pushHistory する）
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, attrs: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;

  // 選択
  setSelectedId: (id: string | null) => void;

  // ツール・スタイル設定
  setTool: (tool: ToolType) => void;
  setStrokeColor: (color: string) => void;
  setFillColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setFontSize: (size: number) => void;

  // 履歴
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  elements: [],
  selectedId: null,

  tool: "select",
  strokeColor: "#222222",
  fillColor: "transparent",
  strokeWidth: 2,
  fontSize: 20,

  history: [[]],
  historyIndex: 0,

  // --- 要素操作 ---

  addElement: (element) =>
    set((state) => ({
      elements: [...state.elements, element],
    })),

  updateElement: (id, attrs) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? ({ ...el, ...attrs } as CanvasElement) : el
      ),
    })),

  deleteElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  // --- 選択 ---

  setSelectedId: (id) => set({ selectedId: id }),

  // --- ツール・スタイル ---

  setTool: (tool) =>
    set({
      tool,
      // ツール変更時は選択解除（select 以外）
      selectedId: tool !== "select" ? null : get().selectedId,
    }),

  setStrokeColor: (color) => set({ strokeColor: color }),
  setFillColor: (color) => set({ fillColor: color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  setFontSize: (size) => set({ fontSize: size }),

  // --- 履歴 ---

  pushHistory: () =>
    set((state) => {
      // 現在位置より先の履歴を破棄してから追加
      const trimmed = state.history.slice(0, state.historyIndex + 1);
      trimmed.push(structuredClone(state.elements));
      return {
        history: trimmed,
        historyIndex: trimmed.length - 1,
      };
    }),

  undo: () =>
    set((state) => {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        elements: structuredClone(state.history[newIndex]),
        historyIndex: newIndex,
        selectedId: null,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        elements: structuredClone(state.history[newIndex]),
        historyIndex: newIndex,
        selectedId: null,
      };
    }),

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}));
