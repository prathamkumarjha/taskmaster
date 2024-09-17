import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { FaRegClock } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardInterface } from "./columns";
import { TbCheckbox } from "react-icons/tb";
import Image from "next/image";

const Card: React.FC<CardInterface> = (cardData: CardInterface) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: cardData.id,
    data: {
      type: "card",
      ...cardData,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Flatten all todos from the checklists into one array
  const todos = cardData.checklists.flatMap((checklist) => checklist.todos);

  // Calculate total and completed todos
  const totalTodos = todos.length;

  const completedTodos = todos.filter((todo) => todo.done).length;

  const formattedDate = cardData?.date
    ? new Date(cardData.date)
        .toLocaleDateString("en-US", {
          day: "numeric",
          month: "short", // This will give you "Sep" instead of "September"
        })
        .replace(",", "") // Remove the comma after the day
    : "";

  const cardModal = useCardModal();
  if (isDragging) {
    return (
      <Button
        className=" bg-opacity-50 font-semibold bg-black shadow-lg w-full h-full text-lg"
        ref={setNodeRef}
        style={style}
      >
        <div>
          <div className="grid grid-cols-5 gap-1 m-2">
            {cardData.colors.map((color) => (
              <div
                key={color.id}
                className={`bg-${color.color} w-12 h-3 rounded-lg`}
              ></div>
            ))}
          </div>
          <div className="opacity-75">{cardData.name}</div>
          <div className="flex  text-sm items-center gap-3">
            <div className="flex items-center gap-1">
              {cardData.date ? <FaRegClock className="text-white" /> : ""}
              {formattedDate}
            </div>
            {cardData._count.comments > 0 ? (
              <div className="flex items-center gap-1">
                <FiMessageSquare /> {cardData._count.comments}
              </div>
            ) : (
              ""
            )}
            {totalTodos != 0 ? (
              <div
                className={`${
                  completedTodos / totalTodos == 1
                    ? "bg-green-300 text-black rounded-lg px-2"
                    : ""
                } flex items-center gap-1`}
              >
                <TbCheckbox /> {completedTodos} /{totalTodos}
              </div>
            ) : (
              ""
            )}
            <div className="flex">
              {cardData.members.map((member, index) => (
                <div
                  key={member.memberId}
                  className={`relative ${index !== 0 ? "-ml-2" : ""}`} // Add negative margin to overlap
                >
                  <Image
                    src={member.member.imageUrl}
                    alt="img"
                    width={40}
                    height={40}
                    className="rounded-full "
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Button>
    );
  }
  return (
    <div>
      <Button
        className=" hover:bg-opacity-75 font-semibold bg-black shadow-md mb-2 shadow-black w-full text-lg h-full"
        ref={setNodeRef}
        style={{
          ...style,
          whiteSpace: "normal",
          display: "block",
          lineHeight: "normal",
        }}
        {...attributes}
        {...listeners}
        onClick={() => {
          cardModal.onOpen(cardData.id);
        }}
      >
        <div className="grid grid-cols-5 gap-1 m-2">
          {cardData.colors.map((color) => (
            <div
              key={color.id}
              className={`bg-${color.color} w-12 h-3 rounded-lg`}
            ></div>
          ))}
        </div>

        <div className="whitespace-normal  mb-4">{cardData.name}</div>
        <div className="flex  text-sm items-center gap-3">
          <div className="flex items-center gap-1">
            {cardData.date ? <FaRegClock className="text-white" /> : ""}
            {formattedDate}
          </div>
          {cardData._count.comments > 0 ? (
            <div className="flex items-center gap-1">
              <FiMessageSquare /> {cardData._count.comments}
            </div>
          ) : (
            ""
          )}
          {totalTodos != 0 ? (
            <div
              className={`${
                completedTodos / totalTodos == 1
                  ? "bg-green-300 text-black rounded-lg px-2"
                  : ""
              } flex items-center gap-1`}
            >
              <TbCheckbox /> {completedTodos} /{totalTodos}
            </div>
          ) : (
            ""
          )}
          <div className="flex">
            {cardData.members.map((member, index) => (
              <div
                key={member.memberId}
                className={`relative ${index !== 0 ? "-ml-2" : ""}`} // Add negative margin to overlap
              >
                <Image
                  src={member.member.imageUrl}
                  alt="img"
                  width={40}
                  height={40}
                  className="rounded-full "
                />
              </div>
            ))}
          </div>
        </div>
      </Button>
    </div>
  );
};

export default Card;
