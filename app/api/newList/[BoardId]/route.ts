import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { BoardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    
    const { values,order } = body;

    console.log(body)
    //we have to write the code for security of backend here

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }

    // if (!listName) {
    //   return new NextResponse("name is required", { status: 400 });
    // }


    // Set the order value to be one more than the size of the list table
    

    // sending data to backend if everything is ok!
    const board = await prismadb.list.create({
      data: {
        boardId: params.BoardId,
        name:values.listName,
        order,
      },
    });

    return NextResponse.json(board);
  } catch (error) {
    console.log("newBoard_POST", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}

 