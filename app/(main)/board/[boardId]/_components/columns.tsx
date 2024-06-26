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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style}>
        <div className="h-[90vh] opacity-20">
          <div className="p-4 m-4 w-[300px] h-30 rounded-lg shadow-lg max-h-full overflow-auto ">
            <SortableContext items={ColumnData.cards}>
              <div key={ColumnData.id} className=" opacity-0">
                <ColumnName listName={ColumnData.name} id={ColumnData.id} />
              </div>
              <div className="space-y-4 mt-4 opacity-0">
                {ColumnData.cards.map(
                  (card) => card && <Card key={card.id} {...card} />
                )}
              </div>
            </SortableContext>
          </div>
          <div className="mt-4 opacity-0">
            <NewCardButton columnId={ColumnData.id} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <div className="h-[90vh]">
        <div className="p-2 m-4 w-[310px] h-30 bg-white rounded-lg shadow-lg max-h-full overflow-auto ">
          <SortableContext items={ColumnData.cards}>
            <ColumnName listName={ColumnData.name} id={ColumnData.id} />
            <div className="space-y-4 mt-4 overflow-auto">
              {ColumnData.cards.map(
                (card) => card && <Card key={card.id} {...card} />
              )}
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
