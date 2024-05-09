import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
    data: {
      type: "card",
      ...cardData,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div className="bg-gray-200 p-4 rounded-md shadow-md ">
          <div className="opacity-0">{cardData.name}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-200 p-4 rounded-md shadow-md"
    >
      {cardData.name}
    </div>
  );
};

export default Card;
