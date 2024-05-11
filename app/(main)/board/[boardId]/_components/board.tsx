"use client";
import React, { useState, useEffect } from "react";
import NewListButton from "./newListButton";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  TouchSensor,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import Column from "./columns";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Card from "./card";

interface BoardInterface {
  id: string;
  organizationId: string;
  name: string;
  imageUrl: string;
  favorite: boolean;
}

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

const Board: React.FC<{
  BoardData: BoardInterface;
  ColumnData: ColumnInterface[];
}> = ({ BoardData, ColumnData }) => {
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor)
  );

  const [items, setItems] = useState([...ColumnData]);

  const params = useParams<{ boardId: string }>();

  const [activeColumn, setActiveColumn] = useState<ColumnInterface | null>(
    null
  );

  const [activeCard, setActiveCard] = useState<CardInterface | null>(null);

  const defaultCards: CardInterface[] = ColumnData.flatMap(
    (column) => column.cards
  );

  const [cards, setCards] = useState<CardInterface[]>(defaultCards);

  const router = useRouter();

  useEffect(() => {
    setItems([...ColumnData]);
  }, [ColumnData]);

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "card") {
      setActiveColumn(null);
      setActiveCard(event.active.data.current as CardInterface);
    }
    if (event.active.data.current?.type === "column") {
      setActiveCard(null);
      setActiveColumn(
        ColumnData.find((col) => col.id === event.active.id.toString()) || null
      );
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    console.log(active);
    // console.log("columnData", ColumnData);
    const activeColumnId = ColumnData.findIndex(
      (t) => t.id === active.data.current?.columnId
    );
    console.log("activeColumnID", activeColumnId);
    if (activeId === overId) return;
    console.log("Active:", activeId, "OverId", overId);
    const isActiveCard = active.data.current?.type === "card";
    const isOverCard = active.data.current?.type === "card";

    //dropping the card on another card

    if (isActiveCard && isOverCard) {
      setItems((columns) => {
        const activeIndex = columns[activeColumnId].cards.findIndex(
          (t) => t.id === activeId
        );
        const overIndex = columns[activeColumnId].cards.findIndex(
          (t) => t.id === overId
        );

        const newArr = arrayMove(
          columns[activeColumnId].cards,
          activeIndex,
          overIndex
        );
        console.log(newArr);
        ColumnData[activeColumnId].cards = newArr;
        return ColumnData;
      });
    }
    //dropping a card over a column
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    // setActiveCard(null);
    const activeColumnId = active.id;

    const overColumnId = over.id;

    if (overColumnId === activeColumnId) return;

    setItems((columns) => {
      const activeIndex = columns.findIndex((col) => col.id === activeColumnId);
      const overIndex = columns.findIndex((col) => col.id === overColumnId);
      function swap() {
        axios
          .patch(`/api/boardChanges/${params.boardId}/columnSwap`, {
            activeColumnId,
            overColumnId,
          })
          .then(() => {
            router.refresh;
            toast({
              title: "list sequence updated",
            });
          })
          .catch((error) => {
            console.error("Error in swapping list:", error);
            toast({
              variant: "destructive",
              title: "unable to update list sequence",
            });
            router.refresh();
          });
      }
      swap();
      return arrayMove(items, activeIndex, overIndex);
    });
  };

  return (
    <div
      className="relative h-screen bg-cover bg-center bg-no-repeat overflow-y-hidden p-4"
      draggable="false"
      style={{
        backgroundImage: `url(${BoardData.imageUrl})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={onDragOver}
        >
          <SortableContext items={items}>
            <div className="flex flex-row-reverse h-">
              {items.map((col) => (
                <Column key={col.id} ColumnData={col} />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            <div className="opacity-75 transform rotate-2">
              {activeColumn && <Column ColumnData={activeColumn} />}
            </div>
            {activeCard && <Card {...activeCard} />}
          </DragOverlay>
        </DndContext>
        <div className="p-4">
          <NewListButton size={Number(ColumnData.length) + 1} />
        </div>
      </div>
    </div>
  );
};

export default Board;
