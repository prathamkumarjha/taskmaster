"use client";
import React, { useState, useEffect } from "react";
import NewListButton from "./newListButton";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  UniqueIdentifier,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import Column from "./columns";

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
  const [items] = useState([...ColumnData]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragEnd = () => {
    setActiveId(null);
  };

  useEffect(() => {
    console.log("Current active id:", activeId);
  }, [activeId]);

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
            {ColumnData.map((col) => (
              <Column key={col.id} ColumnData={col} />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeId ? <Column ColumnData={ColumnData[0]} /> : null}
          </DragOverlay>
        </DndContext>
        <div className="p-4 pr-8">
          <NewListButton />
        </div>
      </div>
    </div>
  );
};

export default Board;
