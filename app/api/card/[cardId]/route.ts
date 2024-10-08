import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { string } from "zod";
import { clerkClient } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

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
    const data = await prismadb.card.findUnique({
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
      },
      },
    });

    if (!data || data.column.board.organizationId !== orgId) {
      return new NextResponse("Card not found or unauthorized", {
        status: 404,
      });
    }

const logs = await prismadb.audit_log.findMany(
  {
    where:{
      cardId:cardId
    }
  }
)

const cardData = {...data,logs}

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
  const userData = await clerkClient.users.getUser(userId);
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
    
    const list = await prismadb.card.findUnique({
      where:{
       
          id:cardId
        },
  include:{
    column:{
      include:{
        board:true,
      }
    }
  }
      }
    )

     prismadb.audit_log.create({
      data: {
        orgId:list?.column.board.organizationId!,
        boardId: list?.column.boardId!,             
        cardId: cardId,                         
        entityType: ENTITY_TYPE.CARD,        
        entityTitle: list?.name!,         
        userId: userId,                       
        userImage: userData.imageUrl,        
        userName: `${userData.firstName} ${userData.lastName}`,
        action: ACTION.DELETE,                
      },
    })
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
  const userData = await clerkClient.users.getUser(userId);
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

    const list = await prismadb.card.findUnique({
      where:{
       
          id:cardId
        },
  include:{
    column:{
      include:{
        board:true,
      }
    }
  }
      }
    )

     prismadb.audit_log.create({
      data: {
        
        orgId:list?.column.board.organizationId!,
        boardId: list?.column.boardId!,             
        cardId: cardId,                         
        entityType: ENTITY_TYPE.CARD,        
        entityTitle: name,         
        userId: userId,                       
        userImage: userData.imageUrl,        
        userName: `${userData.firstName} ${userData.lastName}`,
        action: ACTION.UPDATE,                
      },
    })

    return NextResponse.json(cardData);
  } catch (error) {
    console.error(error);
    return new NextResponse("An error occurred while fetching the card data", {
      status: 500,
    });
  }
}

