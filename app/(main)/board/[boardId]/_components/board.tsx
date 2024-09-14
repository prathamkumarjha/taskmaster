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
interface BoardInterface {
  id: string;
  organizationId: string;
  name: string;
  imageUrl: string;
  favorite: boolean;
}

// interface CardInterface {
//   id: string;
//   columnId: string;
//   name: string;
//   description: string | null;
//   order: number;
// }

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

  const router = useRouter();

  useEffect(() => {
    setItems([...ColumnData]);
  }, [ColumnData]);

  //listens if any card or column is being dragged
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

  //handles changes on card level
  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if the dragged item is a card
    const isActiveACard = active.data.current?.type === "card";
    const isOverACard = over.data.current?.type === "card";
    if (active.data.current?.type === "column") {
      return;
    }

    //check if the dragged item is over a column
    const isOverAColumn = over.data.current?.type === "column";

    // If the active and over items are the same, or if both are cards, return
    if (activeId === overId) return;
    console.log(over);
    // Find the index of the active and over columns
    const activeColumnIndex = ColumnData.findIndex(
      (column) => column.id === active.data.current?.columnId
    );
    console.log("active column id", active.data.current?.columnId);

    const overColumnIndex = ColumnData.findIndex(
      (column) => column.id === over.data.current?.columnId
    );

    if (isActiveACard && isOverAColumn && active.data.current) {
      // Update the columnId of the active card to the id of the column it is being hovered over
      active.data.current.columnId = over.id;

      setItems((columns) => {
        const updatedColumns = columns.map((col) => {
          if (col.id === over.id) {
            // Check if the active card already exists in the column
            const isCardExists = col.cards.some(
              (card) => card.id === active.id
            );
            if (!isCardExists) {
              // Add the active card to the beginning of the cards array of the column it is being hovered over
              col.cards.unshift(active.data.current as CardInterface);
            }
          } else if (col.cards.some((card) => card.id === active.id)) {
            // Remove the active card from its original column
            col.cards = col.cards.filter((card) => card.id !== active.id);
          }
          console.log(col);
          return col;
        });
        return updatedColumns;
      });
    }

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

      // Move the card to a different column
      if (active.data.current?.columnId !== over.data.current?.columnId) {
        const cardToMove = activeColumn.cards.find(
          (card) => card.id === activeId
        );
        if (cardToMove) {
          cardToMove.columnId = over.data.current?.columnId ?? "";
          activeColumn.cards.splice(activeIndex, 1);
          overColumn.cards.splice(overIndex + 1, 0, cardToMove);
        }
      } else if (isActiveACard && isOverACard) {
        const array = arrayMove(
          prevColumns[activeColumnIndex].cards,
          activeIndex,
          overIndex
        );
        prevColumns[activeColumnIndex].cards = array;
        return prevColumns;
      }
      return updatedColumns;
    });
    try {
      if (isOverACard) {
        if (activeColumnIndex != overColumnIndex) {
          axios
            .patch(`/api/boardChanges/${params.boardId}/cardSwap`, {
              firstColumn: ColumnData[activeColumnIndex],
              secondColumn: ColumnData[overColumnIndex],
            })
            .then(() => {
              router.refresh();
            });
        } else {
          // Move card within the same column
          const overColumn = ColumnData[overColumnIndex];
          const overIndex = overColumn.cards.findIndex(
            (card) => card.id === overId
          );

          const updatedCards = ColumnData[activeColumnIndex].cards.map(
            (card, index) => {
              return {
                ...card,
                order: index + 1,
              };
            }
          );

          // Now assign the updated cards array back to the column
          ColumnData[activeColumnIndex].cards = updatedCards;

          axios
            .patch(`/api/boardChanges/${params.boardId}/cardSwap`, {
              updateableColumn: ColumnData[activeColumnIndex],
            })
            .then(() => {
              router.refresh();
            });
        }
      } else if (isOverAColumn) {
        const emptyColumnIndex = ColumnData.findIndex(
          (column) => column.id === over.data.current?.id
        );
        axios
          .patch(`/api/boardChanges/${params.boardId}/cardSwap`, {
            firstColumn: ColumnData[activeColumnIndex],
            secondColumn: ColumnData[emptyColumnIndex],
          })
          .then(() => {
            router.refresh();
          });
      }
    } catch (error) {
      console.log(error);
    }

    if (isOverACard) {
      console.log("over column id", over.data.current?.columnId);
    } else if (isOverAColumn) {
      console.log("over column id which is empty", over.id);
    } else {
      console.log("the card is over nothing");
    }
  };

  //swaps columns
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }

    if (active.data.current?.type === "card") {
      return;
    }

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (overColumnId === activeColumnId) {
      return;
    }

    try {
      // Swap columns in local state
      setItems((prevItems) => {
        const activeIndex = prevItems.findIndex(
          (col) => col.id === activeColumnId
        );
        const overIndex = prevItems.findIndex((col) => col.id === overColumnId);
        return arrayMove(prevItems, activeIndex, overIndex);
      });

      //  Swap columns on the server
      await axios.patch(`/api/boardChanges/${params.boardId}/columnSwap`, {
        activeColumnId,
        overColumnId,
      });
      // Refresh the router
      router.refresh();
      // Display success message
      toast({
        title: "List sequence updated",
      });
    } catch (error) {
      console.error("Error in swapping columns:", error);
      toast({
        variant: "destructive",
        title: "Unable to update list sequence",
      });
      // Handle error
    }
  };

  return (
    // overflow-y-hidden
    // <div
    //   className="relative h-screen bg-cover bg-center bg-no-repeat overflow-scroll"
    //   draggable="false"
    //   style={{
    //     backgroundImage: `url(${BoardData.imageUrl})`,
    //     backgroundSize: "cover",
    //     backgroundAttachment: "fixed",
    //   }}
    // >
    <div className="mt-16">
      <CardModal />

      <div className="flex ">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={onDragOver}
        >
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
