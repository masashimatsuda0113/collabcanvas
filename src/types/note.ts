// スティッキーメモのカラーバリエーション
export const NOTE_COLORS = [
  { name: "イエロー", bg: "#fef9c3", border: "#fde047", text: "#854d0e" },
  { name: "ピンク", bg: "#fce7f3", border: "#f9a8d4", text: "#9d174d" },
  { name: "ブルー", bg: "#dbeafe", border: "#93c5fd", text: "#1e40af" },
  { name: "グリーン", bg: "#dcfce7", border: "#86efac", text: "#166534" },
  { name: "パープル", bg: "#f3e8ff", border: "#d8b4fe", text: "#6b21a8" },
  { name: "オレンジ", bg: "#ffedd5", border: "#fdba74", text: "#9a3412" },
] as const;

export type NoteColorIndex = 0 | 1 | 2 | 3 | 4 | 5;

// スティッキーメモの型定義
export interface StickyNote {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  colorIndex: NoteColorIndex;
  createdAt: number;
}
