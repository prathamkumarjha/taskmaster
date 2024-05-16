import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";

import { useCardModal } from "@/hooks/use-card-modal";
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
  const cardModal = useCardModal();
  if (isDragging) {
    return (
      <Button
        className="bg-opacity-15 hover:bg-opacity-20 font-semibold py-10 px-4 border-0 rounded flex text-black variant-ghost bg-gray-600  w-full hover:bg-gray-600 opacity-50"
        ref={setNodeRef}
        style={style}
      >
        {cardData.name}
      </Button>
    );
  }

  return (
    <div>
      <Button
        className="bg-opacity-15 hover:bg-opacity-50 font-semibold py-10 px-4 border-0 rounded flex text-black variant-ghost bg-gray-600 shadow-lg  w-full text-lg hover:bg-gray-600 "
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => {
          cardModal.onOpen(cardData.id);
        }}
      >
        <p className="whitespace-normal overflow-hidden ">{cardData.name}</p>
      </Button>
    </div>
  );
};

export default Card;
