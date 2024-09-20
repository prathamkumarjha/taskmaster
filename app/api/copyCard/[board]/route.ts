import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { board: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { cardId, columnId } = body;

    // Security check: Ensure user is authenticated
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    const userData = await clerkClient.users.getUser(userId);
    // Validate input: Ensure cardId is provided
    if (!cardId) {
      return new NextResponse("Card ID is required", { status: 404 });
    }

    // Get the order for the new card (set one more than the current number of cards in the column)
    const cardOrder = await prismadb.card.findMany({
      where: {
        columnId,
      },
    });

    // Find the card to be copied, including its related data (colors, members, checklists)
    const card = await prismadb.card.findUnique({
      where: {
        id: cardId,
      },
      include: {
        colors: true,
        members: true,
        checklists: {
          include: {
            todos: true, // Include the todos inside the checklists
          },
        },
      },
    });

    if (!card) {
      return new NextResponse("Card not found", { status: 404 });
    }

    // Copy the card's basic details
    const newCard = await prismadb.card.create({
      data: {
        name: card.name +"-copy",
        description: card.description,
        order: cardOrder.length + 1,
        columnId: columnId,
        date: card.date,
      },
    });

    // Copy colors associated with the card
    if (card.colors.length > 0) {
      const colorData = card.colors.map((color) => ({
        cardId: newCard.id,
        color: color.color,
        name: color.name,
      }));
      await prismadb.colorOnCard.createMany({ data: colorData });
    }

    // Copy members associated with the card
    if (card.members.length > 0) {
      const memberData = card.members.map((member) => ({
        cardId: newCard.id,
        memberId: member.memberId,
        memberDesignation: member.memberDesignation,
      }));
      await prismadb.cardMember.createMany({ data: memberData });
    }

    // Copy checklists associated with the card
    if (card.checklists.length > 0) {
      for (const checklist of card.checklists) {
        const newChecklist = await prismadb.checklist.create({
          data: {
            name: checklist.name,
            cardId: newCard.id,
          },
        });

        // Copy todos under each checklist
        if (checklist.todos.length > 0) {
          const todoData = checklist.todos.map((todo) => ({
            name: todo.name,
            done: todo.done,
            checkListId: newChecklist.checkListId,
          }));
          await prismadb.todo.createMany({ data: todoData });
        }
      }
    }

    const list = await prismadb.card.findUnique({
      where:{
       
          id:cardId
        },
  include:{
    column:{
      include:{
        board:true
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
        entityType: ENTITY_TYPE.CARD,        
        entityTitle: newCard.name,         
        userId: userId,                       
        userImage: userData.imageUrl,        
        userName: `${userData.firstName} ${userData.lastName}`,
        action: ACTION.CREATE,                
      },
    })
    return NextResponse.json(newCard);
  } catch (error) {
    console.log("Error copying card:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
