import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const { userId, orgId } = auth();
    const body = await req.json();
    const { ListId } = body;

    if (!userId || !orgId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }

    const oldList = await prismadb.list.findUnique({
      where: { id: ListId },
      include: {
        cards: {
          include: {
            colors: true,
            members: true,
            checklists: {
              include: {
                todos: true, // Include todos in the checklist
              },
            },
          },
        },
      },
    });

    if (!oldList) {
      return new NextResponse("no such list found", { status: 404 });
    }

    const columnCount = await prismadb.list.count({
      where: {
        boardId: params.boardId,
      },
    });

    // Create the new list (a copy)
    const list = await prismadb.list.create({
      data: {
        boardId: params.boardId,
        name: oldList.name + "-copy",
        order: columnCount + 1,
      },
    });

    // Loop through cards and create copies of them, including checklists and todos
    const cardCopies = await Promise.all(
      oldList.cards.map(async (card) => {
        const newCard = await prismadb.card.create({
          data: {
            name: card.name,
            description: card.description,
            order: card.order,
            date: card.date,
            columnId: list.id,
          },
        });

        // Copy colors, members, and checklists (with todos)
        await Promise.all([
          // Copy card colors
          ...card.colors.map((color) =>
            prismadb.colorOnCard.create({
              data: {
                cardId: newCard.id,
                color: color.color,
                name: color.name,
              },
            })
          ),
          // Copy card members
          ...card.members.map((member) =>
            prismadb.cardMember.create({
              data: {
                cardId: newCard.id,
                memberId: member.memberId,
                memberDesignation: member.memberDesignation,
              },
            })
          ),
          // Copy checklists and todos
          ...card.checklists.map(async (checklist) => {
            const newChecklist = await prismadb.checklist.create({
              data: {
                cardId: newCard.id,
                name: checklist.name,
              },
            });

            // Copy todos for the checklist
            if (checklist.todos.length > 0) {
              await prismadb.todo.createMany({
                data: checklist.todos.map((todo) => ({
                  name: todo.name,
                  done: todo.done,
                  checkListId: newChecklist.checkListId, // Use the new checklist ID
                })),
              });
            }
          }),
        ]);
      })
    );

    return NextResponse.json(list, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
