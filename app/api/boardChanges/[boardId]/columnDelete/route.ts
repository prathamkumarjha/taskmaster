import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const { userId, orgId } = auth();

    // Parse the query params from the request URL
    const { searchParams } = new URL(req.url);
    const columnId = searchParams.get("columnId");

    // Check if user is authenticated
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    // Check for required columnId
    if (!columnId) {
      return new NextResponse("Column ID is required", { status: 400 });
    }

    // Optionally validate boardId or user permissions
    if (!params.boardId) {
      return new NextResponse("Board ID is required", { status: 400 });
    }


    // Fetch all cards in the column and delete them if necessary
    await prismadb.card.deleteMany({
      where: {
        columnId: columnId,
      },
    });
    
    // Perform the deletion
const deleted = await prismadb.list.delete({
      where: {
        id: columnId,
      },
    });
    const userData = await clerkClient.users.getUser(userId);
   await prismadb.audit_log.create({
      data: {
        boardId:deleted.boardId ,             
        cardId: null,                         
        entityType: ENTITY_TYPE.LIST,        
        entityTitle: deleted.name,         
        userId: userId,                       
        userImage: userData.imageUrl,        
        userName: `${userData.firstName} ${userData.lastName}`,
        action: ACTION.DELETE,                
      },
    })
    return  NextResponse.json(deleted, { status: 200 });

  } catch (error) {
    console.error("Error deleting column:", error);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }
}
