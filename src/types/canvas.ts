// ツール種別
export type ToolType =
  | "select"
  | "pen"
  | "rectangle"
  | "circle"
  | "arrow"
  | "text";

// 図形の種別（select を除くツール種別）
export type ShapeType = Exclude<ToolType, "select">;

// 全要素共通のベースプロパティ
interface BaseElement {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  strokeColor: string;
  strokeWidth: number;
}

// フリードロー（ペン）
export interface FreeDrawElement extends BaseElement {
  type: "pen";
  points: number[]; // [x1,y1, x2,y2, ...]
}

// 矩形
export interface RectangleElement extends BaseElement {
  type: "rectangle";
  width: number;
  height: number;
  fillColor: string;
}

// 円（楕円）
export interface CircleElement extends BaseElement {
  type: "circle";
  radiusX: number;
  radiusY: number;
  fillColor: string;
}

// 矢印
export interface ArrowElement extends BaseElement {
  type: "arrow";
  points: number[]; // [0,0, dx,dy] — 原点からの相対座標
}

// テキスト
export interface TextElement extends BaseElement {
  type: "text";
  text: string;
  fontSize: number;
  fillColor: string;
  width: number;
}

// 全要素のユニオン型
export type CanvasElement =
  | FreeDrawElement
  | RectangleElement
  | CircleElement
  | ArrowElement
  | TextElement;
