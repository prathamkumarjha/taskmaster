import { useSortable } from "@dnd-kit/sortable";

interface CardInterface {
  id: string;
  columnId: string;
  name: string;
  description: string | null;
  order: number;
}

const Card: React.FC<CardInterface> = (cardData: CardInterface) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: cardData.id,
  });
  return (
    <div className="bg-gray-200 p-4 rounded-md shadow-md">{cardData.name}</div>
  );
};

export default Card;
