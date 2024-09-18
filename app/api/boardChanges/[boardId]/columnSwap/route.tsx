import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { ColumnInterface } from "@/app/(main)/board/[boardId]/_components/board";
export async function PATCH(
  req: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    // console.log(body);
    const { items }: { items: ColumnInterface[] } = body;
    console.log(items);
    const size = items.length;
    const updates = items.map((column, index) => {
      return prisma.list.update({
        where: { id: column.id },
        data: { order: size - index },
      });
    });

    await Promise.all(updates);

    return new NextResponse("Columns order switched successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error switching columns order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
