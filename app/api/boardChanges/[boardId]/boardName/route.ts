import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { boardId: string } }
  ) {
    const { userId, orgId } = auth();
  
    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    const { boardId } = params;
  
    if (!boardId) {
      return new NextResponse("ID of the board is required", { status: 400 });
    }
  
    const body = await req.json();
    const {name}:{name:string} = body;
  
    try {
      const cardData = await prismadb.board.update
      ({
        where: { id: boardId },
       data:{
        name:name
       }
      });
  
      return NextResponse.json(cardData);
    } catch (error) {
      console.error(error);
      return new NextResponse("Internal error", {
        status: 500,
      });
    }
  }
  
  