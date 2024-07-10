import prismadb from "@/lib/db";
import { NextApiResponse } from "next";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return new NextResponse("unauthorzed", { status: 401 });
  }

  const { cardId } = params;

  if (!cardId) {
    return new NextResponse("ID of the card is required", { status: 400 });
  }

  const body = await req.json();

  const { data } = body;

  try {
    const description = await prismadb.card.update({
      where: {
        id: cardId,
      },
      data: {
        description: data,
      },
    });
    return NextResponse.json(description);
  } catch (error) {
    console.error("Comment was not added", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
