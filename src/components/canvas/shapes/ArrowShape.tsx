import { Arrow } from "react-konva";
import type Konva from "konva";
import type { ArrowElement } from "@/types/canvas";

interface ArrowShapeProps {
  element: ArrowElement;
  draggable: boolean;
  onSelect: () => void;
  onChange: (attrs: Partial<ArrowElement>) => void;
}

export const ArrowShape = ({
  element,
  draggable,
  onSelect,
  onChange,
}: ArrowShapeProps) => {
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onChange({ x: e.target.x(), y: e.target.y() });
  };

  return (
    <Arrow
      id={element.id}
      points={element.points}
      x={element.x}
      y={element.y}
      rotation={element.rotation}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      stroke={element.strokeColor}
      strokeWidth={element.strokeWidth}
      fill={element.strokeColor}
      pointerLength={10}
      pointerWidth={10}
      lineCap="round"
      lineJoin="round"
      draggable={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
      hitStrokeWidth={20}
    />
  );
};
