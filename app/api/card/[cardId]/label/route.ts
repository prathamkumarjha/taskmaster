import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) return new NextResponse("Unauthorized", { status: 401 });

  const { cardId } = params;

  if (!cardId) return new NextResponse("Card ID is required", { status: 400 });

  const body = await req.json();
 
  const {  labelName, selectedColor, color } = body;
  const userData = await clerkClient.users.getUser(userId);
 

  try {
    let newLabel ;
    if(!labelName){
        newLabel = await prismadb.colorOnCard.create({
            data: {
              cardId: cardId,
              color: selectedColor,
            },
          });
    }
    else {
      // if(!selectedColor){
      //   return new NextResponse("color and labelName is required ", {status:400})
      // }
        newLabel = await prismadb.colorOnCard.create({
            data: {
              cardId: cardId,
              color: selectedColor,
              name: labelName,
            },
          });
    }
    
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

  await  prismadb.audit_log.create({
      data: {
        orgId:list?.column.board.organizationId!,
        boardId: list?.column.boardId!,             
        cardId: cardId,                         
        entityType: ENTITY_TYPE.LABEL,        
        entityTitle: list?.name!,         
        userId: userId,                       
        userImage: userData.imageUrl,        
        userName: `${userData.firstName} ${userData.lastName}`,
        action: ACTION.CREATE,                
      },
    })


    return NextResponse.json(newLabel, { status: 201 });
  } catch (error) {
    console.error("Error adding label to card:", error);
    return new NextResponse("Failed to add label to card", { status: 500 });
  }
}



export async function DELETE(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) return new NextResponse("Unauthorized", { status: 401 });
  const userData = await clerkClient.users.getUser(userId);
  const { cardId } = params;

  if (!cardId) return new NextResponse("Card ID is required", { status: 400 });

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return new NextResponse("Color ID is required", { status: 400 });
  }

  try {
    const deleted = await prismadb.colorOnCard.delete({
      where: {
        id: id // Prisma expects the unique identifier for deletion
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

  await prismadb.audit_log.create({
      data: {
        orgId:list?.column.board.organizationId!,
        boardId: list?.column.boardId!,             
        cardId: cardId,                         
        entityType: ENTITY_TYPE.LABEL,        
        entityTitle: list?.name!,         
        userId: userId,                       
        userImage: userData.imageUrl,        
        userName: `${userData.firstName} ${userData.lastName}`,
        action: ACTION.DELETE,                
      },
    })


    return NextResponse.json(deleted, { status: 200 });
  } catch (error) {
    console.error("Error deleting label:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
