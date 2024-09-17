import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

export async function POST(req: Request, { params }: { params: { cardId: string } }) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { cardId } = params;

  if (!cardId) {
    return new NextResponse("ID of the card is required", { status: 400 });
  }

  const body = await req.json();
  const { data, parentId } = body;

  const userData = await clerkClient.users.getUser(userId);

  try {
    // Check if parent comment exists if parentId is provided
    if (parentId) {
      const parentComment = await prismadb.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return new NextResponse('Parent comment does not exist', { status: 400 });
      }
    }

    // Create new comment
    const comment = await prismadb.comment.create({
      data: {
        card: {
          connect: { id: cardId }
        },
        content: data,
        userId,
        userImage: userData.imageUrl,
        userName: `${userData.firstName} ${userData.lastName}`,
        parent: parentId ? { connect: { id: parentId } } : undefined
      }
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
      entityType: ENTITY_TYPE.CARD,        
      entityTitle: "",         
      userId: userId,                       
      userImage: userData.imageUrl,        
      userName: `${userData.firstName} ${userData.lastName}`,
      action: ACTION.COMMENT,                
    },
  })


    return NextResponse.json(comment);
  } catch (error) {
    console.error("Comment was not added", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request, {params}:{params:{cardId:string}}){

  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { cardId } = params;

  if (!cardId) {
    return new NextResponse("ID of the card is required", { status: 400 });
  }

  const comments = await prismadb.comment.findMany({
    where:{
      cardId
    },
    orderBy:{
      createdAt: "desc"
    }
  })

  
  return NextResponse.json(comments)

}

export async function DELETE(req: Request) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  const { cardId, commentId } = body;

  if (!cardId || !commentId) {
    return new NextResponse("Card ID and Comment ID are required", { status: 400 });
  }

  // Custom function to recursively delete comments and their children
  async function deleteCommentAndChildren(commentId: string) {
    // Find all child comments
    const childComments = await prismadb.comment.findMany({
      where: {
        parentId: commentId
      }
    });

    // Recursively delete each child comment
    for (const child of childComments) {
      await deleteCommentAndChildren(child.id);
    }

    // Delete the comment itself
    await prismadb.comment.delete({
      where: { id: commentId }
    });
  }

  try {
    await deleteCommentAndChildren(commentId);
    return new NextResponse("Comment and its children deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
