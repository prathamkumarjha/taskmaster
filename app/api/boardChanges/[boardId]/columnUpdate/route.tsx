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

    const { name, id } = body;
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    await prisma.list.update({
      where: { id },
      data: { name },
    });

    return new NextResponse("columns name updated sucessfully", {
      status: 200,
    });
  } catch (error) {
    console.log("error in changing the name of the list");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
