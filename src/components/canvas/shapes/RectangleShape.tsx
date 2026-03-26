import { Rect } from "react-konva";
import type Konva from "konva";
import type { RectangleElement } from "@/types/canvas";

interface RectangleShapeProps {
  element: RectangleElement;
  draggable: boolean;
  onSelect: () => void;
  onChange: (attrs: Partial<RectangleElement>) => void;
}

export const RectangleShape = ({
  element,
  draggable,
  onSelect,
  onChange,
}: RectangleShapeProps) => {
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onChange({ x: e.target.x(), y: e.target.y() });
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    onChange({
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * node.scaleX()),
      height: Math.max(5, node.height() * node.scaleY()),
      rotation: node.rotation(),
      scaleX: 1,
      scaleY: 1,
    });
  };

  return (
    <Rect
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      fill={element.fillColor}
      stroke={element.strokeColor}
      strokeWidth={element.strokeWidth}
      cornerRadius={2}
      draggable={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    />
  );
};
