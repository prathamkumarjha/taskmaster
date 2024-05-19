import { useState, useEffect } from "react";
import MoveCardModal from "./moveCardModal";
import { useMoveCardModal } from "@/hooks/use-move-card-modal";

export interface CardModalInterface {
  id: string;
  columnId: string;
  name: string;
  description: string | null;
  order: number;
  column: {
    name: string;
    boardId: string;
    board: { name: string };
  };
}

export interface CardModalProviderProps {
  cardData: CardModalInterface;
}

const CardModalProvider: React.FC<CardModalProviderProps> = ({ cardData }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  });

  if (!isMounted) {
    return;
  }
  return (
    <div>
      <MoveCardModal cardData={cardData} />
    </div>
  );
};

export default CardModalProvider;
