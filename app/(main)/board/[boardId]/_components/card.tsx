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
        className=" bg-opacity-50 font-semibold bg-black shadow-lg w-full text-lg hover:bg-black overflow-hidden"
        ref={setNodeRef}
        style={style}
      >
        <span className="opacity-0">{cardData.name}</span>
      </Button>
    );
  }

  return (
    <div>
      <Button
        className=" hover:bg-opacity-75 font-semibold bg-black shadow-md mb-2 shadow-black w-full text-lg overflow-hidden"
        ref={setNodeRef}
        style={{
          ...style,
          whiteSpace: "normal",
          display: "block",
          lineHeight: "normal",
        }}
        {...attributes}
        {...listeners}
        onClick={() => {
          cardModal.onOpen(cardData.id);
        }}
      >
        <p className="whitespace-normal ">{cardData.name}</p>
      </Button>
    </div>
  );
};

export default Card;
