import { Text } from "react-konva";
import type Konva from "konva";
import type { TextElement } from "@/types/canvas";

interface TextShapeProps {
  element: TextElement;
  draggable: boolean;
  onSelect: () => void;
  onChange: (attrs: Partial<TextElement>) => void;
  onDoubleClick: (id: string) => void;
}

export const TextShape = ({
  element,
  draggable,
  onSelect,
  onChange,
  onDoubleClick,
}: TextShapeProps) => {
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onChange({ x: e.target.x(), y: e.target.y() });
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target as Konva.Text;
    onChange({
      x: node.x(),
      y: node.y(),
      width: Math.max(20, node.width() * node.scaleX()),
      fontSize: Math.max(8, element.fontSize * node.scaleY()),
      rotation: node.rotation(),
      scaleX: 1,
      scaleY: 1,
    });
  };

  const handleDblClick = () => {
    onDoubleClick(element.id);
  };

  return (
    <Text
      id={element.id}
      x={element.x}
      y={element.y}
      text={element.text}
      fontSize={element.fontSize}
      fontFamily="sans-serif"
      fill={element.fillColor}
      width={element.width}
      rotation={element.rotation}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      draggable={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDblClick={handleDblClick}
      onDblTap={handleDblClick}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    />
  );
};
