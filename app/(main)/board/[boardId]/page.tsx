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
    <div className="h-full">
      {/* <CardModal /> */}
      <BoardModalProvider />
      <Board BoardData={board} ColumnData={columns} />
    </div>
  );
};

export default boardLayout;
