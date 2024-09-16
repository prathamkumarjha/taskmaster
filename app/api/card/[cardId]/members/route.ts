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
  const { id,  userImageUrl, userName, designation } = body;
  const userData = await clerkClient.users.getUser(userId);

  if (!id || !userImageUrl || !userName || !designation) {
    return new NextResponse("User ID and User Name are required", { status: 400 });
  }

  try {
    // Ensure the member exists or create it
    const member = await prismadb.members.upsert({
      where: { userId: id },
      update: { userName},
      create: {
        userId: id,
        userName,
        imageUrl: userImageUrl,
      },
    });

    // Create a link between the card and the member in the cardMember table
    const cardMemberLink = await prismadb.cardMember.create({
      data: {
        cardId: cardId,
        memberId: member.userId,
        memberDesignation: designation
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
        entityType: ENTITY_TYPE.MEMBER,        
        entityTitle:list?.name!,         
        userId: userId,                       
        userImage: member.imageUrl,        
        userName: member.userName,
        action: ACTION.JOINED,                
      },
    })

    return NextResponse.json(cardMemberLink, { status: 201 });
  } catch (error) {
    console.error("Error adding member to card:", error);
    return new NextResponse("Failed to add member to card", { status: 500 });
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

  // Get the member ID from query parameters
  const url = new URL(req.url);
  const memberId = url.searchParams.get("id");

  // Ensure memberId is provided
  if (!memberId) {
    return new NextResponse("Member ID is required", { status: 400 });
  }

  // Proceed with deletion
  try {
    const member = await prismadb.members.findUnique({
      where:{
        userId: memberId
      }
    })
    const deletedData = await prismadb.cardMember.delete({
      where: {
        cardId_memberId: {
          cardId: cardId,
          memberId: memberId,
        },
      },
    });

    const userData = await clerkClient.users.getUser(userId);

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
        entityType: ENTITY_TYPE.MEMBER,        
        entityTitle:list?.name!,         
        userId: member?.userId!,                       
        userImage: member?.imageUrl!,        
        userName: member?.userName!,
        action: ACTION.LEFT,                
      },
    })

    
    return NextResponse.json(deletedData, {status:200})
      } catch (error) {
    console.error("Failed to remove member:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}