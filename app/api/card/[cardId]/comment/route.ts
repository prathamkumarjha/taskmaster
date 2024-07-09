import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

export async function POST(req: Request, { params }: { params: { cardId: string } }) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { cardId } = params;

  if (!cardId) {
    return new NextResponse("ID of the card is required", { status: 400 });
  }

  const body = await req.json();
  const { data, parentId } = body;  // Assuming parentId is passed if it's a nested comment

  const userData = await clerkClient.users.getUser(userId!);

  try {
    const comment = await prismadb.comment.create({
      data: {
        card: {
          connect: { id: cardId }
        },
        content: data,
        userId,
        userImage: userData.imageUrl,
        userName: userData.firstName + " "+ userData.lastName ,
        parent: parentId ? { connect: { id: parentId } } : undefined
      }
    });
    return NextResponse.json(comment);
  } catch (error) {
    console.error("Comment was not added", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
