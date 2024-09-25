import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { incrementAvailableCount, hasAvailableCount } from "@/lib/orgLimit";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";
import { checkSubscription } from "@/lib/subscription";
export async function POST(
  req: Request,
  { params }: { params: { orgId: string } }
) {
  try {
    const { userId, orgId } = auth();
    const body = await req.json();

    const isPro = await checkSubscription();
    const { name, imageUrl } = body;

    if (!userId || !orgId) {
      return new NextResponse("unauthenticated", { status: 401 });
    }

    const userData = await clerkClient.users.getUser(userId);
    const canCreate = await hasAvailableCount();
    if (!canCreate && !isPro) {
      return {
        error:
          "you have already created maximum number of boards allowed for free tier!",
      };
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

    await incrementAvailableCount();
    await prismadb.audit_log.create({
      data: {
        orgId: params.orgId,
        boardId: board.id,
        entityType: ENTITY_TYPE.BOARD,
        entityTitle: board.name,
        userId: userId,
        userImage: userData.imageUrl,
        userName: userData.firstName + " " + userData.lastName,
        action: ACTION.CREATE,
      },
    });

    return NextResponse.json(board);
  } catch (error) {
    console.log("newBoard_POST", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}
