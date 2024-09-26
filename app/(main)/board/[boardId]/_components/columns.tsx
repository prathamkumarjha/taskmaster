import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ColumnName from "./columnName";
import NewCardButton from "./newCardButton";
import Card from "./card";
import { SortableContext } from "@dnd-kit/sortable";

export interface CardInterface {
  id: string;
  columnId: string;
  name: string;
  description: string | null;
  order: number;
  date: Date | null;
  members: {
    cardId: string;
    memberId: string;
    memberDesignation: string;
    member: {
      userId: string;
      userName: string;
      imageUrl: string;
    };
  }[];
  _count: {
    comments: number;
  };
  colors: {
    id: string;
    cardId: string;
    color: string;
    name: string | null;
  }[];
  checklists: {
    checkListId: string;
    name: string;
    todos: {
      todoId: string;
      name: string;
      done: boolean;
      checkListId: string;
    }[];
  }[];
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

  // console.log(ColumnData);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
        <div className="h-[80vh] opacity-20">
          <div className=" px-2 mx-4 w-[315px] h-30 bg-white rounded-lg shadow-lg max-h-full overflow-auto">
            <SortableContext items={ColumnData.cards}>
              <ColumnName listName={ColumnData.name} id={ColumnData.id} />
              <div className="space-y-4 h-full overflow-auto max-h-full mt-4">
                {ColumnData.cards.map(
                  (card) => card && <Card key={card.id} {...card} />
                )}
                {/* <div className="text-xl flex justify-between w-full   pt-2   bg-white "> */}
                <NewCardButton columnId={ColumnData.id} />
                {/* </div> */}
              </div>
            </SortableContext>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <div className="h-[80vh]">
        <div className=" px-2 mx-4 w-[315px] h-30 bg-white rounded-lg shadow-lg max-h-full overflow-auto">
          <SortableContext items={ColumnData.cards}>
            <ColumnName listName={ColumnData.name} id={ColumnData.id} />
            <div className="space-y-4 h-full overflow-auto max-h-full mt-4">
              {ColumnData.cards.map(
                (card) => card && <Card key={card.id} {...card} />
              )}
              {/* <div className="text-xl flex justify-between w-full   pt-2   bg-white "> */}
              <NewCardButton columnId={ColumnData.id} />
              {/* </div> */}
            </div>
          </SortableContext>
        </div>
      </div>
    </div>
  );
};

export default Column;
