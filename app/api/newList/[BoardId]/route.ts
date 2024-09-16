import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs";

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

    const userData = await clerkClient.users.getUser(userId);
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
    
    await prismadb.audit_log.create({
      data: {
        boardId: params.BoardId,              // Mandatory board ID
        cardId: null,                         // No card involved here, set to null
        entityType: ENTITY_TYPE.LIST,         // You are working with a list
        entityTitle: values.listName,         // Name of the list being created
        userId: userId,                       // User performing the action
        userImage: userData.imageUrl,         // User's image from Clerk
        userName: `${userData.firstName} ${userData.lastName}`, // User's full name
        action: ACTION.CREATE,                // Action is CREATE
      },
    });
    
    return NextResponse.json(board);
  } catch (error) {
    console.log("newBoard_POST", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}

 