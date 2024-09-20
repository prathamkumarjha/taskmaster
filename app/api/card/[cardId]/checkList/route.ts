import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

export async function POST(
  req: Request, 
  { params }: { params: { cardId: string } }
) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) return new NextResponse("Unauthorized", { status: 401 });
  const userData = await clerkClient.users.getUser(userId);
  const { cardId } = params;

  if (!cardId) return new NextResponse("Card ID is required", { status: 400 });

  const body = await req.json();

  const {  CheckListName } = body;

  try {

  const list = await prismadb.card.findUnique({
    where:{
     
        id:cardId
      },
include:{
  column:{
   include: {
    board:true,
    }
  },
 
}
    }
  )

    const newCheckList = await prismadb.checklist.create({
      data: {
        cardId: cardId,
        name: CheckListName,
      },
    });

  await prismadb.audit_log.create({
      data: {
        orgId:list?.column.board.organizationId!,
        boardId: list?.column.boardId!,             
        cardId: cardId,                         
        entityType: ENTITY_TYPE.CHECKLIST,        
        entityTitle: CheckListName,         
        userId: userId,                       
        userImage: userData.imageUrl,        
        userName: `${userData.firstName} ${userData.lastName}`,
        action: ACTION.CREATE,                
      },
    })

    return NextResponse.json(newCheckList, { status: 201 });
  } catch (error) {
    console.error("Error adding checkList  to card:", error);
    return new NextResponse("Failed to add label to card", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) return new NextResponse("Unauthorized", { status: 401 });

  const { cardId } = params;

  if (!cardId) return new NextResponse("Card ID is required", { status: 400 });

  const body = await req.json();
  

  const { checkListName, checkListId } = body;

  try {
    const newCheckList = await prismadb.checklist.update({
      where: {
        checkListId: checkListId,
      },
      data: {
        name: checkListName,
      },
    });

    
    return NextResponse.json(newCheckList, { status: 200 });
  } catch (error) {
    console.error("Error updating checklist name:", error);
    return new NextResponse("Failed to update checklist name", { status: 500 });
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

  // Extract checkListId from URL parameters
  const url = new URL(req.url);
  const checkListId = url.searchParams.get("checkListId");

  if (!checkListId) {
    return new NextResponse("Checklist ID is required", { status: 400 });
  }

  try {
    const deletedCheckList = await prismadb.checklist.delete({
      where: {
        checkListId: checkListId, // Assuming 'id' is the correct field name in your database
      },
    });

    const list = await prismadb.card.findUnique({
      where:{
       
          id:cardId
        },
  include:{
    column:{
      include: {
       board:true,
       }
     },
  }
      }
    )

  await   prismadb.audit_log.create({
      data: {
        orgId:list?.column.board.organizationId!,
        boardId: list?.column.boardId!,             
        cardId: cardId,                         
        entityType: ENTITY_TYPE.CHECKLIST,        
        entityTitle: deletedCheckList.name,         
        userId: userId,                       
        userImage: userData.imageUrl,        
        userName: `${userData.firstName} ${userData.lastName}`,
        action: ACTION.DELETE,                
      },
    })

    return NextResponse.json(deletedCheckList, { status: 200 });
  } catch (error) {
    console.error("Error deleting checklist:", error);
    return new NextResponse("Failed to delete checklist", { status: 500 });
  }
}
