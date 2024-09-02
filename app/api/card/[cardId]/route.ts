import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { string } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { cardId } = params;

  if (!cardId) {
    return new NextResponse("ID of the card is required", { status: 400 });
  }

  try {
    const cardData = await prismadb.card.findUnique({
      where: { id: cardId },
      include: {
        comments: {
          orderBy: {
            createdAt: "desc",
          },
        },
        column: {
          select: {
            name: true,
            boardId: true,
            board: {
              select: {
                name: true,
                organizationId: true,
              },
            },
          },
        },
      members: {
        select:{
          memberDesignation: true,
          member:{
            select:{
              userId: true,
              userName: true,
              imageUrl: true
            }
          }
        }
      },
      colors:{
        where:{
          cardId:cardId
        }
      }
      },
    });

    if (!cardData || cardData.column.board.organizationId !== orgId) {
      return new NextResponse("Card not found or unauthorized", {
        status: 404,
      });
    }

    return NextResponse.json(cardData);
  } catch (error) {
    console.error(error);
    return new NextResponse("An error occurred while fetching the card data", {
      status: 500,
    });
  }
}
