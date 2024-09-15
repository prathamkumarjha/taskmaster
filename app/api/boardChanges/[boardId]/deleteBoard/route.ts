import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { boardId: string } }
) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { boardId } = params;

  if (!boardId) {
    return new NextResponse("ID of the board is required", { status: 400 });
  }

  try {
    // Deleting the board
    const cardData = await prismadb.board.delete({
      where: { id: boardId },
    });

    return NextResponse.json(cardData);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
