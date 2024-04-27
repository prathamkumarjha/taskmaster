import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { orgId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, imageUrl } = body;

    //we have to write the code for security of backend here

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("imageUrl is reqired", { status: 400 });
    }
    // sending data to backend id everything is ok!
    const board = await prismadb.board.create({
      data: {
        organizationId: params.orgId,
        name,
        imageUrl,
      },
    });

    return NextResponse.json(board);
  } catch (error) {
    console.log("newBoard_POST", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}
