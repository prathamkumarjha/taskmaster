import prismadb from "@/lib/db";
import { NextApiResponse } from "next";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { date } from "zod";
import { clerkClient } from "@clerk/nextjs";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

export async function PUT(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return new NextResponse("unauthorzed", { status: 401 });
  }
  const userData = await clerkClient.users.getUser(userId);
  const { cardId } = params;

  if (!cardId) {
    return new NextResponse("ID of the card is required", { status: 400 });
  }

  const body = await req.json();

  const { date } = body;

  try {
    const updatedDate = await prismadb.card.update({
      where: {
        id: cardId,
      },
      data: {
        date: date.date,
      },
    });

    const list = await prismadb.card.findUnique({
      where:{
       
          id:cardId
        },
  include:{
    column:true
  }
      }
    )



   await  prismadb.audit_log.create({
      data: {
        boardId: list?.column.boardId!,             
        cardId: cardId,                         
        entityType: ENTITY_TYPE.DATE,        
        entityTitle: list?.name!,         
        userId: userId,                       
        userImage: userData.imageUrl,        
        userName: `${userData.firstName} ${userData.lastName}`,
        action: ACTION.UPDATE,                
      },
    })

    return NextResponse.json(updatedDate);
  } catch (error) {
    console.error("Comment was not added", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
export async function DELETE(req: Request,
  { params }: { params: { cardId: string } }
){
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const userData = await clerkClient.users.getUser(userId);
  const { cardId } = params;

  if (!cardId) {
    return new NextResponse("ID of the card is required", { status: 400 });
  }

  try {
    // Update the card's date field to null
    const updatedCard = await prismadb.card.update({
      where: {
        id: cardId,
      },
      data: {
        date: null,  // Clear the date field
      },
    });
    

    const list = await prismadb.card.findUnique({
      where:{
       
          id:cardId
        },
  include:{
    column:true
  }
      }
    )



    await prismadb.audit_log.create({
      data: {
        boardId: list?.column.boardId!,             
        cardId: cardId,                         
        entityType: ENTITY_TYPE.DATE,        
        entityTitle: list?.name!,         
        userId: userId,                       
        userImage: userData.imageUrl,        
        userName: `${userData.firstName} ${userData.lastName}`,
        action: ACTION.DELETE,                
      },
    })

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("Failed to delete date from card", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
