import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
          className="p-4 m-2 w-[180px]  bg-white rounded-lg shadow-md h-full opacity-50"
          onClick={() => console.log("click is working")}
        ></div>
      </div>
    );
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        className="p-4 m-2 w-[180px] h-full bg-white rounded-lg shadow-md"
        onClick={() => console.log("click is working")}
      >
        {ColumnData.name}
      </div>
    </div>
  );
};

export default Column;
