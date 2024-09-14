import prismadb from "@/lib/db";
import Board from "./_components/board";
import { redirect } from "next/navigation";
import CardModal from "./_components/cardModal/cardModal";
import BoardModalProvider from "../../dashboard/_components/board-modal-provider";

const boardLayout = async ({ params }: { params: { boardId: string } }) => {
  const id = params.boardId;
  const board = await prismadb.board.findFirst({
    where: {
      id,
    },
  });

  const columns = await prismadb.list.findMany({
    where: {
      boardId: id,
    },
    include: {
      cards: {
        include: {
          colors: true,
          members: {
            include: {
              member: true,
            },
          },
          checklists: {
            include: {
              todos: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "desc",
    },
  });

  if (!board) {
    redirect("/");
  }

  return (
    <div>
      {/* <CardModal /> */}
      <BoardModalProvider />
      <div
        className="relative h-screen bg-cover bg-center bg-no-repeat overflow-scroll"
        draggable="false"
        style={{
          backgroundImage: `url(${board.imageUrl})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="bg-black bg-opacity-30 h-12 mb-4 w-screen text-4xl pl-4 text-white fixed ">
          {board.name}
        </div>
        <Board BoardData={board} ColumnData={columns} />
      </div>
    </div>
  );
};

export default boardLayout;
