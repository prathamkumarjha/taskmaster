import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { PrismaClient } from '@prisma/client';
export async function PATCH(
  req: Request,
  { params }: { params: { orgId: string, id: string } }
) {
  try {
    const { userId } = auth();
    const { favorite } = await req.json();

    // Check if user is authenticated
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Fetch the current board data from the database
    const currentBoard = await prismadb.board.findUnique({
      where: {
        id: params.id,
      },
    });

    const prisma = new PrismaClient();

    // Update the favorite status of the board
    const updatedBoard = await prismadb.board.update({
      where: {
        id: params.id,
      },
      data: {
        favorite,
      },
    });
    

    return NextResponse.json(updatedBoard);
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
