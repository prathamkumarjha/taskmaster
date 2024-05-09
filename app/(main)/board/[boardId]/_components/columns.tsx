import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ColumnName from "./columnName";
import NewCardButton from "./newCardButton";
import Card from "./card";
import React, { useState, useEffect, useMemo } from "react";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

interface CardInterface {
  id: string;
  columnId: string;
  name: string;
  description: string | null;
  order: number;
}

interface ColumnInterface {
  id: string;
  boardId: string;
  name: string;
  order: number;
  cards: CardInterface[];
}

const Column: React.FC<{
  ColumnData: ColumnInterface;
}> = ({ ColumnData }) => {
  // const [items, setItems] = useState([...ColumnData.cards]);

  const cardIds = useMemo(() => {
    return ColumnData.cards.map((card) => card.id);
  }, [ColumnData]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: ColumnData.id,
    data: {
      type: "column",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div className="p-4 m-2 w-[180px]  bg-white rounded-lg shadow-md h-40 opacity-50"></div>
      </div>
    );
  }
  return (
    <div ref={setNodeRef} style={style}>
      <div className="p-4 m-4 w-[180px] h-30 bg-white rounded-lg shadow-lg">
        <SortableContext items={cardIds}>
          <div {...attributes} {...listeners}>
            <ColumnName listName={ColumnData.name} id={ColumnData.id} />
          </div>
          <div className="space-y-2 mt-4 ">
            {ColumnData.cards.map((card) => (
              <Card key={card.id} {...card} />
            ))}
          </div>
        </SortableContext>
        <div className="mt-4">
          <NewCardButton
            size={ColumnData.cards.length}
            columnId={ColumnData.id}
          />
        </div>
      </div>
    </div>
  );
};

export default Column;
