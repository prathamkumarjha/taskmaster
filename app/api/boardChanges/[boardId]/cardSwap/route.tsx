import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

interface CardInterface {
  id: string;
  columnId: string;
  name: string;
  description: string | null;
  order: number;
}

export async function PATCH(
  req: Request,
  { params }: { params: { boardId: string } }
) {
  const body = await req.json();
  console.log(body);
  const { updateableColumn, firstColumn, secondColumn } = body;

  try {
    const { userId } = auth();

    // console.log(updateableColumn, firstColumn, secondColumn);

    if (firstColumn && secondColumn) {
      await Promise.all([
        ...firstColumn.cards.map((card: CardInterface) =>
          prisma.card.update({
            where: { id: card.id },
            data: { order: card.order, columnId: card.columnId },
          })
        ),
        ...secondColumn.cards.map((card: CardInterface) =>
          prisma.card.update({
            where: { id: card.id },
            data: { order: card.order, columnId: card.columnId },
          })
        ),
      ]);
    } else if (updateableColumn) {
      await Promise.all(
        updateableColumn.cards.map((card: CardInterface) =>
          prisma.card.update({
            where: { id: card.id },
            data: { order: card.order, columnId: card.columnId },
          })
        )
      );
    } else {
      return new NextResponse("Active column not found", { status: 400 });
    }

    return new NextResponse("Cards updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating cards:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
