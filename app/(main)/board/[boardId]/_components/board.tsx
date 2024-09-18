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
import CardModal from "./cardModal/cardModal";
import { CardInterface } from "./columns";
import BoardName from "./boardName";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

interface BoardInterface {
  id: string;
  organizationId: string;
  name: string;
  imageUrl: string;
  favorite: boolean;
}

export interface ColumnInterface {
  id: string;
  boardId: string;
  name: string;
  order: number;
  cards: CardInterface[];
}

export interface Log {
  id: string;
  boardId: string;
  cardId: string | null;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  userId: string;
  userImage: string;
  userName: string;
  action: ACTION;
  createdAt: Date;
}

const Board: React.FC<{
  BoardData: BoardInterface;
  ColumnData: ColumnInterface[];
  logs: Log[];
}> = ({ BoardData, ColumnData, logs }) => {
  const { toast } = useToast();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(TouchSensor)
  );

  const [items, setItems] = useState([...ColumnData]);
  const params = useParams<{ boardId: string }>();
  const [activeColumn, setActiveColumn] = useState<ColumnInterface | null>(
    null
  );
  const [activeCard, setActiveCard] = useState<CardInterface | null>(null);
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

    const isActiveACard = active.data.current?.type === "card";
    const isOverACard = over.data.current?.type === "card";
    const isOverAColumn = over.data.current?.type === "column";

    if (activeId === overId) return;

    const activeColumnIndex = items.findIndex(
      (column) => column.id === active.data.current?.columnId
    );

    const overColumnIndex = items.findIndex(
      (column) => column.id === over.data.current?.columnId
    );

    // Update the card and column state
    setItems((prevColumns) => {
      const updatedColumns = [...prevColumns];
      const activeColumn = updatedColumns[activeColumnIndex];
      const overColumn = updatedColumns[overColumnIndex];

      if (!activeColumn || !overColumn) return prevColumns;

      const activeIndex = activeColumn.cards.findIndex(
        (card) => card.id === activeId
      );
      const overIndex = overColumn.cards.findIndex(
        (card) => card.id === overId
      );

      // Handle card movement between columns
      if (isActiveACard && isOverAColumn && active.data.current) {
        active.data.current.columnId = over.id;

        // Move card to a new column
        updatedColumns.forEach((col) => {
          if (col.id === over.id) {
            const isCardExists = col.cards.some(
              (card) => card.id === active.id
            );
            if (!isCardExists)
              col.cards.unshift(active.data.current as CardInterface);
          } else if (col.cards.some((card) => card.id === active.id)) {
            col.cards = col.cards.filter((card) => card.id !== active.id);
          }
        });
      } else if (isActiveACard && isOverACard) {
        updatedColumns[activeColumnIndex].cards = arrayMove(
          updatedColumns[activeColumnIndex].cards,
          activeIndex,
          overIndex
        );
      }
      return updatedColumns;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.data.current?.type === "card") return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (overColumnId === activeColumnId) return;

    try {
      let data;
      // Swap columns and update the order in state
      setItems((prevItems) => {
        const activeIndex = prevItems.findIndex(
          (col) => col.id === activeColumnId
        );
        const overIndex = prevItems.findIndex((col) => col.id === overColumnId);
        const newOrder = arrayMove(prevItems, activeIndex, overIndex);

        const updatedItems = newOrder.map((col, index) => ({
          ...col,
          order: index + 1, // Adjust the order
        }));

        console.log(updatedItems, "this is updated items");
        data = updatedItems;
        return updatedItems;
      });

      // Perform server update if needed
      await axios.patch(`/api/boardChanges/${params.boardId}/columnSwap`, {
        items: data,
      });

      toast({ title: "List sequence updated" });
      // Refresh after server update
      router.refresh();
    } catch (error) {
      console.error("Error in swapping columns:", error);
      toast({
        variant: "destructive",
        title: "Unable to update list sequence",
      });
    }
  };

  return (
    <div className="mt-16">
      <CardModal />
      <div className="bg-black bg-opacity-75 h-16 w-screen text-4xl pl-4 text-white fixed top-16 flex items-center">
        <BoardName BoardName={BoardData.name} id={BoardData.id} logs={logs} />
      </div>
      <div className="flex mt-4">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={onDragOver}
        >
          <SortableContext items={items}>
            <div className="flex flex-row-reverse mt-4">
              {items.map((col) => (
                <Column key={col.id} ColumnData={col} />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            <div className="opacity-75 transform rotate-2">
              {activeColumn && <Column ColumnData={activeColumn} />}
            </div>
            <div className="opacity-75 transform rotate-6">
              {activeCard && <Card {...activeCard} />}
            </div>
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
