import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { board: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, columnId } = body;

    //we have to write the code for security of backend here

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }
    const userData = await clerkClient.users.getUser(userId);
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    // Set the order value to be one more than the size of the list table

    const cardOrder = await prismadb.card.findMany({
      where: {
        columnId,
      },
    });
    // sending data to backend if everything is ok!
    const board = await prismadb.card.create({
      data: {
        name: name,
        order: cardOrder.length + 1,
        columnId: columnId,
      },
      include: {
        column: {
          include: {
            board: true,
          },
        },
      },
    });

    await prismadb.audit_log.create({
      data: {
        orgId: board.column.board.organizationId,
        boardId: params.board,
        cardId: board.id,
        entityType: ENTITY_TYPE.CARD,
        entityTitle: board.name,
        userId: userId,
        userImage: userData.imageUrl,
        userName: `${userData.firstName} ${userData.lastName}`,
        action: ACTION.CREATE,
      },
    });
    return NextResponse.json(board);
  } catch (error) {
    console.log("newBoard_POST", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}
