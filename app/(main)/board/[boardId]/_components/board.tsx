"use client";
import React, { useState, useEffect } from "react";
import NewListButton from "./newListButton";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import Column from "./columns";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

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
  const [items, setItems] = useState([...ColumnData]);
  const params = useParams<{ boardId: string }>();
  const [activeColumn, setActiveColumn] = useState<ColumnInterface | null>(
    null
  );
  const router = useRouter();
  const handleDragStart = (event: DragStartEvent) => {
    setActiveColumn(
      ColumnData.find((col) => col.id === event.active.id.toString()) || null
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
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
      className="relative h-screen bg-cover bg-center bg-no-repeat overflow-auto overflow-y-hidden p-4"
      style={{
        backgroundImage: `url(${BoardData.imageUrl})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SortableContext items={items}>
            <div className="flex flex-row-reverse">
              {items.map((col) => (
                <Column key={col.id} ColumnData={col} />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            <div className="opacity-75 transform rotate-2">
              {activeColumn && <Column ColumnData={activeColumn} />}
            </div>
          </DragOverlay>
        </DndContext>
        <div className="p-4">
          <NewListButton />
        </div>
      </div>
    </div>
  );
};

export default Board;
