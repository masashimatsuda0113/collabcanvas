import type { CanvasElement } from "@/types/canvas";
import { FreeDrawLine } from "./FreeDrawLine";
import { RectangleShape } from "./RectangleShape";
import { CircleShape } from "./CircleShape";
import { ArrowShape } from "./ArrowShape";
import { TextShape } from "./TextShape";

interface ShapeRendererProps {
  element: CanvasElement;
  draggable: boolean;
  onSelect: () => void;
  onChange: (attrs: Partial<CanvasElement>) => void;
  onTextDoubleClick: (id: string) => void;
}

// 要素の type に応じて適切なコンポーネントに振り分ける
export const ShapeRenderer = ({
  element,
  draggable,
  onSelect,
  onChange,
  onTextDoubleClick,
}: ShapeRendererProps) => {
  switch (element.type) {
    case "pen":
      return (
        <FreeDrawLine
          element={element}
          draggable={draggable}
          onSelect={onSelect}
          onChange={onChange}
        />
      );
    case "rectangle":
      return (
        <RectangleShape
          element={element}
          draggable={draggable}
          onSelect={onSelect}
          onChange={onChange}
        />
      );
    case "circle":
      return (
        <CircleShape
          element={element}
          draggable={draggable}
          onSelect={onSelect}
          onChange={onChange}
        />
      );
    case "arrow":
      return (
        <ArrowShape
          element={element}
          draggable={draggable}
          onSelect={onSelect}
          onChange={onChange}
        />
      );
    case "text":
      return (
        <TextShape
          element={element}
          draggable={draggable}
          onSelect={onSelect}
          onChange={onChange}
          onDoubleClick={onTextDoubleClick}
        />
      );
  }
};
