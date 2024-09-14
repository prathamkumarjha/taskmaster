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
      },
      checklists: {
        select:{
          checkListId:true,
          name: true,
          todos:{
            select:{
            todoId:true,
            name:true,
            done: true,
            checkListId:true

            }
          },
          cardId: true,
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




export async function DELETE(req: Request, { params }: { params: { cardId: string } }) {
  const { userId, orgId } = auth();

  // Check for authentication
  if (!userId) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  // Check for authorization
  if (!orgId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { cardId } = params;

  // Ensure cardId is provided
  if (!cardId) {
    return new NextResponse("Card ID is required", { status: 400 });
  }


  // Proceed with deletion
  try {
    const deletedData = await prismadb.card.delete({
      where: {
       id: cardId
      },
    });
    
    return NextResponse.json(deletedData, {status:200})
      } catch (error) {
    console.error("Failed to remove member:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


export async function PUT(
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

  const body = await req.json();
  const {name}:{name:string} = body;

  try {
    const cardData = await prismadb.card.update
    ({
      where: { id: cardId },
     data:{
      name:name
     }
    });

    return NextResponse.json(cardData);
  } catch (error) {
    console.error(error);
    return new NextResponse("An error occurred while fetching the card data", {
      status: 500,
    });
  }
}

