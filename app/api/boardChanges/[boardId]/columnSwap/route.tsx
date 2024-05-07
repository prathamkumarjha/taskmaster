import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function PATCH(
  req: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    console.log(body);
    const { activeColumnId, overColumnId } = body;
    // if (!userId) {
    //   return new NextResponse("unauthenticated", { status: 400 });
    // }

    if (!activeColumnId) {
      return new NextResponse("column1 id is missing", { status: 400 });
    }

    if (!overColumnId) {
      return new NextResponse("column2 id is missing", { status: 400 });
    }

    // Fetch columns and their orders
    const [column1, column2] = await Promise.all([
      prisma.list.findUnique({ where: { id: activeColumnId } }),
      prisma.list.findUnique({ where: { id: overColumnId } }),
    ]);

    if (!column1 || !column2) {
      return new NextResponse("One or both columns not found", { status: 404 });
    }

    // Swap order values
    const tempOrder = column1.order;
    await prisma.list.update({
      where: { id: activeColumnId },
      data: { order: column2.order },
    });
    await prisma.list.update({
      where: { id: overColumnId },
      data: { order: tempOrder },
    });

    return new NextResponse("Columns order switched successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error switching columns order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
