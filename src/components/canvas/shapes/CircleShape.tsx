import { Ellipse } from "react-konva";
import type Konva from "konva";
import type { CircleElement } from "@/types/canvas";

interface CircleShapeProps {
  element: CircleElement;
  draggable: boolean;
  onSelect: () => void;
  onChange: (attrs: Partial<CircleElement>) => void;
}

export const CircleShape = ({
  element,
  draggable,
  onSelect,
  onChange,
}: CircleShapeProps) => {
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onChange({ x: e.target.x(), y: e.target.y() });
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target as Konva.Ellipse;
    onChange({
      x: node.x(),
      y: node.y(),
      radiusX: Math.max(5, node.radiusX() * node.scaleX()),
      radiusY: Math.max(5, node.radiusY() * node.scaleY()),
      rotation: node.rotation(),
      scaleX: 1,
      scaleY: 1,
    });
  };

  return (
    <Ellipse
      id={element.id}
      x={element.x}
      y={element.y}
      radiusX={element.radiusX}
      radiusY={element.radiusY}
      rotation={element.rotation}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      fill={element.fillColor}
      stroke={element.strokeColor}
      strokeWidth={element.strokeWidth}
      draggable={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    />
  );
};
