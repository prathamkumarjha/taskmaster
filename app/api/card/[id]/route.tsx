import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { id } = params;
  if (!id) {
    return new NextResponse("id of the card is required", { status: 400 });
  }
  try {
    const CardData = await prismadb.card.findUnique({
      where: {
        id,
      },
    });
    return NextResponse.json(CardData);
  } catch (error) {
    console.log(error);
    return new NextResponse("error occured during fetching the card data", {
      status: 500,
    });
  }
}
