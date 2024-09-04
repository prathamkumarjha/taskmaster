import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) return new NextResponse("Unauthorized", { status: 401 });

  const { cardId } = params;

  if (!cardId) return new NextResponse("Card ID is required", { status: 400 });

  const body = await req.json();
  console.log(body);
  const {  CheckListName } = body;

  try {
    const newCheckList = await prismadb.checklist.create({
      data: {
        cardId: cardId,
        name: CheckListName,
      },
    });
    return NextResponse.json(newCheckList, { status: 201 });
  } catch (error) {
    console.error("Error adding label to card:", error);
    return new NextResponse("Failed to add label to card", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) return new NextResponse("Unauthorized", { status: 401 });

  const { cardId } = params;

  if (!cardId) return new NextResponse("Card ID is required", { status: 400 });

  const body = await req.json();
  console.log("This is coming from patch request", body);

  const { checkListName, checkListId } = body;

  try {
    const newCheckList = await prismadb.checklist.update({
      where: {
        checkListId: checkListId,
      },
      data: {
        name: checkListName,
      },
    });

    console.log(newCheckList);
    return NextResponse.json(newCheckList, { status: 200 });
  } catch (error) {
    console.error("Error updating checklist name:", error);
    return new NextResponse("Failed to update checklist name", { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) return new NextResponse("Unauthorized", { status: 401 });

  const { cardId } = params;

  if (!cardId) return new NextResponse("Card ID is required", { status: 400 });

  // Extract checkListId from URL parameters
  const url = new URL(req.url);
  const checkListId = url.searchParams.get("checkListId");

  if (!checkListId) {
    return new NextResponse("Checklist ID is required", { status: 400 });
  }

  try {
    const deletedCheckList = await prismadb.checklist.delete({
      where: {
        checkListId: checkListId, // Assuming 'id' is the correct field name in your database
      },
    });

    console.log(deletedCheckList);
    return NextResponse.json(deletedCheckList, { status: 200 });
  } catch (error) {
    console.error("Error deleting checklist:", error);
    return new NextResponse("Failed to delete checklist", { status: 500 });
  }
}
