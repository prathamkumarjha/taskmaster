import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ColumnName from "./columnName";
import NewCardButton from "./newCardButton";
import Card from "./card";
import { SortableContext } from "@dnd-kit/sortable";

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
  } = useSortable({
    id: ColumnData.id,
    data: {
      type: "column",
      ...ColumnData,
    },
  });

  {
    // console.log(ColumnData);
  }
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        //  {...attributes} {...listeners}
      >
        <div className="p-4 m-2 w-[180px]  bg-white rounded-lg shadow-md h-40 opacity-50"></div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="h-[90vh]">
        <div className="p-4 m-4 w-[180px] h-30 bg-white rounded-lg shadow-lg max-h-full overflow-auto ">
          <SortableContext items={ColumnData.cards}>
            <div key={ColumnData.id}>
              <ColumnName listName={ColumnData.name} id={ColumnData.id} />
            </div>
            <div className="space-y-2 mt-4 ">
              {ColumnData.cards.map((card) => (
                <div key={card.id}>
                  <Card {...card} />
                </div>
              ))}
            </div>
          </SortableContext>

          <div className="mt-4">
            <NewCardButton columnId={ColumnData.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Column;
