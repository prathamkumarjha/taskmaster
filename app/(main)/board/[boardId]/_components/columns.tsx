import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ColumnName from "./columnName";
import NewCardButton from "./newCardButton";
import Card from "./card";
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ColumnData.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div
          className="p-4 m-2 w-[180px]  bg-white rounded-lg shadow-md h-40 opacity-50"
          onClick={() => console.log("click is working")}
        ></div>
      </div>
    );
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="p-4 m-4 w-[180px] h-30 bg-white rounded-lg shadow-lg">
        <ColumnName listName={ColumnData.name} id={ColumnData.id} />
        <div className="space-y-2 mt-4 ">
          {ColumnData.cards.map((card) => (
            <Card key={card.id} {...card} />
          ))}
        </div>
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
