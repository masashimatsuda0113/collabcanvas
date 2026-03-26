import { Line } from "react-konva";
import type Konva from "konva";
import type { FreeDrawElement } from "@/types/canvas";

interface FreeDrawLineProps {
  element: FreeDrawElement;
  draggable: boolean;
  onSelect: () => void;
  onChange: (attrs: Partial<FreeDrawElement>) => void;
}

export const FreeDrawLine = ({
  element,
  draggable,
  onSelect,
  onChange,
}: FreeDrawLineProps) => {
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onChange({ x: e.target.x(), y: e.target.y() });
  };

  return (
    <Line
      id={element.id}
      points={element.points}
      stroke={element.strokeColor}
      strokeWidth={element.strokeWidth}
      tension={0.5}
      lineCap="round"
      lineJoin="round"
      x={element.x}
      y={element.y}
      rotation={element.rotation}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      draggable={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
      hitStrokeWidth={20}
    />
  );
};
