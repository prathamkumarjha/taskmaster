"use client";
import NewListButton from "./newListButton";
import { DndContext } from "@dnd-kit/core";

interface BoardInterface {
  id: string;
  organizationId: string;
  name: string;
  imageUrl: string;
  favorite: boolean;
}
const Board: React.FC<{ BoardData: BoardInterface }> = ({ BoardData }) => {
  return (
    <div
      className="relative h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${BoardData.imageUrl})`,
        paddingTop: "4px", // Add padding-top instead of using margin
      }}
    >
      <DndContext>
        <div className="m-4">
          <NewListButton />
        </div>
      </DndContext>
    </div>
  );
};

export default Board;
